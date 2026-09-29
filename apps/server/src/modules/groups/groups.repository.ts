import type { GroupRecord } from './groups.types';

export abstract class GroupsRepository {
  abstract create(data: { name: string; createdById: string; memberIds: string[] }): Promise<GroupRecord>;
  abstract findById(id: string): Promise<GroupRecord | null>;
  abstract listForUser(userId: string): Promise<GroupRecord[]>;
  abstract addMember(groupId: string, userId: string): Promise<void>;
}
