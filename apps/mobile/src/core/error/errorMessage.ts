import axios from 'axios';
import { AppError } from './AppError';

/** Chuyển mọi loại lỗi (domain, axios, khác) thành thông báo thân thiện. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng.';
    const data = error.response.data as { message?: unknown } | undefined;
    if (typeof data?.message === 'string') return data.message;
    return `Có lỗi xảy ra (${error.response.status}).`;
  }
  return 'Có lỗi không xác định.';
}
