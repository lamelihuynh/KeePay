import { describe, expect, it, vi } from 'vitest';
import { AppError } from '@/core/error/AppError';
import type { ExpenseRepository } from '../repositories/ExpenseRepository';
import { CreateExpenseUseCase } from './expense.usecases';

function fakeRepo() {
  const create = vi.fn(async (groupId: string, input: unknown) => ({ id: 'e1', groupId, ...(input as object) }));
  return { repo: { create, list: vi.fn() } as unknown as ExpenseRepository, create };
}

describe('CreateExpenseUseCase', () => {
  it('chia đều và gửi đúng request lên repository', async () => {
    const { repo, create } = fakeRepo();
    await new CreateExpenseUseCase(repo).execute({
      groupId: 'g1',
      description: '  Ăn tối  ',
      amount: 100,
      paidById: 'a',
      split: { type: 'equal', userIds: ['a', 'b', 'c'] },
    });
    expect(create).toHaveBeenCalledWith('g1', {
      description: 'Ăn tối',
      amount: 100,
      paidById: 'a',
      splits: [
        { userId: 'a', amount: 34 },
        { userId: 'b', amount: 33 },
        { userId: 'c', amount: 33 },
      ],
      billImageUrl: undefined,
    });
  });

  it('báo lỗi tiếng Việt khi không chọn ai để chia', async () => {
    const { repo, create } = fakeRepo();
    const uc = new CreateExpenseUseCase(repo);
    expect(() => uc.execute({ groupId: 'g', description: 'x', amount: 10, paidById: 'a', split: { type: 'equal', userIds: [] } }))
      .toThrowError('Chọn ít nhất 1 người chia tiền');
    expect(create).not.toHaveBeenCalled();
  });

  it('từ chối số tiền không hợp lệ và không gọi API', () => {
    const { repo, create } = fakeRepo();
    const uc = new CreateExpenseUseCase(repo);
    for (const amount of [0, -5, 10.5, NaN]) {
      expect(() => uc.execute({ groupId: 'g', description: 'x', amount, paidById: 'a', split: { type: 'equal', userIds: ['a'] } }))
        .toThrow(AppError);
    }
    expect(create).not.toHaveBeenCalled();
  });

  it('chia tuỳ chỉnh: tổng phải khớp tổng tiền', () => {
    const { repo } = fakeRepo();
    expect(() =>
      new CreateExpenseUseCase(repo).execute({
        groupId: 'g', description: 'x', amount: 100, paidById: 'a',
        split: { type: 'custom', splits: [{ userId: 'a', amount: 60 }, { userId: 'b', amount: 30 }] },
      }),
    ).toThrowError(/Tổng các khoản chia/);
  });
});
