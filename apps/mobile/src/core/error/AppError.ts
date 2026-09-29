/** Lỗi nghiệp vụ/validation ở tầng domain; message đã sẵn sàng hiển thị cho người dùng. */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}
