import { bankAccountSchema } from '@keepay/shared';
import { parseOrThrow } from '@/core/validation/parseOrThrow';
import type { ProfileRepository } from '../repositories/ProfileRepository';

export class GetProfileUseCase {
  constructor(private readonly repo: ProfileRepository) {}
  execute() {
    return this.repo.get();
  }
}
export class SaveBankAccountUseCase {
  constructor(private readonly repo: ProfileRepository) {}
  execute(raw: { bankBin: string; accountNumber: string; accountHolder: string }) {
    return this.repo.saveBankAccount(
      parseOrThrow(bankAccountSchema, {
        bankBin: raw.bankBin.trim(),
        accountNumber: raw.accountNumber.replace(/\s/g, ''),
        accountHolder: raw.accountHolder.trim().toUpperCase(),
      }),
    );
  }
}
