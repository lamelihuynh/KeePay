import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { GroupsModule } from '../groups/groups.module';
import { UsersModule } from '../users/users.module';
import { PrismaSettlementsRepository } from './prisma-settlements.repository';
import { SettlementsController } from './settlements.controller';
import { SettlementsRepository } from './settlements.repository';
import { SettlementsService } from './settlements.service';

@Module({
  imports: [SecurityModule, GroupsModule, UsersModule],
  controllers: [SettlementsController],
  providers: [
    SettlementsService,
    { provide: SettlementsRepository, useClass: PrismaSettlementsRepository },
  ],
  exports: [SettlementsService],
})
export class SettlementsModule {}
