import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

interface Props {
  members: { id: string; displayName: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function MemberChips({ members, selectedIds, onToggle }: Props) {
  return (
    <View style={styles.wrap}>
      {members.map((m) => {
        const on = selectedIds.includes(m.id);
        return (
          <Pressable key={m.id} onPress={() => onToggle(m.id)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.text, on && styles.textOn]}>{m.displayName}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.text },
  textOn: { color: '#fff' },
});
