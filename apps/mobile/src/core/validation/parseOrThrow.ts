import type { ZodTypeAny, z } from 'zod';
import { AppError } from '../error/AppError';

/** Validate bằng schema dùng chung với server; lỗi đầu tiên trở thành AppError. */
export function parseOrThrow<S extends ZodTypeAny>(schema: S, value: unknown): z.infer<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new AppError(issue ? issue.message : 'Dữ liệu không hợp lệ');
  }
  return result.data;
}
