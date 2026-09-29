import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { parseTlv, verifyVietQrPayload } from '@keepay/shared';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ExpensesRepository } from '../src/modules/expenses/expenses.repository';
import { GroupsRepository } from '../src/modules/groups/groups.repository';
import { SettlementsRepository } from '../src/modules/settlements/settlements.repository';
import { UsersRepository } from '../src/modules/users/users.repository';
import {
  InMemoryExpensesRepository,
  InMemoryGroupsRepository,
  InMemorySettlementsRepository,
  InMemoryUsersRepository,
} from './support/in-memory.repositories';

describe('KeePay API (e2e, in-memory repositories)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  async function register(name: string) {
    const res = await http()
      .post('/auth/register')
      .send({ email: `${name}@test.dev`, password: 'password123', displayName: name })
      .expect(201);
    return { id: res.body.user.id as string, token: res.body.accessToken as string };
  }
  const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService).useValue({})
      .overrideProvider(UsersRepository).useClass(InMemoryUsersRepository)
      .overrideProvider(GroupsRepository).useClass(InMemoryGroupsRepository)
      .overrideProvider(ExpensesRepository).useClass(InMemoryExpensesRepository)
      .overrideProvider(SettlementsRepository).useClass(InMemorySettlementsRepository)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(() => app.close());

  it('GET /health', async () => {
    await http().get('/health').expect(200, { status: 'ok' });
  });

  describe('auth', () => {
    it('đăng ký, trùng email 409, đăng nhập đúng/sai, validate 400', async () => {
      await register('zed');
      await http().post('/auth/register').send({ email: 'zed@test.dev', password: 'password123', displayName: 'Z' }).expect(409);
      await http().post('/auth/login').send({ email: 'zed@test.dev', password: 'password123' }).expect(200);
      await http().post('/auth/login').send({ email: 'zed@test.dev', password: 'wrong-pass' }).expect(401);
      await http().post('/auth/register').send({ email: 'not-an-email', password: '1', displayName: '' }).expect(400);
    });
    it('route được bảo vệ trả 401 khi thiếu/sai token', async () => {
      await http().get('/users/me').expect(401);
      await http().get('/users/me').set(auth('garbage')).expect(401);
    });
  });

  describe('luồng chia tiền nhóm + VietQR', () => {
    let alice: { id: string; token: string };
    let bob: { id: string; token: string };
    let carol: { id: string; token: string };
    let dave: { id: string; token: string };
    let groupId: string;

    beforeAll(async () => {
      alice = await register('alice');
      bob = await register('bob');
      carol = await register('carol');
      dave = await register('dave');
      const res = await http().post('/groups').set(auth(alice.token))
        .send({ name: 'Đà Lạt', memberIds: [bob.id, carol.id] }).expect(201);
      groupId = res.body.id;
    });

    it('nhóm có 3 thành viên (gồm người tạo)', async () => {
      const res = await http().get(`/groups/${groupId}`).set(auth(alice.token)).expect(200);
      expect(res.body.memberIds.sort()).toEqual([alice.id, bob.id, carol.id].sort());
    });

    it('chi tiết nhóm có tên thành viên; mời thêm thành viên bằng email', async () => {
      const detail = await http().get(`/groups/${groupId}`).set(auth(alice.token)).expect(200);
      expect(detail.body.members.map((m: { displayName: string }) => m.displayName).sort()).toEqual(['alice', 'bob', 'carol']);

      await register('erin');
      const added = await http().post(`/groups/${groupId}/members`).set(auth(alice.token))
        .send({ email: 'ERIN@test.dev' }).expect(201);
      expect(added.body.members).toHaveLength(4);

      await http().post(`/groups/${groupId}/members`).set(auth(alice.token))
        .send({ email: 'nobody@test.dev' }).expect(404);
      await http().post(`/groups/${groupId}/members`).set(auth(dave.token))
        .send({ email: 'zed@test.dev' }).expect(403);
    });

    it('người ngoài nhóm bị chặn (403)', async () => {
      await http().get(`/groups/${groupId}`).set(auth(dave.token)).expect(403);
      await http().get(`/groups/${groupId}/balances`).set(auth(dave.token)).expect(403);
    });

    it('từ chối khoản chi sai tổng (400) hoặc có người ngoài nhóm (400)', async () => {
      await http().post(`/groups/${groupId}/expenses`).set(auth(alice.token))
        .send({ description: 'x', amount: 100000, paidById: alice.id, splits: [{ userId: alice.id, amount: 1 }] })
        .expect(400);
      await http().post(`/groups/${groupId}/expenses`).set(auth(alice.token))
        .send({ description: 'x', amount: 100000, paidById: alice.id, splits: [{ userId: dave.id, amount: 100000 }] })
        .expect(400);
    });

    it('tính đúng công nợ và rút gọn', async () => {
      const equal = (amount: number) => [alice, bob, carol].map((u) => ({ userId: u.id, amount }));
      await http().post(`/groups/${groupId}/expenses`).set(auth(alice.token))
        .send({ description: 'Khách sạn', amount: 90000, paidById: alice.id, splits: equal(30000) }).expect(201);
      await http().post(`/groups/${groupId}/expenses`).set(auth(bob.token))
        .send({ description: 'Cà phê', amount: 30000, paidById: bob.id, splits: equal(10000) }).expect(201);

      const res = await http().get(`/groups/${groupId}/balances`).set(auth(carol.token)).expect(200);
      expect(res.body.net).toEqual({ [alice.id]: 50000, [bob.id]: -10000, [carol.id]: -40000 });
      expect(res.body.debts).toEqual(
        expect.arrayContaining([
          { fromUserId: carol.id, toUserId: alice.id, amount: 40000 },
          { fromUserId: bob.id, toUserId: alice.id, amount: 10000 },
        ]),
      );
      expect(res.body.debts).toHaveLength(2);
    });

    it('QR: 422 khi người nhận chưa có tài khoản ngân hàng', async () => {
      await http().post(`/groups/${groupId}/payment-qr`).set(auth(carol.token))
        .send({ toUserId: alice.id, amount: 40000 }).expect(422);
    });

    it('QR: sinh payload VietQR hợp lệ (CRC đúng, đúng BIN/số TK/số tiền)', async () => {
      await http().put('/users/me/bank-account').set(auth(alice.token))
        .send({ bankBin: '970436', accountNumber: '0123456789', accountHolder: 'NGUYEN VAN A' }).expect(200);
      const res = await http().post(`/groups/${groupId}/payment-qr`).set(auth(carol.token))
        .send({ toUserId: alice.id, amount: 40000 }).expect(201);

      const { payload } = res.body;
      expect(verifyVietQrPayload(payload)).toBe(true);
      const tags = parseTlv(payload);
      expect(tags['54']).toBe('40000');
      const beneficiary = parseTlv(parseTlv(tags['38']!)['01']!);
      expect(beneficiary).toEqual({ '00': '970436', '01': '0123456789' });
      expect(parseTlv(tags['62']!)['08']).toBe('KeePay Da Lat');
    });

    it('không cho tạo QR thay người khác', async () => {
      await http().post(`/groups/${groupId}/payment-qr`).set(auth(carol.token))
        .send({ toUserId: alice.id, amount: 1000, fromUserId: bob.id }).expect(403);
    });

    it('settlement: người thứ ba bị 403; carol trả xong thì nợ còn lại đúng', async () => {
      await http().post(`/groups/${groupId}/settlements`).set(auth(bob.token))
        .send({ fromUserId: carol.id, toUserId: alice.id, amount: 40000 }).expect(403);
      await http().post(`/groups/${groupId}/settlements`).set(auth(carol.token))
        .send({ fromUserId: carol.id, toUserId: alice.id, amount: 40000 }).expect(201);

      const res = await http().get(`/groups/${groupId}/balances`).set(auth(alice.token)).expect(200);
      expect(res.body.net[carol.id]).toBe(0);
      expect(res.body.debts).toEqual([{ fromUserId: bob.id, toUserId: alice.id, amount: 10000 }]);
    });
  });
});
