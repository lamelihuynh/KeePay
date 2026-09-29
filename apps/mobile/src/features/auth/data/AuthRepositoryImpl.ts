import type { AxiosInstance } from 'axios';
import type { LoginInput, RegisterInput } from '@keepay/shared';
import { tokenStorage } from '@/core/storage/tokenStorage';
import type { Session, User } from '../domain/entities/Session';
import type { AuthRepository, SessionStore } from '../domain/repositories/AuthRepository';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly http: AxiosInstance) {}
  login(input: LoginInput) {
    return this.http.post<Session>('/auth/login', input).then((r) => r.data);
  }
  register(input: RegisterInput) {
    return this.http.post<Session>('/auth/register', input).then((r) => r.data);
  }
  me(): Promise<User> {
    return this.http.get<User>('/users/me').then((r) => ({ id: r.data.id, displayName: r.data.displayName }));
  }
}

export class SecureSessionStore implements SessionStore {
  save(accessToken: string) {
    return tokenStorage.set(accessToken);
  }
  async hasSession() {
    return (await tokenStorage.get()) !== null;
  }
  clear() {
    return tokenStorage.clear();
  }
}
