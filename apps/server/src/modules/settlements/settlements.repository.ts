import type { CreateSettlementInput } from '@keepay/shared';
import type { SettlementRecord } from './settlements.types';

export abstract class SettlementsRepository {
  abstract create(groupId: string, data: CreateSettlementInput): Promise<SettlementRecord>;
  abstract listByGroup(groupId: string): Promise<SettlementRecord[]>;
}
