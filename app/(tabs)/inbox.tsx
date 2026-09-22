import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import CaptureInput from '../../src/components/CaptureInput';
import InboxItemComponent from '../../src/components/InboxItem';
import { useInbox } from '../../hooks/useInbox';
import { InboxItem } from '../../src/lib/types';

export default function InboxScreen() {
  const { items, loading, isEmpty, addItem, deleteItem, promoteToHoje } = useInbox();

  const handlePromote = async (id: number): Promise<void> => {
    try {
      const moved = await promoteToHoje(id);
      if (!moved) {
        Alert.alert('Limite atingido', 'Máximo 3 prioridades no Hoje. Completa ou remove antes de promover.');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível mover para o Hoje.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteItem(id);
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o item.');
    }
  };

  const handleCapture = async (content: string): Promise<void> => {
    try {
      await addItem(content);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o item.');
    }
  };

  const handleEmptyState = (): void => {
    Alert.alert(
      'Inbox zerado!',
      'Nenhuma tarefa no inbox. Adicione uma nova ideia acima.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MINHA ROTINA</Text>
        <Text style={styles.subtitle}>Inbox ({items.length})</Text>
      </View>

      <CaptureInput onCapture={handleCapture} />

      {isEmpty && !loading && (
        <TouchableOpacity style={styles.emptyState} onPress={handleEmptyState}>
          <Text style={styles.emptyText}>Inbox zerado! Toque para notificação.</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <Text style={styles.sectionTitle}>📥 INBOX</Text>
          {items.map((item: InboxItem) => (
            <InboxItemComponent
              key={item.id}
              item={item}
              onPromote={handlePromote}
              onDelete={handleDelete}
            />
          ))}
          {items.length === 0 && !isEmpty && (
            <Text style={styles.noItems}>Nenhuma tarefa no inbox.</Text>
          )}
        </ScrollView>
      )}
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
  emptyState: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
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
});
