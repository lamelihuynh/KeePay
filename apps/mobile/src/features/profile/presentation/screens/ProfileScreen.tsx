import { BANK_BINS } from '@keepay/shared';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { container } from '@/core/di/container';
import { useAppDispatch } from '@/core/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { MemberChips } from '@/features/expense/presentation/components/MemberChips';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { TextField } from '@/shared/components/TextField';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';

const bankOptions = Object.values(BANK_BINS).map((b) => ({ id: b.bin, displayName: b.name }));

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [bankBin, setBankBin] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [saved, setSaved] = useState(false);
  const load = useAsyncAction();
  const save = useAsyncAction();

  useEffect(() => {
    void load.run(async () => {
      const p = await container.profile.get.execute();
      setName(p.displayName);
      if (p.bankAccount) {
        setBankBin(p.bankAccount.bankBin);
        setAccountNumber(p.bankAccount.accountNumber);
        setAccountHolder(p.bankAccount.accountHolder);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    setSaved(false);
    const ok = await save.run(async () => {
      await container.profile.saveBankAccount.execute({ bankBin, accountNumber, accountHolder });
      return true;
    });
    if (ok) setSaved(true);
  };

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{name}</Text>
      <Text style={{ marginTop: 16, fontWeight: '600' }}>Tài khoản nhận tiền (để tạo VietQR)</Text>
      <MemberChips members={bankOptions} selectedIds={[bankBin]} onToggle={setBankBin} />
      <TextField label="Số tài khoản" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" />
      <TextField label="Tên chủ tài khoản" value={accountHolder} onChangeText={setAccountHolder} autoCapitalize="characters" />
      <ErrorText message={load.error ?? save.error} />
      {saved && <Text>Đã lưu ✔</Text>}
      <Button title="Lưu tài khoản ngân hàng" loading={save.loading} onPress={() => void submit()} />
      <Button title="Đăng xuất" variant="secondary" onPress={() => void dispatch(logout())} />
    </Screen>
  );
}
