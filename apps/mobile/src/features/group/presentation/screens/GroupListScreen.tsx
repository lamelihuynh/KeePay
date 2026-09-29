import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { Button } from '@/shared/components/Button';
import { ErrorText } from '@/shared/components/Screen';
import { colors } from '@/shared/theme/colors';
import { fetchGroups } from '../../store/groupSlice';

export function GroupListScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, status, error } = useAppSelector((s) => s.groups);

  useFocusEffect(
    useCallback(() => {
      void dispatch(fetchGroups());
    }, [dispatch]),
  );

  return (
    <View style={styles.root}>
      <ErrorText message={error} />
      <FlatList
        data={items}
        keyExtractor={(g) => g.id}
        refreshing={status === 'loading'}
        onRefresh={() => void dispatch(fetchGroups())}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có nhóm nào. Hãy tạo nhóm đầu tiên!</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/group/${item.id}`)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.memberIds.length} thành viên</Text>
          </Pressable>
        )}
      />
      <Button title="Tạo nhóm mới" onPress={() => router.push('/group/create')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: colors.background, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  meta: { color: colors.muted, marginTop: 4 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});
