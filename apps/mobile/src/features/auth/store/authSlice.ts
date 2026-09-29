import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Container } from '@/core/di/container';
import { toErrorMessage } from '@/core/error/errorMessage';
import type { User } from '../domain/entities/Session';

type ThunkConfig = { extra: Container; rejectValue: string };

export const restoreSession = createAsyncThunk<User | null, void, ThunkConfig>(
  'auth/restore',
  (_, { extra }) => extra.auth.restore.execute(),
);
export const login = createAsyncThunk<User, { email: string; password: string }, ThunkConfig>(
  'auth/login',
  async (args, { extra, rejectWithValue }) => {
    try {
      return await extra.auth.login.execute(args);
    } catch (e) {
      return rejectWithValue(toErrorMessage(e));
    }
  },
);
export const register = createAsyncThunk<
  User,
  { email: string; password: string; displayName: string },
  ThunkConfig
>('auth/register', async (args, { extra, rejectWithValue }) => {
  try {
    return await extra.auth.register.execute(args);
  } catch (e) {
    return rejectWithValue(toErrorMessage(e));
  }
});
export const logout = createAsyncThunk<void, void, ThunkConfig>('auth/logout', (_, { extra }) =>
  extra.auth.logout.execute(),
);

interface AuthState {
  user: User | null;
  status: 'idle' | 'restoring' | 'ready' | 'submitting';
  error: string | null;
}
const initialState: AuthState = { user: null, status: 'idle', error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(restoreSession.pending, (s) => {
      s.status = 'restoring';
    })
      .addCase(restoreSession.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = 'ready';
      })
      .addCase(restoreSession.rejected, (s) => {
        s.user = null;
        s.status = 'ready';
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.error = null;
      });
    for (const thunk of [login, register]) {
      b.addCase(thunk.pending, (s) => {
        s.status = 'submitting';
        s.error = null;
      })
        .addCase(thunk.fulfilled, (s, a) => {
          s.user = a.payload;
          s.status = 'ready';
        })
        .addCase(thunk.rejected, (s, a) => {
          s.status = 'ready';
          s.error = a.payload ?? 'Có lỗi xảy ra';
        });
    }
  },
});
export default authSlice.reducer;
