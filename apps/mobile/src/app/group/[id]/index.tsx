import { useLocalSearchParams } from 'expo-router';
import { GroupDetailScreen } from '@/features/group/presentation/screens/GroupDetailScreen';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GroupDetailScreen groupId={id} />;
}
