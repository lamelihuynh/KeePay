import { useLocalSearchParams } from 'expo-router';
import { PaymentQrScreen } from '@/features/settlement/presentation/screens/PaymentQrScreen';

export default function Route() {
  const { id, toUserId, amount } = useLocalSearchParams<{ id: string; toUserId: string; amount: string }>();
  return <PaymentQrScreen groupId={id} toUserId={toUserId} amount={Number(amount)} />;
}
