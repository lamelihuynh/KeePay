import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { colors } from '@/shared/theme/colors';
import { register } from '../../store/authSlice';

export function RegisterScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <TextField label="Tên hiển thị" value={displayName} onChangeText={setDisplayName} />
      <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextField label="Mật khẩu (tối thiểu 8 ký tự)" value={password} onChangeText={setPassword} secureTextEntry />
      <ErrorText message={error} />
      <Button title="Đăng ký" loading={status === 'submitting'} onPress={() => void dispatch(register({ email, password, displayName }))} />
      <Pressable onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginVertical: 24, textAlign: 'center' },
  link: { color: colors.primary, textAlign: 'center', marginTop: 16 },
});
