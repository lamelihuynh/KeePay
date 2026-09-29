import { describe, expect, it, vi } from 'vitest';
import { AppError } from '@/core/error/AppError';
import type { AuthRepository, SessionStore } from '../repositories/AuthRepository';
import { LoginUseCase, RegisterUseCase, RestoreSessionUseCase } from './auth.usecases';

const user = { id: 'u1', displayName: 'An' };
function fakes(overrides: Partial<AuthRepository> = {}, hasSession = true) {
  const repo: AuthRepository = {
    login: vi.fn(async () => ({ accessToken: 'tok', user })),
    register: vi.fn(async () => ({ accessToken: 'tok2', user })),
    me: vi.fn(async () => user),
    ...overrides,
  };
  const store: SessionStore = {
    save: vi.fn(async () => {}),
    hasSession: vi.fn(async () => hasSession),
    clear: vi.fn(async () => {}),
  };
  return { repo, store };
}

describe('LoginUseCase', () => {
  it('đăng nhập thành công: lưu token và trả về user', async () => {
    const { repo, store } = fakes();
    await expect(new LoginUseCase(repo, store).execute({ email: ' an@x.com ', password: 'pw' })).resolves.toEqual(user);
    expect(repo.login).toHaveBeenCalledWith({ email: 'an@x.com', password: 'pw' });
    expect(store.save).toHaveBeenCalledWith('tok');
  });
  it('email sai định dạng: AppError, không gọi API, không lưu token', async () => {
    const { repo, store } = fakes();
    await expect(new LoginUseCase(repo, store).execute({ email: 'abc', password: 'pw' })).rejects.toBeInstanceOf(AppError);
    expect(repo.login).not.toHaveBeenCalled();
    expect(store.save).not.toHaveBeenCalled();
  });
});

describe('RegisterUseCase', () => {
  it('mật khẩu ngắn bị chặn ở client', async () => {
    const { repo, store } = fakes();
    await expect(
      new RegisterUseCase(repo, store).execute({ email: 'a@b.co', password: '123', displayName: 'An' }),
    ).rejects.toBeInstanceOf(AppError);
    expect(repo.register).not.toHaveBeenCalled();
  });
});

describe('RestoreSessionUseCase', () => {
  it('không có token -> null, không gọi API', async () => {
    const { repo, store } = fakes({}, false);
    await expect(new RestoreSessionUseCase(repo, store).execute()).resolves.toBeNull();
    expect(repo.me).not.toHaveBeenCalled();
  });
  it('token hợp lệ -> trả về user', async () => {
    const { repo, store } = fakes();
    await expect(new RestoreSessionUseCase(repo, store).execute()).resolves.toEqual(user);
  });
  it('token hết hạn (me() lỗi) -> xoá token và trả null', async () => {
    const { repo, store } = fakes({ me: vi.fn(async () => { throw new Error('401'); }) });
    await expect(new RestoreSessionUseCase(repo, store).execute()).resolves.toBeNull();
    expect(store.clear).toHaveBeenCalled();
  });
});
