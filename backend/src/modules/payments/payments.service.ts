import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, PaymentPurpose } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiateMembershipPayment(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const amount = user.role === 'ARBITER' ? 250 : 75;
    const orderId = `KDCA_MEM_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        purpose: PaymentPurpose.MEMBERSHIP_NEW,
        description: `KDCA Membership ${new Date().getFullYear()}`,
        amount,
        gatewayOrderId: orderId,
        status: PaymentStatus.PENDING,
      },
    });

    // In production, integrate with HDFC Gateway
    // For now, return mock gateway data
    return {
      paymentId: payment.id,
      orderId,
      amount,
      currency: 'INR',
      gatewayUrl: `https://payment.gateway.com/pay/${orderId}`,
      // In real implementation, include encrypted gateway params
    };
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

    const orderId = `KDCA_TRN_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;
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
      gatewayUrl: `https://payment.gateway.com/pay/${orderId}`,
    };
  }

  async handleCallback(orderId: string, gatewayResponse: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify payment with gateway (implement actual verification)
    const isSuccess = gatewayResponse.status === 'SUCCESS';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        gatewayPaymentId: gatewayResponse.paymentId,
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
