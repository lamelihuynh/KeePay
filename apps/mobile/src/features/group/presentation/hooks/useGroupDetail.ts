import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { container } from '@/core/di/container';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import type { Expense } from '@/features/expense/domain/entities/Expense';
import type { Balances, GroupDetail } from '../../domain/entities/Group';

interface Data {
  detail: GroupDetail | null;
  balances: Balances | null;
  expenses: Expense[];
}

export function useGroupDetail(groupId: string) {
  const [data, setData] = useState<Data>({ detail: null, balances: null, expenses: [] });
  const { loading, error, run } = useAsyncAction();

  const reload = useCallback(
    () =>
      run(async () => {
        const [detail, balances, expenses] = await Promise.all([
          container.group.detail.execute(groupId),
          container.group.balances.execute(groupId),
          container.expense.list.execute(groupId),
        ]);
        setData({ detail, balances, expenses });
      }),
    [groupId, run],
  );

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { ...data, loading, error, reload };
}
