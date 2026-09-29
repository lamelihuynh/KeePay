export interface SettlementRecord {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  createdAt: Date;
}
