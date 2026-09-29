import { Injectable } from '@nestjs/common';
import type { BankAccountInput } from '@keepay/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersRepository } from './users.repository';
import type { BankAccountRecord, UserRecord } from './users.types';

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  create(data: Omit<UserRecord, 'id'>): Promise<UserRecord> {
    return this.prisma.user.create({ data });
  }
  findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  findManyByIds(ids: string[]): Promise<UserRecord[]> {
    return this.prisma.user.findMany({ where: { id: { in: ids } } });
  }
  upsertBankAccount(userId: string, data: BankAccountInput): Promise<BankAccountRecord> {
    return this.prisma.bankAccount.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }
  findBankAccount(userId: string): Promise<BankAccountRecord | null> {
    return this.prisma.bankAccount.findUnique({ where: { userId } });
  }
}
