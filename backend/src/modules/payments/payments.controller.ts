import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JuspayService } from './juspay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly juspayService: JuspayService,
  ) {}

  @Post('registration')
  @ApiOperation({ summary: 'Initiate payment for new registration (public)' })
  async initiateRegistrationPayment(@Body('userId') userId: string) {
    return this.paymentsService.initiateRegistrationPayment(userId);
  }

  @Post('membership')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate membership payment' })
  async initiateMembershipPayment(@CurrentUser('id') userId: string) {
    return this.paymentsService.initiateMembershipPayment(userId);
  }

  @Post('tournament')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate tournament registration payment' })
  async initiateTournamentPayment(
    @CurrentUser('id') userId: string,
    @Body('tournamentId') tournamentId: string,
    @Body('registrationId') registrationId: string,
  ) {
    return this.paymentsService.initiateTournamentPayment(
      userId,
      tournamentId,
      registrationId,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'HDFC payment webhook callback' })
  async handleWebhook(@Body() body: any) {
    this.logger.log(`Received webhook: ${JSON.stringify(body)}`);
    const orderId = body.order_id || body.content?.order?.order_id || body.orderId;
    if (!orderId) {
      return { status: 'error', message: 'No order_id found' };
    }
    return this.paymentsService.handleCallback(orderId, body);
  }

  @Post('callback')
  @ApiOperation({ summary: 'HDFC payment return URL callback' })
  async handleCallback(@Body() body: any) {
    this.logger.log(`Received callback: ${JSON.stringify(body)}`);

    // Validate HMAC signature from HDFC (as per official NodejsBackendKit)
    if (body.signature && !this.juspayService.validateSignature(body)) {
      this.logger.error('HDFC signature verification failed');
      return { status: 'error', message: 'Signature verification failed' };
    }

    const orderId = body.order_id || body.orderId;
    if (!orderId) {
      return { status: 'error', message: 'No order_id found' };
    }
    return this.paymentsService.handleCallback(orderId, body);
  }

  @Get('verify/:orderId')
  @ApiOperation({ summary: 'Verify payment status with gateway (public)' })
  async verifyPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.verifyAndGetStatus(orderId);
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status' })
  async getPaymentStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentStatus(orderId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history' })
  async getPaymentHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.paymentsService.getPaymentHistory(
      userId,
      page || 1,
      Math.min(limit || 20, 50),
    );
  }
}
