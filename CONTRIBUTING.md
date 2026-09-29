# Đóng góp vào KeePay

Dự án dùng npm workspaces: `packages/shared` (dùng chung), `apps/mobile` (Expo/React Native),
`apps/server` (NestJS). Đọc `docs/adr/0001-monorepo-layout.md` trước khi thêm module mới.

## Bắt đầu
```bash
npm install
cp apps/server/.env.example apps/server/.env
cp apps/mobile/.env.example apps/mobile/.env
docker compose up -d              # Postgres cho local dev
npm run build:shared
npm run prisma:migrate -w @keepay/server
npm run prisma:seed -w @keepay/server   # 3 user demo, mật khẩu: password123
```

Chạy server: `npm run start:dev -w @keepay/server` (http://localhost:3000/api/v1)
Chạy mobile: `npm run start -w @keepay/mobile` (quét QR bằng Expo Go, hoặc bấm `a`/`i`)

## Quy tắc chung
- **Không sửa trực tiếp `packages/shared/dist`** — đó là output build. Sửa trong `src/`.
- Đổi request/response contract giữa client-server → sửa trong `packages/shared/src/schemas`,
  chạy `npm run build:shared`, rồi sửa cả hai phía cho khớp type.
- Đổi `prisma/schema.prisma` → luôn tạo migration (`npm run prisma:migrate -w @keepay/server`),
  không sửa tay trong DB.
- Mỗi module backend mới: `*.controller.ts` (nhận request, validate bằng zod) →
  `*.service.ts` (nghiệp vụ, không import Prisma trực tiếp) → `*Repository` (abstract class) +
  `Prisma*Repository` (implementation). Đăng ký cả 3 trong `*.module.ts`.
- Mỗi feature mobile mới: theo đúng layout `presentation/domain/data` của một feature có sẵn
  (ví dụ `features/expense`), rồi đăng ký use case trong `core/di/container.ts`.
- Trước khi mở PR: `npm run check` (lint + format + typecheck + test + build).
- Nhánh: `feature/<mô-tả-ngắn>`, `fix/<mô-tả-ngắn>`. Commit theo Conventional Commits
  (`feat:`, `fix:`, `chore:`, `docs:`...) để dễ theo dõi changelog sau này.

## Phân chia công việc gợi ý (nhiều người cùng làm)
| Khu vực                          | Độc lập với             |
|-----------------------------------|--------------------------|
| `apps/server/src/modules/auth`    | các module khác          |
| `apps/server/src/modules/groups`  | expenses, settlements    |
| `apps/server/src/modules/expenses`| settlements               |
| `apps/server/src/modules/balances`| chỉ đọc từ 3 module trên |
| `apps/mobile/src/features/*`      | các feature khác (qua domain, không qua data) |
| `packages/shared`                 | **cần review kỹ khi đổi** — ảnh hưởng mọi người |
