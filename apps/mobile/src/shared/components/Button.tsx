import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, loading, disabled, variant = 'primary' }: Props) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, secondary ? styles.secondary : styles.primary, (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, secondary && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
