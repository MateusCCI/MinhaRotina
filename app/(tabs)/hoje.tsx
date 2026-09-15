import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import HojeItemComponent from '../../src/components/HojeItem';
import ProgressBar from '../../src/components/ProgressBar';
import { useHoje } from '../../hooks/useHoje';
import { useInbox } from '../../hooks/useInbox';
import { HojeItem } from '../../src/lib/types';

export default function HojeScreen() {
  const { items, loading, toggleItem, deleteItem, addItemFromInbox, getProgress, fetchItems } = useHoje();
  const { items: inboxItems, fetchItems: fetchInbox } = useInbox();

  const handleToggle = async (id: number): Promise<void> => {
    try {
      await toggleItem(id);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o item.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteItem(id);
    } catch {
      Alert.alert('Erro', 'Não foi possível remover o item.');
    }
  };

  const handleAddFirst = (): void => {
    if (inboxItems.length === 0) {
      Alert.alert('Inbox vazio', 'Adicione tarefas no Inbox primeiro.');
      return;
    }
    addItemFromInbox(inboxItems[0].id).then((result: { success: boolean; message?: string }) => {
      if (!result.success && result.message) {
        Alert.alert('Limite atingido', result.message);
      } else {
        fetchItems();
        fetchInbox();
      }
    });
  };

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MINHA ROTINA</Text>
        <View style={styles.dots}>
          <Text style={styles.dot}>🔴</Text>
          <Text style={styles.dot}>🟡</Text>
          <Text style={styles.dot}>🟢</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <>
          <ScrollView style={styles.progressScroll} contentContainerStyle={styles.progressContent}>
            <ProgressBar percentage={progress.percentage} color={progress.color} />
          </ScrollView>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            <Text style={styles.sectionTitle}>🎯 HOJE</Text>
            {items.map((item: HojeItem) => (
              <HojeItemComponent
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
            {items.length === 0 && (
              <Text style={styles.noItems}>Nenhuma prioridade hoje. Adicione do Inbox!</Text>
            )}
          </ScrollView>
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnAdd, items.length >= 3 && styles.btnDisabled]}
          onPress={handleAddFirst}
          disabled={items.length >= 3}
          accessibilityLabel="Adicionar item do Inbox"
        >
          <Text style={styles.btnAddText}>[+] Novo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnDisabled}
          accessibilityLabel="Saída (em breve)"
        >
          <Text style={styles.btnDisabledText}>[📋 Saída]</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    fontSize: 16,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressScroll: {
    paddingHorizontal: 20,
  },
  progressContent: {
    paddingBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  noItems: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  btnAdd: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnAddText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabledText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
});
