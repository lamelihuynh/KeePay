import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@/core/store';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { restoreSession } from '@/features/auth/store/authSlice';

/** Chặn truy cập: chưa đăng nhập -> /login; đã đăng nhập mà đang ở (auth) -> trang chủ. */
function AuthGate() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const { user, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle' || status === 'restoring') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) router.replace('/login');
    else if (user && inAuthGroup) router.replace('/');
  }, [user, status, segments, router]);

  if (status === 'idle' || status === 'restoring') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGate />
    </Provider>
  );
}
