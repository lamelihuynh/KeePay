import { crc16 } from './crc16';
import { toAscii } from './text';

export interface VietQrInput {
  /** Mã BIN 6 số của ngân hàng thụ hưởng. */
  bankBin: string;
  /** Số tài khoản thụ hưởng (chữ và số, tối đa 19 ký tự). */
  accountNumber: string;
  /** Số tiền VND (số nguyên dương). Bỏ trống => QR tĩnh, người trả tự nhập tiền. */
  amount?: number;
  /** Nội dung chuyển khoản. Tự bỏ dấu và cắt còn tối đa 25 ký tự. */
  message?: string;
}

const MAX_MESSAGE_LENGTH = 25;

function tlv(tag: string, value: string): string {
  if (value.length > 99) throw new Error(`TLV tag ${tag} quá dài (${value.length} > 99)`);
  return `${tag}${value.length.toString().padStart(2, '0')}${value}`;
}

export function buildVietQrPayload(input: VietQrInput): string {
  if (!/^\d{6}$/.test(input.bankBin)) throw new Error('bankBin phải gồm đúng 6 chữ số');
  if (!/^[A-Za-z0-9]{1,19}$/.test(input.accountNumber)) {
    throw new Error('accountNumber chỉ gồm chữ/số, tối đa 19 ký tự');
  }
  if (input.amount !== undefined && (!Number.isInteger(input.amount) || input.amount <= 0)) {
    throw new Error('amount phải là số nguyên dương (VND)');
  }

  const beneficiary = tlv('00', input.bankBin) + tlv('01', input.accountNumber);
  const merchantInfo = tlv('00', 'A000000727') + tlv('01', beneficiary) + tlv('02', 'QRIBFTTA');

  const hasAmount = input.amount !== undefined;
  const message = input.message ? toAscii(input.message).trim().slice(0, MAX_MESSAGE_LENGTH) : '';

  const body =
    tlv('00', '01') +
    tlv('01', hasAmount ? '12' : '11') +
    tlv('38', merchantInfo) +
    tlv('53', '704') +
    (hasAmount ? tlv('54', String(input.amount)) : '') +
    tlv('58', 'VN') +
    (message ? tlv('62', tlv('08', message)) : '') +
    '6304';

  return body + crc16(body);
}

/** Tách payload thành map tag -> value (cấp 1). Dùng cho test/debug. */
export function parseTlv(payload: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;
  while (i < payload.length) {
    const tag = payload.slice(i, i + 2);
    const len = Number(payload.slice(i + 2, i + 4));
    out[tag] = payload.slice(i + 4, i + 4 + len);
    i += 4 + len;
  }
  return out;
}

/** Kiểm tra CRC của một payload VietQR/EMVCo. */
export function verifyVietQrPayload(payload: string): boolean {
  if (payload.length < 8 || payload.slice(-8, -4) !== '6304') return false;
  return crc16(payload.slice(0, -4)) === payload.slice(-4);
}
