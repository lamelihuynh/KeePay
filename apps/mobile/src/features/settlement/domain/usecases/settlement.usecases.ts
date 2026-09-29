import { createSettlementSchema, paymentQrSchema } from '@keepay/shared';
import { parseOrThrow } from '@/core/validation/parseOrThrow';
import type { SettlementRepository } from '../repositories/SettlementRepository';

export class GetPaymentQrUseCase {
  constructor(private readonly repo: SettlementRepository) {}
  execute(groupId: string, raw: { toUserId: string; amount: number }) {
    return this.repo.requestPaymentQr(groupId, parseOrThrow(paymentQrSchema, raw));
  }
}
export class RecordSettlementUseCase {
  constructor(private readonly repo: SettlementRepository) {}
  execute(groupId: string, raw: { fromUserId: string; toUserId: string; amount: number }) {
    return this.repo.record(groupId, parseOrThrow(createSettlementSchema, raw));
  }
}
