export interface Split {
  userId: string;
  amount: number;
}

/**
 * Chia đều `total` (VND, số nguyên) cho các thành viên.
 * Phần dư (total % n) được cộng dần 1đ cho những người đầu danh sách => tổng luôn khớp.
 */
export function splitEqually(total: number, userIds: string[]): Split[] {
  if (!Number.isInteger(total) || total <= 0) throw new Error('total phải là số nguyên dương');
  if (userIds.length === 0) throw new Error('Cần ít nhất 1 thành viên');
  if (new Set(userIds).size !== userIds.length) throw new Error('userIds bị trùng');
  const base = Math.floor(total / userIds.length);
  const remainder = total - base * userIds.length;
  return userIds.map((userId, i) => ({ userId, amount: base + (i < remainder ? 1 : 0) }));
}

/** Chia theo % (tổng phải = 100). Phần dư làm tròn dồn cho người có tỉ lệ lớn nhất. */
export function splitByPercent(
  total: number,
  parts: { userId: string; percent: number }[],
): Split[] {
  const sum = parts.reduce((s, p) => s + p.percent, 0);
  if (Math.abs(sum - 100) > 1e-9) throw new Error('Tổng phần trăm phải bằng 100');
  const splits = parts.map((p) => ({
    userId: p.userId,
    amount: Math.floor((total * p.percent) / 100),
  }));
  const diff = total - splits.reduce((s, x) => s + x.amount, 0);
  if (diff !== 0) {
    let maxIdx = 0;
    parts.forEach((p, i) => {
      if (p.percent > (parts[maxIdx]?.percent ?? 0)) maxIdx = i;
    });
    splits[maxIdx]!.amount += diff;
  }
  return splits;
}

export function sumSplits(splits: Split[]): number {
  return splits.reduce((s, x) => s + x.amount, 0);
}
