import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { colors } from '@/shared/theme/colors';
import { login } from '../../store/authSlice';

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>KeePay</Text>
      <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextField label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <ErrorText message={error} />
      <Button title="Đăng nhập" loading={status === 'submitting'} onPress={() => void dispatch(login({ email, password }))} />
      <Pressable onPress={() => router.replace('/register')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '700', color: colors.primary, marginVertical: 24, textAlign: 'center' },
  link: { color: colors.primary, textAlign: 'center', marginTop: 16 },
});
