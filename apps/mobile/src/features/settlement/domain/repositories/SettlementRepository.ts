import type { CreateSettlementInput, PaymentQrInput } from '@keepay/shared';
import type { PaymentQr } from '../entities/PaymentQr';

export interface SettlementRepository {
  requestPaymentQr(groupId: string, input: PaymentQrInput): Promise<PaymentQr>;
  record(groupId: string, input: CreateSettlementInput): Promise<void>;
}
