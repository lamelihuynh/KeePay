import type { DebtEdge } from '@keepay/shared';

export interface ExpenseLike {
  paidById: string;
  amount: number;
  splits: { userId: string; amount: number }[];
}
export interface SettlementLike {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

/**
 * Số dư ròng của từng người: dương = được nợ, âm = đang nợ.
 * - Người trả tiền được cộng toàn bộ số tiền; mỗi người trong splits bị trừ phần của mình.
 * - Settlement "from trả to": from tăng, to giảm.
 */
export function computeNetBalances(
  expenses: ExpenseLike[],
  settlements: SettlementLike[],
): Record<string, number> {
  const net: Record<string, number> = {};
  const add = (id: string, v: number) => {
    net[id] = (net[id] ?? 0) + v;
  };
  for (const e of expenses) {
    add(e.paidById, e.amount);
    for (const s of e.splits) add(s.userId, -s.amount);
  }
  for (const s of settlements) {
    add(s.fromUserId, s.amount);
    add(s.toUserId, -s.amount);
  }
  return net;
}

/**
 * Rút gọn nợ bằng greedy: luôn ghép con nợ lớn nhất với chủ nợ lớn nhất.
 * Cho tối đa (n - 1) giao dịch; kết quả xác định (tie-break theo userId).
 */
export function simplifyDebts(net: Record<string, number>): DebtEdge[] {
  const total = Object.values(net).reduce((s, v) => s + v, 0);
  if (total !== 0) throw new Error(`Tổng số dư phải bằng 0 (hiện là ${total})`);

  const byAmountThenId = (a: [string, number], b: [string, number]) =>
    b[1] - a[1] || a[0].localeCompare(b[0]);

  const creditors = Object.entries(net).filter(([, v]) => v > 0).sort(byAmountThenId);
  const debtors = Object.entries(net)
    .filter(([, v]) => v < 0)
    .map(([id, v]) => [id, -v] as [string, number])
    .sort(byAmountThenId);

  const edges: DebtEdge[] = [];
  while (creditors.length && debtors.length) {
    const [creditorId, credit] = creditors[0]!;
    const [debtorId, debt] = debtors[0]!;
    const amount = Math.min(credit, debt);
    edges.push({ fromUserId: debtorId, toUserId: creditorId, amount });
    creditors[0]![1] -= amount;
    debtors[0]![1] -= amount;
    if (creditors[0]![1] === 0) creditors.shift();
    if (debtors[0]![1] === 0) debtors.shift();
    creditors.sort(byAmountThenId);
    debtors.sort(byAmountThenId);
  }
  return edges;
}
