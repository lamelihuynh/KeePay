import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { container } from '@/core/di/container';
import { useAppSelector } from '@/core/store/hooks';
import type { GroupDetail } from '@/features/group/domain/entities/Group';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import { MemberChips } from '../components/MemberChips';

export function CreateExpenseScreen({ groupId }: { groupId: string }) {
  const router = useRouter();
  const me = useAppSelector((s) => s.auth.user);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [description, setDescription] = useState('');
  const [amountText, setAmountText] = useState('');
  const [paidById, setPaidById] = useState(me?.id ?? '');
  const [participants, setParticipants] = useState<string[]>([]);
  const load = useAsyncAction();
  const save = useAsyncAction();

  useEffect(() => {
    void load.run(async () => {
      const g = await container.group.detail.execute(groupId);
      setGroup(g);
      setParticipants(g.memberIds);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const toggle = (id: string) =>
    setParticipants((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async () => {
    const created = await save.run(() =>
      container.expense.create.execute({
        groupId,
        description,
        amount: Number(amountText.replace(/\D/g, '')),
        paidById,
        split: { type: 'equal', userIds: participants },
      }),
    );
    if (created) router.back();
  };

  return (
    <Screen>
      <TextField label="Nội dung" value={description} onChangeText={setDescription} placeholder="VD: Ăn tối" />
      <TextField label="Số tiền (₫)" value={amountText} onChangeText={setAmountText} keyboardType="number-pad" placeholder="150000" />
      <Text>Ai trả tiền?</Text>
      <MemberChips members={group?.members ?? []} selectedIds={[paidById]} onToggle={setPaidById} />
      <Text>Chia đều cho</Text>
      <MemberChips members={group?.members ?? []} selectedIds={participants} onToggle={toggle} />
      <ErrorText message={load.error ?? save.error} />
      <Button title="Lưu khoản chi" loading={save.loading} onPress={() => void submit()} />
    </Screen>
  );
}
