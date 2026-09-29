/**
 * Mã BIN ngân hàng (NAPAS). Danh sách rút gọn để dev/test.
 * TODO(team-payment): đối chiếu với danh sách chính thức của NAPAS trước khi lên production.
 */
export const BANK_BINS = {
  VCB: { bin: '970436', name: 'Vietcombank' },
  CTG: { bin: '970415', name: 'VietinBank' },
  BIDV: { bin: '970418', name: 'BIDV' },
  AGRIBANK: { bin: '970405', name: 'Agribank' },
  TCB: { bin: '970407', name: 'Techcombank' },
  MB: { bin: '970422', name: 'MB Bank' },
  ACB: { bin: '970416', name: 'ACB' },
  VPB: { bin: '970432', name: 'VPBank' },
  TPB: { bin: '970423', name: 'TPBank' },
  STB: { bin: '970403', name: 'Sacombank' },
  HDB: { bin: '970437', name: 'HDBank' },
  VIB: { bin: '970441', name: 'VIB' },
} as const;

export type BankCode = keyof typeof BANK_BINS;
