import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import HojeItemComponent from '../../src/components/HojeItem';
import ProgressBar from '../../src/components/ProgressBar';
import { useHoje } from '../../hooks/useHoje';
import { useInbox } from '../../hooks/useInbox';
import { HojeItem, InboxItem } from '../../src/lib/types';

export default function HojeScreen() {
  const { items, loading, toggleItem, deleteItem, getProgress, fetchItems } = useHoje();
  const { items: inboxItems, fetchItems: fetchInbox, promoteToHoje } = useInbox();
  const [pickerVisible, setPickerVisible] = useState(false);

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

  const handlePromote = async (inboxId: number): Promise<void> => {
    setPickerVisible(false);
    try {
      const ok = await promoteToHoje(inboxId);
      if (!ok) {
        Alert.alert('Limite atingido', 'Máximo 3 prioridades. Complete ou remova antes de adicionar.');
        return;
      }
      await fetchItems();
      await fetchInbox();
    } catch {
      Alert.alert('Erro', 'Não foi possível mover o item para o Hoje.');
    }
  };

  const handleAddPicker = (): void => {
    if (items.length >= 3) {
      Alert.alert('Limite atingido', 'Máximo 3 prioridades. Complete ou remova antes de adicionar.');
      return;
    }
    if (inboxItems.length === 0) {
      Alert.alert('Inbox vazio', 'Adicione tarefas no Inbox primeiro.');
      return;
    }
    setPickerVisible(true);
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
          onPress={handleAddPicker}
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

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Escolha do Inbox</Text>
            <Text style={styles.modalSubtitle}>Qual tarefa vira prioridade de hoje?</Text>
            <ScrollView style={styles.modalList}>
              {inboxItems.map((item: InboxItem) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => handlePromote(item.id)}
                  accessibilityLabel={`Promover: ${item.content}`}
                >
                  <Text style={styles.modalItemText}>{item.content}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 320,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 15,
    color: '#1F2937',
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
});
