import type { BankAccountInput } from '@keepay/shared';
import type { Profile } from '../entities/Profile';

export interface ProfileRepository {
  get(): Promise<Profile>;
  saveBankAccount(input: BankAccountInput): Promise<void>;
}
