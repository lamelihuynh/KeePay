import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  createSettlementSchema,
  paymentQrSchema,
  type CreateSettlementInput,
  type PaymentQrInput,
} from '@keepay/shared';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { SettlementsService } from './settlements.service';

@Controller('groups/:groupId')
@UseGuards(JwtAuthGuard)
export class SettlementsController {
  constructor(private readonly settlements: SettlementsService) {}

  @Post('settlements')
  create(
    @CurrentUser() user: AuthUser,
    @Param('groupId') groupId: string,
    @Body(new ZodValidationPipe(createSettlementSchema)) body: CreateSettlementInput,
  ) {
    return this.settlements.create(groupId, user.id, body);
  }

  @Post('payment-qr')
  paymentQr(
    @CurrentUser() user: AuthUser,
    @Param('groupId') groupId: string,
    @Body(new ZodValidationPipe(paymentQrSchema)) body: PaymentQrInput,
  ) {
    return this.settlements.paymentQr(groupId, user.id, body);
  }
}
