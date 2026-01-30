import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { JuspayService } from './juspay.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, JuspayService],
  exports: [PaymentsService, JuspayService],
})
export class PaymentsModule {}
