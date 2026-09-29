import { useRouter } from 'expo-router';
import { useState } from 'react';
import { container } from '@/core/di/container';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';

export function CreateGroupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { loading, error, run } = useAsyncAction();

  const submit = async () => {
    const group = await run(() => container.group.create.execute({ name }));
    if (group) router.replace(`/group/${group.id}`);
  };

  return (
    <Screen>
      <TextField label="Tên nhóm" value={name} onChangeText={setName} placeholder="VD: Đà Lạt 3N2Đ" />
      <ErrorText message={error} />
      <Button title="Tạo nhóm" loading={loading} onPress={() => void submit()} />
    </Screen>
  );
}
