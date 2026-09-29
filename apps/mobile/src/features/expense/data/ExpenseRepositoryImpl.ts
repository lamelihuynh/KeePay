import type { AxiosInstance } from 'axios';
import type { CreateExpenseInput } from '@keepay/shared';
import type { Expense } from '../domain/entities/Expense';
import type { ExpenseRepository } from '../domain/repositories/ExpenseRepository';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  constructor(private readonly http: AxiosInstance) {}
  create(groupId: string, input: CreateExpenseInput) {
    return this.http.post<Expense>(`/groups/${groupId}/expenses`, input).then((r) => r.data);
  }
  list(groupId: string) {
    return this.http.get<Expense[]>(`/groups/${groupId}/expenses`).then((r) => r.data);
  }
}
