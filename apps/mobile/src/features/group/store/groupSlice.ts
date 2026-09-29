import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Container } from '@/core/di/container';
import { toErrorMessage } from '@/core/error/errorMessage';
import type { Group } from '../domain/entities/Group';

export const fetchGroups = createAsyncThunk<Group[], void, { extra: Container; rejectValue: string }>(
  'groups/fetch',
  async (_, { extra, rejectWithValue }) => {
    try {
      return await extra.group.list.execute();
    } catch (e) {
      return rejectWithValue(toErrorMessage(e));
    }
  },
);

interface GroupState {
  items: Group[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}
const initialState: GroupState = { items: [], status: 'idle', error: null };

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchGroups.pending, (s) => {
      s.status = 'loading';
      s.error = null;
    })
      .addCase(fetchGroups.fulfilled, (s, a) => {
        s.items = a.payload;
        s.status = 'ready';
      })
      .addCase(fetchGroups.rejected, (s, a) => {
        s.status = 'error';
        s.error = a.payload ?? 'Có lỗi xảy ra';
      });
  },
});
export default groupSlice.reducer;
