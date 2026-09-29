import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GroupsRepository } from './groups.repository';
import type { GroupRecord } from './groups.types';

type GroupWithMembers = { id: string; name: string; createdById: string; members: { userId: string }[] };
const toRecord = (g: GroupWithMembers): GroupRecord => ({
  id: g.id,
  name: g.name,
  createdById: g.createdById,
  memberIds: g.members.map((m) => m.userId),
});

@Injectable()
export class PrismaGroupsRepository extends GroupsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async create(data: { name: string; createdById: string; memberIds: string[] }) {
    const g = await this.prisma.group.create({
      data: {
        name: data.name,
        createdById: data.createdById,
        members: { create: data.memberIds.map((userId) => ({ userId })) },
      },
      include: { members: true },
    });
    return toRecord(g);
  }
  async findById(id: string) {
    const g = await this.prisma.group.findUnique({ where: { id }, include: { members: true } });
    return g ? toRecord(g) : null;
  }
  async listForUser(userId: string) {
    const groups = await this.prisma.group.findMany({
      where: { members: { some: { userId } } },
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    });
    return groups.map(toRecord);
  }
  async addMember(groupId: string, userId: string) {
    await this.prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      create: { groupId, userId },
      update: {},
    });
  }
}
