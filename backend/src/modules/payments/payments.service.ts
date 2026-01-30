import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, PaymentPurpose } from '@prisma/client';
import { JuspayService } from './juspay.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private juspayService: JuspayService,
  ) {}

  async initiateRegistrationPayment(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const amount = user.role === 'ARBITER' ? 250 : 75;
    const orderId = `KKDCA_REG_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        purpose: PaymentPurpose.MEMBERSHIP_NEW,
        description: `KKDCA Membership ${new Date().getFullYear()} - Registration`,
        amount,
        gatewayOrderId: orderId,
        status: PaymentStatus.PENDING,
      },
    });

    const adminUrl = this.configService.get<string>('ADMIN_URL', 'https://register.kallaichess.com');
    const returnUrl = `${adminUrl}/register/payment-status?order_id=${orderId}`;

    try {
      const session = await this.juspayService.createSession({
        orderId,
        amount,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerId: user.id,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
        returnUrl,
        description: `KKDCA Membership Fee ${new Date().getFullYear()}`,
      });

      return {
        paymentId: payment.id,
        orderId,
        amount,
        currency: 'INR',
        payment_links: session.payment_links,
        sdk_payload: session.sdk_payload,
        id: session.id,
      };
    } catch (error: any) {
      this.logger.error(`Payment session creation failed: ${error.message}`);
      // Update payment status to failed
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Payment gateway is temporarily unavailable. Please try again later.');
    }
  }

  async initiateMembershipPayment(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const amount = user.role === 'ARBITER' ? 250 : 75;
    const orderId = `KKDCA_MEM_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        purpose: PaymentPurpose.MEMBERSHIP_NEW,
        description: `KKDCA Membership ${new Date().getFullYear()}`,
        amount,
        gatewayOrderId: orderId,
        status: PaymentStatus.PENDING,
      },
    });

    const adminUrl = this.configService.get<string>('ADMIN_URL', 'https://register.kallaichess.com');
    const returnUrl = `${adminUrl}/payment-status?order_id=${orderId}`;

    try {
      const session = await this.juspayService.createSession({
        orderId,
        amount,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerId: user.id,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
        returnUrl,
        description: `KKDCA Membership Fee ${new Date().getFullYear()}`,
      });

      return {
        paymentId: payment.id,
        orderId,
        amount,
        currency: 'INR',
        payment_links: session.payment_links,
        sdk_payload: session.sdk_payload,
      };
    } catch (error: any) {
      this.logger.error(`Payment session creation failed: ${error.message}`);
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw new BadRequestException('Payment gateway is temporarily unavailable.');
    }
  }

  async initiateTournamentPayment(userId: string, tournamentId: string, registrationId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }

    if (!tournament.entryFee || Number(tournament.entryFee) === 0) {
      throw new BadRequestException('This tournament has no entry fee');
    }

    const orderId = `KKDCA_TRN_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;
    const amount = Number(tournament.entryFee);

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        tournamentId,
        purpose: PaymentPurpose.TOURNAMENT_REGISTRATION,
        description: `Tournament: ${tournament.name}`,
        amount,
        gatewayOrderId: orderId,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      paymentId: payment.id,
      orderId,
      amount,
      currency: 'INR',
    };
  }

  async handleCallback(orderId: string, gatewayResponse: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // If already processed, skip
    if (payment.status === PaymentStatus.SUCCESS) {
      return { success: true, orderId, message: 'Already processed' };
    }

    // Verify payment status with Juspay
    let isSuccess = false;
    let gatewayPaymentId: string | undefined;

    try {
      const orderStatus = await this.juspayService.getOrderStatus(orderId);
      isSuccess = this.juspayService.isPaymentSuccess(orderStatus.status_id);
      gatewayPaymentId = orderStatus.txn_id;

      // Store full gateway response
      gatewayResponse = orderStatus;
    } catch (error: any) {
      this.logger.error(`Failed to verify payment with gateway: ${error.message}`);
      // Fall back to callback data
      isSuccess = gatewayResponse.status === 'CHARGED' || gatewayResponse.status === 'SUCCESS';
      gatewayPaymentId = gatewayResponse.txn_id || gatewayResponse.paymentId;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        gatewayPaymentId: gatewayPaymentId || null,
        gatewayResponse,
        completedAt: new Date(),
        receiptNo: isSuccess ? `RCPT_${Date.now()}` : null,
      },
    });

    // If membership payment successful, activate membership
    if (isSuccess && payment.purpose === PaymentPurpose.MEMBERSHIP_NEW) {
      await this.activateMembership(payment.userId);
    }

    // If tournament payment successful, confirm registration
    if (isSuccess && payment.purpose === PaymentPurpose.TOURNAMENT_REGISTRATION) {
      await this.prisma.tournamentRegistration.updateMany({
        where: { paymentId: payment.id },
        data: { status: 'CONFIRMED' },
      });
    }

    return { success: isSuccess, orderId };
  }

  async verifyAndGetStatus(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
      select: {
        id: true,
        status: true,
        amount: true,
        purpose: true,
        completedAt: true,
        receiptNo: true,
        gatewayOrderId: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // If payment is still pending, check with gateway
    if (payment.status === PaymentStatus.PENDING) {
      try {
        const result = await this.handleCallback(orderId, {});
        // Re-fetch updated payment
        const updatedPayment = await this.prisma.payment.findUnique({
          where: { gatewayOrderId: orderId },
          select: {
            id: true,
            status: true,
            amount: true,
            purpose: true,
            completedAt: true,
            receiptNo: true,
            gatewayOrderId: true,
          },
        });
        return updatedPayment;
      } catch (error: any) {
        this.logger.error(`Failed to verify payment status: ${error.message}`);
      }
    }

    return payment;
  }

  async getPaymentStatus(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
      select: {
        id: true,
        status: true,
        amount: true,
        purpose: true,
        completedAt: true,
        receiptNo: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          gatewayOrderId: true,
          purpose: true,
          description: true,
          amount: true,
          status: true,
          createdAt: true,
          completedAt: true,
          receiptNo: true,
        },
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return {
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private async activateMembership(userId: string) {
    const now = new Date();
    const year = now.getFullYear();

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { taluk: true },
    });

    if (!user) return;

    // Generate KDCA ID if not exists
    let kdcaId = user.kdcaId;
    if (!kdcaId && user.taluk) {
      const count = await this.prisma.user.count({
        where: { kdcaId: { endsWith: `${user.taluk.code}${year}` } },
      });
      kdcaId = `${String(count + 1).padStart(3, '0')}${user.taluk.code}${year}`;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        kdcaId,
        status: 'ACTIVE',
        membershipStatus: 'ACTIVE',
        membershipValidFrom: new Date(year, 0, 1),
        membershipValidTo: new Date(year, 11, 31, 23, 59, 59),
      },
    });
  }
}
