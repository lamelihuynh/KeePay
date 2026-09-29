import type { AxiosInstance } from 'axios';
import type { BankAccountInput } from '@keepay/shared';
import type { Profile } from '../domain/entities/Profile';
import type { ProfileRepository } from '../domain/repositories/ProfileRepository';

export class ProfileRepositoryImpl implements ProfileRepository {
  constructor(private readonly http: AxiosInstance) {}
  get() {
    return this.http.get<Profile>('/users/me').then((r) => r.data);
  }
  async saveBankAccount(input: BankAccountInput) {
    await this.http.put('/users/me/bank-account', input);
  }
}
