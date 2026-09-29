import { useLocalSearchParams } from 'expo-router';
import { CreateExpenseScreen } from '@/features/expense/presentation/screens/CreateExpenseScreen';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CreateExpenseScreen groupId={id} />;
}
