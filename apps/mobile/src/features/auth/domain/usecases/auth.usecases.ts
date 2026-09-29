import { loginSchema, registerSchema } from '@keepay/shared';
import { parseOrThrow } from '@/core/validation/parseOrThrow';
import type { User } from '../entities/Session';
import type { AuthRepository, SessionStore } from '../repositories/AuthRepository';

export class LoginUseCase {
  constructor(private readonly repo: AuthRepository, private readonly store: SessionStore) {}
  async execute(raw: { email: string; password: string }): Promise<User> {
    const input = parseOrThrow(loginSchema, { ...raw, email: raw.email.trim() });
    const session = await this.repo.login(input);
    await this.store.save(session.accessToken);
    return session.user;
  }
}

export class RegisterUseCase {
  constructor(private readonly repo: AuthRepository, private readonly store: SessionStore) {}
  async execute(raw: { email: string; password: string; displayName: string }): Promise<User> {
    const input = parseOrThrow(registerSchema, {
      ...raw,
      email: raw.email.trim(),
      displayName: raw.displayName.trim(),
    });
    const session = await this.repo.register(input);
    await this.store.save(session.accessToken);
    return session.user;
  }
}

export class LogoutUseCase {
  constructor(private readonly store: SessionStore) {}
  execute(): Promise<void> {
    return this.store.clear();
  }
}

/** Khôi phục phiên khi mở app: có token và token còn hợp lệ -> trả về user, ngược lại null. */
export class RestoreSessionUseCase {
  constructor(private readonly repo: AuthRepository, private readonly store: SessionStore) {}
  async execute(): Promise<User | null> {
    if (!(await this.store.hasSession())) return null;
    try {
      return await this.repo.me();
    } catch {
      await this.store.clear();
      return null;
    }
  }
}
