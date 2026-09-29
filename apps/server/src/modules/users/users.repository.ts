import type { BankAccountInput } from '@keepay/shared';
import type { BankAccountRecord, UserRecord } from './users.types';

/** Abstract class dùng làm DI token: service chỉ biết interface, không biết Prisma. */
export abstract class UsersRepository {
  abstract create(data: Omit<UserRecord, 'id'>): Promise<UserRecord>;
  abstract findByEmail(email: string): Promise<UserRecord | null>;
  abstract findById(id: string): Promise<UserRecord | null>;
  abstract findManyByIds(ids: string[]): Promise<UserRecord[]>;
  abstract upsertBankAccount(userId: string, data: BankAccountInput): Promise<BankAccountRecord>;
  abstract findBankAccount(userId: string): Promise<BankAccountRecord | null>;
}
