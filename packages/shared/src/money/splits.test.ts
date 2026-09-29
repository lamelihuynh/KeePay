import { describe, expect, it } from 'vitest';
import { splitByPercent, splitEqually, sumSplits } from './splits';

describe('splitEqually', () => {
  it('chia hết', () => {
    expect(splitEqually(90000, ['a', 'b', 'c']).map((s) => s.amount)).toEqual([30000, 30000, 30000]);
  });
  it('phần dư được rải đều 1đ, tổng luôn khớp', () => {
    const s = splitEqually(100, ['a', 'b', 'c']);
    expect(s.map((x) => x.amount)).toEqual([34, 33, 33]);
    expect(sumSplits(s)).toBe(100);
  });
  it('từ chối đầu vào sai', () => {
    expect(() => splitEqually(0, ['a'])).toThrow();
    expect(() => splitEqually(100, [])).toThrow();
    expect(() => splitEqually(100, ['a', 'a'])).toThrow();
  });
});

describe('splitByPercent', () => {
  it('tổng luôn khớp dù làm tròn', () => {
    const s = splitByPercent(100, [
      { userId: 'a', percent: 33.3 },
      { userId: 'b', percent: 33.3 },
      { userId: 'c', percent: 33.4 },
    ]);
    expect(sumSplits(s)).toBe(100);
  });
  it('từ chối tổng % khác 100', () => {
    expect(() => splitByPercent(100, [{ userId: 'a', percent: 50 }])).toThrow();
  });
});
