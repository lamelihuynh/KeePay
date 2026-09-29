import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function ErrorText({ message }: { message?: string | null }) {
  return message ? <Text style={styles.error}>{message}</Text> : null;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 8 },
  error: { color: colors.danger, marginVertical: 8 },
});
