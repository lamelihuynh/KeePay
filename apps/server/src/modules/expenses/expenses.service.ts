import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateExpenseInput } from '@keepay/shared';
import { GroupsService } from '../groups/groups.service';
import { ExpensesRepository } from './expenses.repository';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly expenses: ExpensesRepository,
    private readonly groups: GroupsService,
  ) {}

  async create(groupId: string, actorId: string, input: CreateExpenseInput) {
    const group = await this.groups.requireMember(groupId, actorId);
    const involved = [input.paidById, ...input.splits.map((s) => s.userId)];
    if (involved.some((id) => !group.memberIds.includes(id))) {
      throw new BadRequestException('Người trả tiền/người chia phải là thành viên của nhóm');
    }
    if (new Set(input.splits.map((s) => s.userId)).size !== input.splits.length) {
      throw new BadRequestException('Danh sách chia bị trùng người');
    }
    return this.expenses.create(groupId, input);
  }

  async list(groupId: string, actorId: string) {
    await this.groups.requireMember(groupId, actorId);
    return this.expenses.listByGroup(groupId);
  }

  /** Dùng nội bộ (đã kiểm tra quyền ở tầng gọi). */
  listRaw(groupId: string) {
    return this.expenses.listByGroup(groupId);
  }
}
