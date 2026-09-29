import { Injectable } from '@nestjs/common';
import type { CreateExpenseInput } from '@keepay/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ExpensesRepository } from './expenses.repository';
import type { ExpenseRecord } from './expenses.types';

@Injectable()
export class PrismaExpensesRepository extends ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  /** Expense và splits được tạo trong cùng một transaction (nested write). */
  async create(groupId: string, data: CreateExpenseInput): Promise<ExpenseRecord> {
    const e = await this.prisma.expense.create({
      data: {
        groupId,
        paidById: data.paidById,
        description: data.description,
        amount: data.amount,
        billImageUrl: data.billImageUrl ?? null,
        splits: { create: data.splits.map((s) => ({ userId: s.userId, amount: s.amount })) },
      },
      include: { splits: true },
    });
    return this.map(e);
  }
  async listByGroup(groupId: string): Promise<ExpenseRecord[]> {
    const list = await this.prisma.expense.findMany({
      where: { groupId },
      include: { splits: true },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((e) => this.map(e));
  }
  private map(e: {
    id: string; groupId: string; paidById: string; description: string; amount: number;
    billImageUrl: string | null; createdAt: Date; splits: { userId: string; amount: number }[];
  }): ExpenseRecord {
    return {
      id: e.id, groupId: e.groupId, paidById: e.paidById, description: e.description,
      amount: e.amount, billImageUrl: e.billImageUrl, createdAt: e.createdAt,
      splits: e.splits.map((s) => ({ userId: s.userId, amount: s.amount })),
    };
  }
}
