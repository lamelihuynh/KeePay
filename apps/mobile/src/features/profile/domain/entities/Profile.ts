import type { BankAccountInput } from '@keepay/shared';

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  bankAccount: BankAccountInput | null;
}
