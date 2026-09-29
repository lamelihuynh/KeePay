import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
}

export function TextField({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} style={[styles.input, style]} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: colors.muted, marginBottom: 4, fontSize: 13 },
  input: {
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 16,
  },
});
