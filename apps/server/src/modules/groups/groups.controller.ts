import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  addMemberSchema,
  createGroupSchema,
  type AddMemberInput,
  type CreateGroupInput,
} from '@keepay/shared';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { GroupsService } from './groups.service';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createGroupSchema)) body: CreateGroupInput,
  ) {
    return this.groups.create(user.id, body);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.groups.listForUser(user.id);
  }

  @Get(':groupId')
  get(@CurrentUser() user: AuthUser, @Param('groupId') groupId: string) {
    return this.groups.getDetail(groupId, user.id);
  }

  @Post(':groupId/members')
  addMember(
    @CurrentUser() user: AuthUser,
    @Param('groupId') groupId: string,
    @Body(new ZodValidationPipe(addMemberSchema)) body: AddMemberInput,
  ) {
    return this.groups.addMemberByEmail(groupId, user.id, body.email);
  }
}
