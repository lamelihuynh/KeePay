import { Injectable } from '@nestjs/common';
import type { BankAccountInput, CreateExpenseInput, CreateSettlementInput } from '@keepay/shared';
import { ExpensesRepository } from '../../src/modules/expenses/expenses.repository';
import type { ExpenseRecord } from '../../src/modules/expenses/expenses.types';
import { GroupsRepository } from '../../src/modules/groups/groups.repository';
import type { GroupRecord } from '../../src/modules/groups/groups.types';
import { SettlementsRepository } from '../../src/modules/settlements/settlements.repository';
import type { SettlementRecord } from '../../src/modules/settlements/settlements.types';
import { UsersRepository } from '../../src/modules/users/users.repository';
import type { BankAccountRecord, UserRecord } from '../../src/modules/users/users.types';

let counter = 0;
const nextId = (p: string) => `${p}_${++counter}`;

/** Repository in-memory: dùng cho test không cần DB. Team mới có thể copy mẫu này cho module của mình. */
@Injectable()
export class InMemoryUsersRepository extends UsersRepository {
  users: UserRecord[] = [];
  banks: BankAccountRecord[] = [];
  async create(data: Omit<UserRecord, 'id'>) {
    const u = { id: nextId('user'), ...data };
    this.users.push(u);
    return u;
  }
  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }
  async findById(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }
  async findManyByIds(ids: string[]) {
    return this.users.filter((u) => ids.includes(u.id));
  }
  async upsertBankAccount(userId: string, data: BankAccountInput) {
    this.banks = this.banks.filter((b) => b.userId !== userId);
    const rec = { userId, ...data };
    this.banks.push(rec);
    return rec;
  }
  async findBankAccount(userId: string) {
    return this.banks.find((b) => b.userId === userId) ?? null;
  }
}

@Injectable()
export class InMemoryGroupsRepository extends GroupsRepository {
  groups: GroupRecord[] = [];
  async create(data: { name: string; createdById: string; memberIds: string[] }) {
    const g = { id: nextId('group'), ...data };
    this.groups.push(g);
    return g;
  }
  async findById(id: string) {
    return this.groups.find((g) => g.id === id) ?? null;
  }
  async listForUser(userId: string) {
    return this.groups.filter((g) => g.memberIds.includes(userId));
  }
  async addMember(groupId: string, userId: string) {
    const g = this.groups.find((x) => x.id === groupId);
    if (g && !g.memberIds.includes(userId)) g.memberIds.push(userId);
  }
}

@Injectable()
export class InMemoryExpensesRepository extends ExpensesRepository {
  items: ExpenseRecord[] = [];
  async create(groupId: string, data: CreateExpenseInput) {
    const e: ExpenseRecord = {
      id: nextId('expense'),
      groupId,
      paidById: data.paidById,
      description: data.description,
      amount: data.amount,
      billImageUrl: data.billImageUrl ?? null,
      splits: data.splits,
      createdAt: new Date(),
    };
    this.items.push(e);
    return e;
  }
  async listByGroup(groupId: string) {
    return this.items.filter((e) => e.groupId === groupId);
  }
}

@Injectable()
export class InMemorySettlementsRepository extends SettlementsRepository {
  items: SettlementRecord[] = [];
  async create(groupId: string, data: CreateSettlementInput) {
    const s = { id: nextId('settlement'), groupId, createdAt: new Date(), ...data };
    this.items.push(s);
    return s;
  }
  async listByGroup(groupId: string) {
    return this.items.filter((s) => s.groupId === groupId);
  }
}
