import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BalancesService } from './balances.service';

@Controller('groups/:groupId/balances')
@UseGuards(JwtAuthGuard)
export class BalancesController {
  constructor(private readonly balances: BalancesService) {}

  @Get()
  get(@CurrentUser() user: AuthUser, @Param('groupId') groupId: string) {
    return this.balances.getGroupBalances(groupId, user.id);
  }
}
