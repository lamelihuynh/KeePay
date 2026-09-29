import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { createExpenseSchema, type CreateExpenseInput } from '@keepay/shared';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ExpensesService } from './expenses.service';

@Controller('groups/:groupId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('groupId') groupId: string,
    @Body(new ZodValidationPipe(createExpenseSchema)) body: CreateExpenseInput,
  ) {
    return this.expenses.create(groupId, user.id, body);
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Param('groupId') groupId: string) {
    return this.expenses.list(groupId, user.id);
  }
}
