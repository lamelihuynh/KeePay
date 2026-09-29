import { describe, expect, it } from 'vitest';
import { createExpenseSchema, registerSchema } from './index';

describe('createExpenseSchema', () => {
  const ok = {
    description: 'Cơm trưa',
    amount: 100000,
    paidById: 'u1',
    splits: [
      { userId: 'u1', amount: 50000 },
      { userId: 'u2', amount: 50000 },
    ],
  };
  it('chấp nhận dữ liệu hợp lệ', () => {
    expect(createExpenseSchema.safeParse(ok).success).toBe(true);
  });
  it('từ chối khi tổng chia khác tổng tiền', () => {
    const bad = { ...ok, splits: [{ userId: 'u1', amount: 1 }] };
    expect(createExpenseSchema.safeParse(bad).success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('từ chối mật khẩu ngắn', () => {
    const r = registerSchema.safeParse({ email: 'a@b.co', password: '123', displayName: 'A' });
    expect(r.success).toBe(false);
  });
});
