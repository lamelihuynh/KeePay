import { computeNetBalances, simplifyDebts } from './debt-simplifier';

describe('computeNetBalances', () => {
  it('người trả được cộng, người được chia bị trừ; settlement bù trừ', () => {
    const net = computeNetBalances(
      [{ paidById: 'a', amount: 90000, splits: ['a', 'b', 'c'].map((userId) => ({ userId, amount: 30000 })) }],
      [{ fromUserId: 'c', toUserId: 'a', amount: 30000 }],
    );
    expect(net).toEqual({ a: 30000, b: -30000, c: 0 });
  });
});

describe('simplifyDebts', () => {
  it('không ai nợ ai -> không có giao dịch', () => {
    expect(simplifyDebts({ a: 0, b: 0 })).toEqual([]);
  });

  it('gộp thành ít giao dịch nhất có thể (chuỗi a->b->c thành a->c)', () => {
    // a nợ b 10, b nợ c 10  =>  net: a -10, b 0, c +10
    expect(simplifyDebts({ a: -10, b: 0, c: 10 })).toEqual([{ fromUserId: 'a', toUserId: 'c', amount: 10 }]);
  });

  it('từ chối dữ liệu không cân (tổng != 0)', () => {
    expect(() => simplifyDebts({ a: 10, b: -5 })).toThrow();
  });

  it('property: sau khi áp dụng mọi giao dịch, số dư về 0 và số giao dịch <= n-1', () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    for (let round = 0; round < 200; round++) {
      const n = 2 + Math.floor(rnd() * 8);
      const net: Record<string, number> = {};
      let sum = 0;
      for (let i = 0; i < n - 1; i++) {
        const v = Math.floor(rnd() * 200000) - 100000;
        net[`u${i}`] = v;
        sum += v;
      }
      net[`u${n - 1}`] = -sum;
      const edges = simplifyDebts(net);
      const after = { ...net };
      for (const e of edges) {
        expect(e.amount).toBeGreaterThan(0);
        after[e.fromUserId]! += e.amount;
        after[e.toUserId]! -= e.amount;
      }
      expect(Object.values(after).every((v) => v === 0)).toBe(true);
      expect(edges.length).toBeLessThanOrEqual(n - 1);
    }
  });

  it('kết quả xác định (cùng input -> cùng output)', () => {
    const net = { a: -30, b: -30, c: 60 };
    expect(simplifyDebts(net)).toEqual(simplifyDebts({ ...net }));
  });
});
