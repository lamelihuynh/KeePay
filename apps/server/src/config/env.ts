import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET phải dài tối thiểu 16 ký tự'),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof envSchema>;
let cached: Env | undefined;

/** Validate biến môi trường một lần; lỗi cấu hình sẽ làm app dừng ngay khi khởi động. */
export function loadEnv(): Env {
  if (!cached) cached = envSchema.parse(process.env);
  return cached;
}
