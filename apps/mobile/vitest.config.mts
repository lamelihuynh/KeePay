import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Chỉ test tầng domain (thuần TypeScript, không cần môi trường React Native).
export default defineConfig({
  resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
