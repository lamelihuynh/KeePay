import { AuthRepositoryImpl, SecureSessionStore } from '@/features/auth/data/AuthRepositoryImpl';
import {
  LoginUseCase,
  LogoutUseCase,
  RegisterUseCase,
  RestoreSessionUseCase,
} from '@/features/auth/domain/usecases/auth.usecases';
import { ExpenseRepositoryImpl } from '@/features/expense/data/ExpenseRepositoryImpl';
import {
  CreateExpenseUseCase,
  ListExpensesUseCase,
} from '@/features/expense/domain/usecases/expense.usecases';
import { GroupRepositoryImpl } from '@/features/group/data/GroupRepositoryImpl';
import {
  AddMemberByEmailUseCase,
  CreateGroupUseCase,
  GetGroupBalancesUseCase,
  GetGroupDetailUseCase,
  ListGroupsUseCase,
} from '@/features/group/domain/usecases/group.usecases';
import { ProfileRepositoryImpl } from '@/features/profile/data/ProfileRepositoryImpl';
import {
  GetProfileUseCase,
  SaveBankAccountUseCase,
} from '@/features/profile/domain/usecases/profile.usecases';
import { SettlementRepositoryImpl } from '@/features/settlement/data/SettlementRepositoryImpl';
import {
  GetPaymentQrUseCase,
  RecordSettlementUseCase,
} from '@/features/settlement/domain/usecases/settlement.usecases';
import { httpClient } from '../api/httpClient';

/**
 * Composition root: NƠI DUY NHẤT nối domain với data.
 * Thêm feature mới = tạo repository impl + use case, rồi đăng ký ở đây.
 */
const sessionStore = new SecureSessionStore();
const authRepo = new AuthRepositoryImpl(httpClient);
const groupRepo = new GroupRepositoryImpl(httpClient);
const expenseRepo = new ExpenseRepositoryImpl(httpClient);
const settlementRepo = new SettlementRepositoryImpl(httpClient);
const profileRepo = new ProfileRepositoryImpl(httpClient);

export const container = {
  auth: {
    login: new LoginUseCase(authRepo, sessionStore),
    register: new RegisterUseCase(authRepo, sessionStore),
    logout: new LogoutUseCase(sessionStore),
    restore: new RestoreSessionUseCase(authRepo, sessionStore),
  },
  group: {
    list: new ListGroupsUseCase(groupRepo),
    create: new CreateGroupUseCase(groupRepo),
    detail: new GetGroupDetailUseCase(groupRepo),
    balances: new GetGroupBalancesUseCase(groupRepo),
    addMember: new AddMemberByEmailUseCase(groupRepo),
  },
  expense: {
    create: new CreateExpenseUseCase(expenseRepo),
    list: new ListExpensesUseCase(expenseRepo),
  },
  settlement: {
    paymentQr: new GetPaymentQrUseCase(settlementRepo),
    record: new RecordSettlementUseCase(settlementRepo),
  },
  profile: {
    get: new GetProfileUseCase(profileRepo),
    saveBankAccount: new SaveBankAccountUseCase(profileRepo),
  },
};

export type Container = typeof container;
