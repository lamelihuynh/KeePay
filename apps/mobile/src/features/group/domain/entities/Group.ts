import type { DebtEdge } from '@keepay/shared';

export interface Group {
  id: string;
  name: string;
  createdById: string;
  memberIds: string[];
}
export interface GroupMember {
  id: string;
  displayName: string;
}
export interface GroupDetail extends Group {
  members: GroupMember[];
}
export interface Balances {
  net: Record<string, number>;
  debts: DebtEdge[];
}
