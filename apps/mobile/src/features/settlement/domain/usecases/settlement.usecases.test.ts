import { describe, expect, it, vi } from 'vitest';
import type { SettlementRepository } from '../repositories/SettlementRepository';
import { GetPaymentQrUseCase, RecordSettlementUseCase } from './settlement.usecases';

const repo = () => ({ requestPaymentQr: vi.fn(async () => ({ payload: 'p', amount: 1, recipient: { userId: 'b', accountHolder: 'B', bankBin: '970436' } })), record: vi.fn(async () => {}) }) as unknown as SettlementRepository;

describe('settlement use cases', () => {
  it('yêu cầu QR với dữ liệu hợp lệ', async () => {
    const r = repo();
    await new GetPaymentQrUseCase(r).execute('g1', { toUserId: 'b', amount: 50000 });
    expect(r.requestPaymentQr).toHaveBeenCalledWith('g1', { toUserId: 'b', amount: 50000 });
  });
  it('chặn số tiền âm/0/lẻ trước khi gọi API', () => {
    const r = repo();
    for (const amount of [-1, 0, 1.5]) {
      expect(() => new GetPaymentQrUseCase(r).execute('g', { toUserId: 'b', amount })).toThrow();
      expect(() => new RecordSettlementUseCase(r).execute('g', { fromUserId: 'a', toUserId: 'b', amount })).toThrow();
    }
    expect(r.requestPaymentQr).not.toHaveBeenCalled();
    expect(r.record).not.toHaveBeenCalled();
  });
});
