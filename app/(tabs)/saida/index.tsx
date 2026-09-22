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
          <ActivityIndicator size="large" color="#2563EB" />
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
            <Text style={styles.btnConfirmarText}>Confirmar Saída</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemChecked: {
    backgroundColor: '#DBEAFE',
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  itemTextChecked: {
    color: '#2563EB',
    textDecorationLine: 'line-through',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    gap: 8,
  },
  horaAtual: {
    fontSize: 14,
    color: '#6B7280',
  },
  saiuMsg: {
    fontSize: 16,
    color: '#16A34A',
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
    backgroundColor: '#16A34A',
  },
  btnConfirmarDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnConfirmarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
