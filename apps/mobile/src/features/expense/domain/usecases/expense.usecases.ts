import { createExpenseSchema, splitEqually } from '@keepay/shared';
import { AppError } from '@/core/error/AppError';
import { parseOrThrow } from '@/core/validation/parseOrThrow';
import type { ExpenseRepository } from '../repositories/ExpenseRepository';

export type SplitSpec =
  | { type: 'equal'; userIds: string[] }
  | { type: 'custom'; splits: { userId: string; amount: number }[] };

export interface CreateExpenseCommand {
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  split: SplitSpec;
  billImageUrl?: string;
}

export class CreateExpenseUseCase {
  constructor(private readonly repo: ExpenseRepository) {}

  execute(cmd: CreateExpenseCommand) {
    const splits =
      cmd.split.type === 'equal' ? this.equalSplit(cmd.amount, cmd.split.userIds) : cmd.split.splits;
    const input = parseOrThrow(createExpenseSchema, {
      description: cmd.description.trim(),
      amount: cmd.amount,
      paidById: cmd.paidById,
      splits,
      billImageUrl: cmd.billImageUrl,
    });
    return this.repo.create(cmd.groupId, input);
  }

  private equalSplit(amount: number, userIds: string[]) {
    if (userIds.length === 0) throw new AppError('Chọn ít nhất 1 người chia tiền');
    try {
      return splitEqually(amount, userIds);
    } catch {
      throw new AppError('Số tiền không hợp lệ');
    }
  }
}

export class ListExpensesUseCase {
  constructor(private readonly repo: ExpenseRepository) {}
  execute(groupId: string) {
    return this.repo.list(groupId);
  }
}
