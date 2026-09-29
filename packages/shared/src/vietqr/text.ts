/** Bỏ dấu tiếng Việt để nội dung chuyển khoản là ASCII (bắt buộc với payload VietQR). */
export function toAscii(text: string): string {
  return text
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '');
}
