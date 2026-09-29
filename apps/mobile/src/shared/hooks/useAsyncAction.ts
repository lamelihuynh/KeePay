import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/core/error/errorMessage';

/** Bọc một thao tác async: quản lý loading/error, trả undefined nếu lỗi. */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(toErrorMessage(e));
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run };
}
