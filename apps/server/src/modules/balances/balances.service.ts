import { Injectable } from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';
import { GroupsService } from '../groups/groups.service';
import { SettlementsService } from '../settlements/settlements.service';
import { computeNetBalances, simplifyDebts } from './debt-simplifier';

@Injectable()
export class BalancesService {
  constructor(
    private readonly groups: GroupsService,
    private readonly expenses: ExpensesService,
    private readonly settlements: SettlementsService,
  ) {}

  async getGroupBalances(groupId: string, actorId: string) {
    const group = await this.groups.requireMember(groupId, actorId);
    const [expenses, settlements] = await Promise.all([
      this.expenses.listRaw(groupId),
      this.settlements.listRaw(groupId),
    ]);
    const net = computeNetBalances(expenses, settlements);
    for (const id of group.memberIds) net[id] ??= 0;
    return { net, debts: simplifyDebts(net) };
  }
}
