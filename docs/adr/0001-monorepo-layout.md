# ADR 0001: Monorepo + Clean/Feature-based Architecture

## Bối cảnh
KeePay sẽ do nhiều người/nhiều nhóm cùng phát triển song song (mobile, backend, có thể thêm web
sau này). Cần một cấu trúc cho phép làm việc độc lập theo feature mà không giẫm code lên nhau,
và một nơi duy nhất chứa đối chiếu quy tắc build QR/tính nợ để hai phía client-server không lệch nhau.

## Quyết định
- Một repo duy nhất (npm workspaces), không tách nhiều repo, để không phải version từng package
  riêng lẻ ở giai đoạn còn thay đổi API thường xuyên.
- `packages/shared`: chứa mọi logic không phụ thuộc framework mà cả hai phía cùng cần — payload
  VietQR (TLV + CRC16), thuật toán chia tiền, zod schema cho request/response.
- Mobile theo Clean Architecture theo feature (`presentation / domain / data`); mỗi feature độc
  lập, chỉ phụ thuộc `domain` của feature khác (nếu cần) chứ không phụ thuộc `data`/`presentation`.
- Server theo NestJS module theo domain (`auth`, `groups`, `expenses`, `balances`, `settlements`),
  Controller → Service → Repository; Repository là abstract class (DI token) để test bằng
  in-memory repository, không cần DB thật (xem `apps/server/test/support`).

## Hệ quả
- Đổi contract (ví dụ field mới trong request) => sửa 1 chỗ ở `packages/shared`, cả hai app đều
  thấy lỗi type ngay nếu chưa cập nhật theo — bắt lỗi lúc build thay vì lúc chạy.
- Muốn thêm 1 feature mới ở mobile: tạo thư mục trong `features/`, viết usecase + repository,
  đăng ký ở `core/di/container.ts`. Không cần sửa file nào khác.
- Đánh đổi: thêm bước `npm run build:shared` trước khi build/test app khác (đã gói sẵn trong các
  script ở `package.json` gốc).
