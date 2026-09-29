import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { bankAccountSchema, type BankAccountInput } from '@keepay/shared';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.id);
  }

  @Put('me/bank-account')
  setBankAccount(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(bankAccountSchema)) body: BankAccountInput,
  ) {
    return this.users.setBankAccount(user.id, body);
  }
}
