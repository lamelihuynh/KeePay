export interface ExpenseRecord {
  id: string;
  groupId: string;
  paidById: string;
  description: string;
  amount: number;
  billImageUrl: string | null;
  splits: { userId: string; amount: number }[];
  createdAt: Date;
}
