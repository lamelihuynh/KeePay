import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateGroupInput } from '@keepay/shared';
import { UsersService } from '../users/users.service';
import { GroupsRepository } from './groups.repository';
import type { GroupRecord } from './groups.types';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groups: GroupsRepository,
    private readonly users: UsersService,
  ) {}

  async create(creatorId: string, input: CreateGroupInput) {
    const memberIds = [...new Set([creatorId, ...input.memberIds])];
    const found = await this.users.findManyByIds(memberIds);
    if (found.length !== memberIds.length) throw new BadRequestException('Có thành viên không tồn tại');
    return this.groups.create({ name: input.name, createdById: creatorId, memberIds });
  }

  listForUser(userId: string) {
    return this.groups.listForUser(userId);
  }

  /** Trả về nhóm nếu user là thành viên; ngược lại 404/403. Các module khác dùng hàm này để phân quyền. */
  async requireMember(groupId: string, userId: string): Promise<GroupRecord> {
    const group = await this.groups.findById(groupId);
    if (!group) throw new NotFoundException('Không tìm thấy nhóm');
    if (!group.memberIds.includes(userId)) throw new ForbiddenException('Bạn không thuộc nhóm này');
    return group;
  }

  /** Chi tiết nhóm kèm tên thành viên (client không cần gọi thêm API user). */
  async getDetail(groupId: string, actorId: string) {
    const group = await this.requireMember(groupId, actorId);
    const users = await this.users.findManyByIds(group.memberIds);
    const members = group.memberIds.flatMap((id) => {
      const u = users.find((x) => x.id === id);
      return u ? [{ id: u.id, displayName: u.displayName }] : [];
    });
    return { ...group, members };
  }

  /** Mời thành viên bằng email (client không biết userId). */
  async addMemberByEmail(groupId: string, actorId: string, email: string) {
    await this.requireMember(groupId, actorId);
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng với email này');
    await this.groups.addMember(groupId, user.id);
    return this.getDetail(groupId, actorId);
  }
}
