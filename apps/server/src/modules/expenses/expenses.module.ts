import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { GroupsModule } from '../groups/groups.module';
import { ExpensesController } from './expenses.controller';
import { ExpensesRepository } from './expenses.repository';
import { ExpensesService } from './expenses.service';
import { PrismaExpensesRepository } from './prisma-expenses.repository';

@Module({
  imports: [SecurityModule, GroupsModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, { provide: ExpensesRepository, useClass: PrismaExpensesRepository }],
  exports: [ExpensesService],
})
export class ExpensesModule {}
