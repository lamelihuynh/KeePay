import type { AxiosInstance } from 'axios';
import type { CreateSettlementInput, PaymentQrInput } from '@keepay/shared';
import type { PaymentQr } from '../domain/entities/PaymentQr';
import type { SettlementRepository } from '../domain/repositories/SettlementRepository';

export class SettlementRepositoryImpl implements SettlementRepository {
  constructor(private readonly http: AxiosInstance) {}
  requestPaymentQr(groupId: string, input: PaymentQrInput) {
    return this.http.post<PaymentQr>(`/groups/${groupId}/payment-qr`, input).then((r) => r.data);
  }
  async record(groupId: string, input: CreateSettlementInput) {
    await this.http.post(`/groups/${groupId}/settlements`, input);
  }
}
