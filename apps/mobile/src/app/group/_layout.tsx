import { Stack } from 'expo-router';

export default function GroupLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ title: 'Tạo nhóm' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Chi tiết nhóm' }} />
      <Stack.Screen name="[id]/create-expense" options={{ title: 'Thêm khoản chi' }} />
      <Stack.Screen name="[id]/settle" options={{ title: 'Thanh toán VietQR' }} />
    </Stack>
  );
}
