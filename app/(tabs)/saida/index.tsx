import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSaida } from '../../../hooks/useSaida';
import { theme, cardShadow } from '../../../src/lib/theme';

export default function SaidaScreen() {
  const { items, loading, allChecked, saidasHoje, toggleItem, registerSaida } = useSaida();
  const [saiuAs, setSaiuAs] = useState<string | null>(null);
  const checked = items.filter(i => i.checked).length;

  const handleToggle = (id: number): void => {
    void Haptics.selectionAsync();
    void toggleItem(id);
  };

  const handleConfirmar = async (): Promise<void> => {
    try {
      const hora = await registerSaida();
      setSaiuAs(hora);
      Alert.alert('Boa saída!', `Registrei ${hora}. Até logo.`, [
        { text: 'OK', onPress: () => setSaiuAs(null) },
      ]);
    } catch {
      Alert.alert('Ops', 'Não consegui registrar a saída. Tente de novo.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saída</Text>
        <Text style={styles.subtitle}>
          {items.length === 0
            ? 'Nada para conferir'
            : allChecked
              ? 'Tudo pronto — pode ir tranquilo'
              : `${checked} de ${items.length} conferidos`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bag-check-outline" size={44} color={theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum item de saída</Text>
              <Text style={styles.emptyText}>
                Seu checklist de saída (chaves, carteira, celular…) aparece aqui quando for cadastrado.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.item, item.checked && styles.itemChecked]}
                onPress={() => handleToggle(item.id)}
                accessibilityLabel={`Marcar ${item.content}`}
                accessibilityRole="checkbox"
              >
                <View style={[styles.check, item.checked && styles.checkOn]}>
                  {item.checked && <Ionicons name="checkmark" size={18} color={theme.colors.onPrimary} />}
                </View>
                <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                  {item.content}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Text style={styles.horaAtual}>
          {saidasHoje.length > 0
            ? `${saidasHoje.length} ${saidasHoje.length === 1 ? 'saída hoje' : 'saídas hoje'} — última rotina cumprida`
            : 'Nenhuma saída registrada hoje'}
        </Text>
        {saiuAs ? (
          <Text style={styles.saiuMsg}>Saída das {saiuAs} registrada</Text>
        ) : (
          <TouchableOpacity
            style={[styles.btnConfirmar, !allChecked && styles.btnConfirmarDisabled]}
            onPress={handleConfirmar}
            disabled={!allChecked}
          >
            <Text style={[styles.btnConfirmarText, !allChecked && styles.btnConfirmarTextDisabled]}>
              {allChecked ? 'Confirmar saída' : `Confira ${items.length - checked} ${items.length - checked === 1 ? 'item' : 'itens'} para sair`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.type.largeTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
  },
  emptyState: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    ...cardShadow(),
  },
  emptyTitle: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    ...cardShadow(1),
  },
  itemChecked: {
    backgroundColor: theme.colors.successSoft,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  checkOn: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  itemText: {
    flex: 1,
    fontSize: theme.type.body,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  itemTextChecked: {
    color: theme.colors.success,
    textDecorationLine: 'line-through',
  },
  footer: {
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
    gap: 10,
  },
  horaAtual: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
  },
  saiuMsg: {
    fontSize: theme.type.body,
    color: theme.colors.success,
    fontWeight: '700',
  },
  btnConfirmar: {
    minHeight: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  btnConfirmarDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  btnConfirmarText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
    textAlign: 'center',
  },
  btnConfirmarTextDisabled: {
    color: theme.colors.onDisabled,
  },
});
