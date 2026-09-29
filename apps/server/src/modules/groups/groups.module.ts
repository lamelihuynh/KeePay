import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { UsersModule } from '../users/users.module';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from './groups.repository';
import { GroupsService } from './groups.service';
import { PrismaGroupsRepository } from './prisma-groups.repository';

@Module({
  imports: [SecurityModule, UsersModule],
  controllers: [GroupsController],
  providers: [GroupsService, { provide: GroupsRepository, useClass: PrismaGroupsRepository }],
  exports: [GroupsService],
})
export class GroupsModule {}
