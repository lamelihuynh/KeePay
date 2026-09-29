import { describe, expect, it } from 'vitest';
import { buildVietQrPayload, parseTlv, verifyVietQrPayload } from './vietqr.builder';
import { crc16 } from './crc16';
import { toAscii } from './text';

describe('crc16', () => {
  it('khớp test vector chuẩn CRC-16/CCITT-FALSE', () => {
    expect(crc16('123456789')).toBe('29B1');
  });
});

describe('toAscii', () => {
  it('bỏ dấu tiếng Việt', () => {
    expect(toAscii('Tiền cơm trưa Đà Nẵng')).toBe('Tien com trua Da Nang');
  });
});

describe('buildVietQrPayload', () => {
  const base = { bankBin: '970436', accountNumber: '0123456789' };

  it('QR động: có số tiền, tag 01 = 12, CRC hợp lệ', () => {
    const p = buildVietQrPayload({ ...base, amount: 150000, message: 'Tiền cơm' });
    const t = parseTlv(p);
    expect(t['00']).toBe('01');
    expect(t['01']).toBe('12');
    expect(t['53']).toBe('704');
    expect(t['54']).toBe('150000');
    expect(t['58']).toBe('VN');
    expect(parseTlv(t['62']!)['08']).toBe('Tien com');
    expect(verifyVietQrPayload(p)).toBe(true);
  });

  it('QR tĩnh: không có số tiền, tag 01 = 11', () => {
    const t = parseTlv(buildVietQrPayload(base));
    expect(t['01']).toBe('11');
    expect(t['54']).toBeUndefined();
  });

  it('chứa GUID NAPAS, BIN, số tài khoản và dịch vụ QRIBFTTA', () => {
    const p = buildVietQrPayload({ ...base, amount: 1000 });
    const merchant = parseTlv(parseTlv(p)['38']!);
    expect(merchant['00']).toBe('A000000727');
    expect(merchant['02']).toBe('QRIBFTTA');
    const beneficiary = parseTlv(merchant['01']!);
    expect(beneficiary['00']).toBe('970436');
    expect(beneficiary['01']).toBe('0123456789');
  });

  it('cắt nội dung tối đa 25 ký tự', () => {
    const p = buildVietQrPayload({ ...base, amount: 1000, message: 'a'.repeat(60) });
    expect(parseTlv(parseTlv(p)['62']!)['08']).toHaveLength(25);
  });

  it('phát hiện payload bị sửa (CRC sai)', () => {
    const p = buildVietQrPayload({ ...base, amount: 1000 });
    expect(verifyVietQrPayload(p.replace('1000', '9000'))).toBe(false);
  });

  it('từ chối đầu vào sai', () => {
    expect(() => buildVietQrPayload({ ...base, bankBin: '123' })).toThrow();
    expect(() => buildVietQrPayload({ ...base, amount: 0 })).toThrow();
    expect(() => buildVietQrPayload({ ...base, amount: 10.5 })).toThrow();
    expect(() => buildVietQrPayload({ ...base, accountNumber: 'abc def' })).toThrow();
  });
});
