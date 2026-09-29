/** 1500000 -> "1.500.000 ₫" (không phụ thuộc Intl để chạy ổn định trên Hermes). */
export function formatCurrency(amount: number): string {
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
}
