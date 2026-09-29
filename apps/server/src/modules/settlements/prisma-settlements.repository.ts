import { Injectable } from '@nestjs/common';
import type { CreateSettlementInput } from '@keepay/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { SettlementsRepository } from './settlements.repository';
import type { SettlementRecord } from './settlements.types';

@Injectable()
export class PrismaSettlementsRepository extends SettlementsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  create(groupId: string, data: CreateSettlementInput): Promise<SettlementRecord> {
    return this.prisma.settlement.create({ data: { groupId, ...data } });
  }
  listByGroup(groupId: string): Promise<SettlementRecord[]> {
    return this.prisma.settlement.findMany({ where: { groupId }, orderBy: { createdAt: 'desc' } });
  }
}
