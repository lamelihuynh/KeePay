import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import groupReducer from '@/features/group/store/groupSlice';
import { container } from '../di/container';

export const store = configureStore({
  reducer: { auth: authReducer, groups: groupReducer },
  // DI: mọi thunk nhận `container` qua `extra` -> slice không import data layer, dễ mock khi test.
  middleware: (getDefault) => getDefault({ thunk: { extraArgument: container } }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
