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
import { useSaida } from '../../../hooks/useSaida';
import { theme } from '../../../src/lib/theme';

export default function SaidaScreen() {
  const { items, loading, allChecked, saidasHoje, toggleItem, registerSaida } = useSaida();
  const [saiuAs, setSaiuAs] = useState<string | null>(null);

  const handleConfirmar = async (): Promise<void> => {
    try {
      const hora = await registerSaida();
      setSaiuAs(hora);
      Alert.alert('Saída registrada', `Você saiu às ${hora}`, [
        { text: 'OK', onPress: () => setSaiuAs(null) },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar a saída.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SAÍDA</Text>
        <Text style={styles.subtitle}>
          {allChecked
            ? 'Tudo pronto! ✓'
            : `${items.filter(i => i.checked).length}/${items.length} itens`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.gold} />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                item.checked && styles.itemChecked,
              ]}
              onPress={() => toggleItem(item.id)}
              accessibilityLabel={`Marcar ${item.content}`}
            >
              <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                {item.checked ? '✓' : '○'} {item.content}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Text style={styles.horaAtual}>
          {saidasHoje.length > 0
            ? `Registros hoje: ${saidasHoje.length}`
            : 'Nenhuma saída registrada hoje'}
        </Text>
        {saiuAs ? (
          <Text style={styles.saiuMsg}>Saí às: {saiuAs}</Text>
        ) : (
          <TouchableOpacity
            style={[styles.btnConfirmar, allChecked ? styles.btnConfirmarActive : styles.btnConfirmarDisabled]}
            onPress={handleConfirmar}
            disabled={!allChecked}
          >
            <Text style={[styles.btnConfirmarText, !allChecked && styles.btnConfirmarTextDisabled]}>
              Confirmar Saída
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.gold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
    padding: 20,
    paddingTop: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemChecked: {
    backgroundColor: theme.colors.successSoft,
    borderColor: theme.colors.patina,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  itemTextChecked: {
    color: theme.colors.patinaPale,
    textDecorationLine: 'line-through',
  },
  footer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
    gap: 8,
  },
  horaAtual: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  saiuMsg: {
    fontSize: 16,
    color: theme.colors.patina,
    fontWeight: '600',
  },
  btnConfirmar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  btnConfirmarActive: {
    backgroundColor: theme.colors.gold,
  },
  btnConfirmarDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  btnConfirmarText: {
    color: theme.colors.onGold,
    fontSize: 14,
    fontWeight: '600',
  },
  btnConfirmarTextDisabled: {
    color: theme.colors.onDisabled,
  },
});
