import type { LoginInput, RegisterInput } from '@keepay/shared';
import type { Session, User } from '../entities/Session';

export interface AuthRepository {
  login(input: LoginInput): Promise<Session>;
  register(input: RegisterInput): Promise<Session>;
  me(): Promise<User>;
}
export interface SessionStore {
  save(accessToken: string): Promise<void>;
  hasSession(): Promise<boolean>;
  clear(): Promise<void>;
}
