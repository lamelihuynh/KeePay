import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { container } from '@/core/di/container';
import { useAppSelector } from '@/core/store/hooks';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import { colors } from '@/shared/theme/colors';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useGroupDetail } from '../hooks/useGroupDetail';

export function GroupDetailScreen({ groupId }: { groupId: string }) {
  const router = useRouter();
  const me = useAppSelector((s) => s.auth.user);
  const { detail, balances, expenses, loading, error, reload } = useGroupDetail(groupId);
  const [email, setEmail] = useState('');
  const invite = useAsyncAction();

  const nameOf = (id: string) => detail?.members.find((m) => m.id === id)?.displayName ?? '???';

  const addMember = async () => {
    const ok = await invite.run(async () => {
      await container.group.addMember.execute(groupId, email);
      return true;
    });
    if (ok) {
      setEmail('');
      await reload();
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>{detail?.name ?? 'Đang tải...'}</Text>
      <ErrorText message={error} />

      <Text style={styles.section}>Công nợ</Text>
      {balances && balances.debts.length === 0 && <Text style={styles.muted}>Mọi người đã huề 🎉</Text>}
      {balances?.debts.map((d) => (
        <View key={`${d.fromUserId}-${d.toUserId}`} style={styles.row}>
          <Text style={styles.text}>
            {nameOf(d.fromUserId)} → {nameOf(d.toUserId)}: {formatCurrency(d.amount)}
          </Text>
          {d.fromUserId === me?.id && (
            <Button
              title="Thanh toán"
              variant="secondary"
              onPress={() => router.push(`/group/${groupId}/settle?toUserId=${d.toUserId}&amount=${d.amount}`)}
            />
          )}
        </View>
      ))}

      <Button title="Thêm khoản chi" onPress={() => router.push(`/group/${groupId}/create-expense`)} />

      <Text style={styles.section}>Khoản chi ({expenses.length})</Text>
      {expenses.map((e) => (
        <View key={e.id} style={styles.row}>
          <Text style={styles.text}>{e.description}</Text>
          <Text style={styles.muted}>{nameOf(e.paidById)} trả · {formatCurrency(e.amount)}</Text>
        </View>
      ))}

      <Text style={styles.section}>Thành viên</Text>
      {detail?.members.map((m) => (
        <Text key={m.id} style={styles.text}>• {m.displayName}</Text>
      ))}
      <TextField label="Mời thêm bằng email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <ErrorText message={invite.error} />
      <Button title="Thêm thành viên" variant="secondary" loading={invite.loading || loading} onPress={() => void addMember()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  section: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 16 },
  row: { backgroundColor: colors.card, borderRadius: 10, padding: 12, gap: 8, borderWidth: 1, borderColor: colors.border },
  text: { color: colors.text, fontSize: 15 },
  muted: { color: colors.muted },
});
