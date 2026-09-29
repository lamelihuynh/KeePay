import { describe, expect, it, vi } from 'vitest';
import type { ProfileRepository } from '../repositories/ProfileRepository';
import { SaveBankAccountUseCase } from './profile.usecases';

describe('SaveBankAccountUseCase', () => {
  const repo = () => ({ get: vi.fn(), saveBankAccount: vi.fn(async () => {}) }) as unknown as ProfileRepository & { saveBankAccount: ReturnType<typeof vi.fn> };

  it('chuẩn hoá dữ liệu: bỏ khoảng trắng số TK, viết hoa tên chủ TK', async () => {
    const r = repo();
    await new SaveBankAccountUseCase(r).execute({ bankBin: '970436', accountNumber: '0123 456 789', accountHolder: ' nguyen van a ' });
    expect(r.saveBankAccount).toHaveBeenCalledWith({ bankBin: '970436', accountNumber: '0123456789', accountHolder: 'NGUYEN VAN A' });
  });
  it('từ chối BIN sai', () => {
    const r = repo();
    expect(() => new SaveBankAccountUseCase(r).execute({ bankBin: '12', accountNumber: '1', accountHolder: 'A' })).toThrow();
    expect(r.saveBankAccount).not.toHaveBeenCalled();
  });
});
