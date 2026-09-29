import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { GroupsModule } from '../groups/groups.module';
import { SettlementsModule } from '../settlements/settlements.module';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';

@Module({
  imports: [SecurityModule, GroupsModule, ExpensesModule, SettlementsModule],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
