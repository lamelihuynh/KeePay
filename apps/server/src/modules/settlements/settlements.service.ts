import { BadRequestException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { buildVietQrPayload, type CreateSettlementInput, type PaymentQrInput } from '@keepay/shared';
import { GroupsService } from '../groups/groups.service';
import { UsersService } from '../users/users.service';
import { SettlementsRepository } from './settlements.repository';

@Injectable()
export class SettlementsService {
  constructor(
    private readonly settlements: SettlementsRepository,
    private readonly groups: GroupsService,
    private readonly users: UsersService,
  ) {}

  /** Ghi nhận "from đã trả to". Chỉ người trả hoặc người nhận mới được ghi nhận. */
  async create(groupId: string, actorId: string, input: CreateSettlementInput) {
    const group = await this.groups.requireMember(groupId, actorId);
    if (input.fromUserId === input.toUserId) throw new BadRequestException('Không thể tự thanh toán cho mình');
    if (![input.fromUserId, input.toUserId].every((id) => group.memberIds.includes(id))) {
      throw new BadRequestException('Hai bên phải là thành viên của nhóm');
    }
    if (actorId !== input.fromUserId && actorId !== input.toUserId) {
      throw new ForbiddenException('Chỉ người trả hoặc người nhận mới được ghi nhận thanh toán');
    }
    return this.settlements.create(groupId, input);
  }

  /** Sinh payload VietQR để `from` chuyển tiền cho `to` (dùng tài khoản ngân hàng của `to`). */
  async paymentQr(groupId: string, actorId: string, input: PaymentQrInput) {
    const group = await this.groups.requireMember(groupId, actorId);
    const fromUserId = input.fromUserId ?? actorId;
    if (fromUserId !== actorId) throw new ForbiddenException('Chỉ tạo QR cho chính mình');
    if (!group.memberIds.includes(input.toUserId)) throw new BadRequestException('Người nhận không thuộc nhóm');
    if (input.toUserId === fromUserId) throw new BadRequestException('Không thể tự thanh toán cho mình');

    const bank = await this.users.findBankAccount(input.toUserId);
    if (!bank) throw new UnprocessableEntityException('Người nhận chưa cấu hình tài khoản ngân hàng');

    const payload = buildVietQrPayload({
      bankBin: bank.bankBin,
      accountNumber: bank.accountNumber,
      amount: input.amount,
      message: `KeePay ${group.name}`,
    });
    return {
      payload,
      amount: input.amount,
      recipient: { userId: bank.userId, accountHolder: bank.accountHolder, bankBin: bank.bankBin },
    };
  }

  listRaw(groupId: string) {
    return this.settlements.listByGroup(groupId);
  }
}
