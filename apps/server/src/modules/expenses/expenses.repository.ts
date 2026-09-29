import type { CreateExpenseInput } from '@keepay/shared';
import type { ExpenseRecord } from './expenses.types';

export abstract class ExpensesRepository {
  abstract create(groupId: string, data: CreateExpenseInput): Promise<ExpenseRecord>;
  abstract listByGroup(groupId: string): Promise<ExpenseRecord[]>;
}
