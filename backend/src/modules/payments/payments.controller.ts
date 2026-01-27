import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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

  @Post('callback')
  @ApiOperation({ summary: 'Payment gateway callback' })
  async handleCallback(@Body() body: any) {
    return this.paymentsService.handleCallback(body.orderId, body);
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
