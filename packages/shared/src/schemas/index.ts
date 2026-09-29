import { z } from 'zod';

/** Nguồn sự thật duy nhất cho request contract: server validate, mobile dùng chung type. */
const MAX_VND = 1_000_000_000;
export const vnd = z.number().int().positive().max(MAX_VND);

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  displayName: z.string().min(1).max(50),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const bankAccountSchema = z.object({
  bankBin: z.string().regex(/^\d{6}$/),
  accountNumber: z.string().regex(/^[A-Za-z0-9]{1,19}$/),
  accountHolder: z.string().min(1).max(100),
});

export const createGroupSchema = z.object({
  name: z.string().min(1).max(80),
  memberIds: z.array(z.string().min(1)).max(50).default([]),
});

export const createExpenseSchema = z
  .object({
    description: z.string().min(1).max(200),
    amount: vnd,
    paidById: z.string().min(1),
    splits: z
      .array(z.object({ userId: z.string().min(1), amount: z.number().int().nonnegative() }))
      .min(1),
    billImageUrl: z.string().url().optional(),
  })
  .refine((v) => v.splits.reduce((s, x) => s + x.amount, 0) === v.amount, {
    message: 'Tổng các khoản chia phải bằng số tiền của khoản chi',
    path: ['splits'],
  });

export const createSettlementSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  amount: vnd,
});

export const addMemberSchema = z.object({ email: z.string().email() });

export const paymentQrSchema = z.object({
  toUserId: z.string().min(1),
  amount: vnd,
  /** Mặc định là người đang đăng nhập. */
  fromUserId: z.string().min(1).optional(),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type PaymentQrInput = z.infer<typeof paymentQrSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BankAccountInput = z.infer<typeof bankAccountSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type CreateSettlementInput = z.infer<typeof createSettlementSchema>;

/** Một khoản "A nợ B" sau khi đã rút gọn. */
export interface DebtEdge {
  fromUserId: string;
  toUserId: string;
  amount: number;
}
