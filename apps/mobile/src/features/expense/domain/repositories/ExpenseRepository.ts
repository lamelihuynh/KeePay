import type { CreateExpenseInput } from '@keepay/shared';
import type { Expense } from '../entities/Expense';

export interface ExpenseRepository {
  create(groupId: string, input: CreateExpenseInput): Promise<Expense>;
  list(groupId: string): Promise<Expense[]>;
}
