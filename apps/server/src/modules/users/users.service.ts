import { Injectable, NotFoundException } from '@nestjs/common';
import type { BankAccountInput } from '@keepay/shared';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async getProfile(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const bankAccount = await this.users.findBankAccount(userId);
    return { id: user.id, email: user.email, displayName: user.displayName, bankAccount };
  }

  setBankAccount(userId: string, data: BankAccountInput) {
    return this.users.upsertBankAccount(userId, data);
  }

  findBankAccount(userId: string) {
    return this.users.findBankAccount(userId);
  }

  findByEmail(email: string) {
    return this.users.findByEmail(email.toLowerCase());
  }

  findManyByIds(ids: string[]) {
    return this.users.findManyByIds(ids);
  }
}
