import type { Balances, Group, GroupDetail } from '../entities/Group';

export interface GroupRepository {
  list(): Promise<Group[]>;
  get(groupId: string): Promise<GroupDetail>;
  create(input: { name: string; memberIds: string[] }): Promise<Group>;
  addMemberByEmail(groupId: string, email: string): Promise<GroupDetail>;
  balances(groupId: string): Promise<Balances>;
}
