import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { PrismaUsersRepository } from './prisma-users.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [SecurityModule],
  controllers: [UsersController],
  providers: [UsersService, { provide: UsersRepository, useClass: PrismaUsersRepository }],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
