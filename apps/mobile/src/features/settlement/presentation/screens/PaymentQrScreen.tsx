import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { container } from '@/core/di/container';
import { useAppSelector } from '@/core/store/hooks';
import { Button } from '@/shared/components/Button';
import { ErrorText, Screen } from '@/shared/components/Screen';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { VietQRViewer } from '@/shared/vietqr/VietQRViewer';
import type { PaymentQr } from '../../domain/entities/PaymentQr';

interface Props {
  groupId: string;
  toUserId: string;
  amount: number;
}

export function PaymentQrScreen({ groupId, toUserId, amount }: Props) {
  const router = useRouter();
  const me = useAppSelector((s) => s.auth.user);
  const [qr, setQr] = useState<PaymentQr | null>(null);
  const load = useAsyncAction();
  const confirm = useAsyncAction();

  useEffect(() => {
    void load.run(async () => setQr(await container.settlement.paymentQr.execute(groupId, { toUserId, amount })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, toUserId, amount]);

  const markPaid = async () => {
    if (!me) return;
    const ok = await confirm.run(async () => {
      await container.settlement.record.execute(groupId, { fromUserId: me.id, toUserId, amount });
      return true;
    });
    if (ok) router.replace(`/group/${groupId}`);
  };

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: '700', textAlign: 'center' }}>{formatCurrency(amount)}</Text>
      <ErrorText message={load.error ?? confirm.error} />
      {qr && (
        <>
          <VietQRViewer value={qr.payload} />
          <Text style={{ textAlign: 'center' }}>Người nhận: {qr.recipient.accountHolder}</Text>
          <Text style={{ textAlign: 'center', opacity: 0.6 }}>Mở app ngân hàng và quét mã VietQR này</Text>
          <Button title="Tôi đã chuyển tiền" loading={confirm.loading} onPress={() => void markPaid()} />
        </>
      )}
    </Screen>
  );
}
