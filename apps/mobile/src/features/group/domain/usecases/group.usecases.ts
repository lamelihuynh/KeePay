import { addMemberSchema, createGroupSchema } from '@keepay/shared';
import { parseOrThrow } from '@/core/validation/parseOrThrow';
import type { GroupRepository } from '../repositories/GroupRepository';

export class ListGroupsUseCase {
  constructor(private readonly repo: GroupRepository) {}
  execute() {
    return this.repo.list();
  }
}
export class CreateGroupUseCase {
  constructor(private readonly repo: GroupRepository) {}
  execute(raw: { name: string }) {
    const input = parseOrThrow(createGroupSchema, { name: raw.name.trim(), memberIds: [] });
    return this.repo.create(input);
  }
}
export class GetGroupDetailUseCase {
  constructor(private readonly repo: GroupRepository) {}
  execute(groupId: string) {
    return this.repo.get(groupId);
  }
}
export class GetGroupBalancesUseCase {
  constructor(private readonly repo: GroupRepository) {}
  execute(groupId: string) {
    return this.repo.balances(groupId);
  }
}
export class AddMemberByEmailUseCase {
  constructor(private readonly repo: GroupRepository) {}
  execute(groupId: string, email: string) {
    const input = parseOrThrow(addMemberSchema, { email: email.trim() });
    return this.repo.addMemberByEmail(groupId, input.email);
  }
}
