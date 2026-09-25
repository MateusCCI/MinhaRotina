import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import CaptureInput, { CaptureMeta } from '../../src/components/CaptureInput';
import InboxItemComponent from '../../src/components/InboxItem';
import { useInbox } from '../../hooks/useInbox';
import { InboxItem } from '../../src/lib/types';
import { theme } from '../../src/lib/theme';
import { CATEGORIES, CATEGORY_COLORS, DUE_OPTIONS } from '../../src/lib/date';

const CLEANUP_LIMIT = 5;

interface EditState {
  id: number;
  content: string;
  dueKey: string;
  category: string | null;
}

export default function InboxScreen() {
  const { items, loading, isEmpty, addItem, updateItem, deleteItem, promoteToHoje } = useInbox();
  const [editing, setEditing] = useState<EditState | null>(null);

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

  const handleCapture = async (content: string, meta: CaptureMeta): Promise<void> => {
    try {
      await addItem(content, meta.dueDate, meta.category);
    } catch {
      Alert.alert('Limite atingido', 'Você já tem 3 itens no Hoje. Conclua ou remova antes de adicionar novos.');
    }
  };

  const openEdit = (item: InboxItem): void => {
    const opt = DUE_OPTIONS.find(o => o.value === (item.due_date ?? null));
    setEditing({
      id: item.id,
      content: item.content,
      dueKey: opt ? opt.key : 'none',
      category: item.category ?? null,
    });
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editing || !editing.content.trim()) return;
    try {
      const option = DUE_OPTIONS.find(o => o.key === editing.dueKey);
      await updateItem(editing.id, editing.content.trim(), option?.value ?? null, editing.category);
      setEditing(null);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const handleEmptyState = (): void => {
    Alert.alert(
      'Inbox zerado!',
      'Nenhuma tarefa no inbox. Adicione uma nova ideia acima.',
      [{ text: 'OK' }]
    );
  };

  const needsCleanup = items.length >= CLEANUP_LIMIT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MINHA ROTINA</Text>
        <Text style={styles.subtitle}>Inbox ({items.length})</Text>
      </View>

      <View style={styles.body}>
        <CaptureInput onCapture={handleCapture} />

        {needsCleanup && (
          <View style={styles.cleanupBanner}>
            <Text style={styles.cleanupTitle}>🧹 Hora de limpar o Inbox</Text>
            <Text style={styles.cleanupText}>
              Você tem {items.length} itens despejados. Reserve um momento para editar, classificar
              ou promover o que importa — o resto pode sair.
            </Text>
          </View>
        )}

        {isEmpty && !loading && (
          <TouchableOpacity style={styles.emptyState} onPress={handleEmptyState}>
            <Text style={styles.emptyText}>Inbox zerado! Toque para notificação.</Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.gold} />
          </View>
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            <Text style={styles.sectionTitle}>📥 INBOX</Text>
            {items.map((item: InboxItem) => (
              <InboxItemComponent
                key={item.id}
                item={item}
                onPromote={handlePromote}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
            {items.length === 0 && !isEmpty && (
              <Text style={styles.noItems}>Nenhuma tarefa no inbox.</Text>
            )}
          </ScrollView>
        )}
      </View>

      <Modal
        visible={editing !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar item</Text>

            <TextInput
              style={styles.modalInput}
              value={editing?.content ?? ''}
              onChangeText={text => setEditing(prev => (prev ? { ...prev, content: text } : prev))}
              placeholder="Conteúdo da tarefa"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />

            <Text style={styles.modalLabel}>Prazo</Text>
            <View style={styles.chips}>
              {DUE_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.chip, editing?.dueKey === opt.key && styles.chipActive]}
                  onPress={() => setEditing(prev => (prev ? { ...prev, dueKey: opt.key } : prev))}
                >
                  <Text style={[styles.chipText, editing?.dueKey === opt.key && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Categoria</Text>
            <View style={styles.chips}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    editing?.category === cat && { backgroundColor: CATEGORY_COLORS[cat] },
                  ]}
                  onPress={() =>
                    setEditing(prev =>
                      prev ? { ...prev, category: prev.category === cat ? null : cat } : prev
                    )
                  }
                >
                  <Text style={[styles.chipText, editing?.category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditing(null)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flex: 1,
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
  cleanupBanner: {
    padding: 16,
    backgroundColor: theme.colors.warningSoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    marginBottom: 16,
  },
  cleanupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.warning,
    marginBottom: 4,
  },
  cleanupText: {
    fontSize: 13,
    color: theme.colors.textBody,
    lineHeight: 19,
  },
  emptyState: {
    padding: 16,
    backgroundColor: theme.colors.goldSoft,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.gold,
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
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  noItems: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: 16,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    fontSize: 15,
    color: theme.colors.text,
    minHeight: 64,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.gold,
    borderColor: theme.colors.gold,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.onGold,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
  },
  modalCancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  modalSave: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.gold,
  },
  modalSaveText: {
    color: theme.colors.onGold,
    fontWeight: '700',
  },
});