import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BalancesModule } from './modules/balances/balances.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { HealthController } from './modules/health/health.controller';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    ExpensesModule,
    BalancesModule,
    SettlementsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
