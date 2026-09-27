import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CaptureInput, { CaptureMeta } from '../../src/components/CaptureInput';
import InboxItemComponent from '../../src/components/InboxItem';
import { useInbox } from '../../hooks/useInbox';
import { InboxItem } from '../../src/lib/types';
import { theme, cardShadow } from '../../src/lib/theme';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT, DUE_OPTIONS } from '../../src/lib/date';

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
        Alert.alert('Limite de foco', 'Você já tem 3 prioridades no Hoje. Conclua ou remova uma antes de trazer outra.');
      }
    } catch {
      Alert.alert('Ops', 'Não consegui mover para o Hoje. Tente de novo.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteItem(id);
    } catch {
      Alert.alert('Ops', 'Não consegui excluir o item. Tente de novo.');
    }
  };

  const handleCapture = async (content: string, meta: CaptureMeta): Promise<void> => {
    try {
      await addItem(content, meta.dueDate, meta.category);
    } catch {
      Alert.alert('Limite de foco', 'Você já tem 3 itens no Hoje. Conclua ou remova antes de adicionar novos.');
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
      Alert.alert('Ops', 'Não consegui salvar as alterações. Tente de novo.');
    }
  };

  const needsCleanup = items.length >= CLEANUP_LIMIT;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.subtitle}>
          {items.length === 0
            ? 'Tudo despejado, mente leve'
            : `${items.length} ${items.length === 1 ? 'ideia esperando' : 'ideias esperando'} por você`}
        </Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} keyboardShouldPersistTaps="handled">
        <CaptureInput onCapture={handleCapture} />

        {needsCleanup && (
          <View style={styles.cleanupBanner}>
            <Ionicons name="sparkles-outline" size={22} color={theme.colors.primary} />
            <View style={styles.cleanupBody}>
              <Text style={styles.cleanupTitle}>Que tal uma limpa rápida?</Text>
              <Text style={styles.cleanupText}>
                Você tem {items.length} itens aqui. Transforme o que importa em prioridade,
                edite ou descarte o resto — leva um minutinho.
              </Text>
            </View>
          </View>
        )}

        {isEmpty && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={44} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>Inbox zerado. Respira.</Text>
            <Text style={styles.emptyText}>
              Quando surgir qualquer ideia, despeje no campo acima. Ela vai esperar por você aqui.
            </Text>
          </View>
        ) : (
          !loading && (
            <View style={styles.list}>
              {items.map((item: InboxItem) => (
                <InboxItemComponent
                  key={item.id}
                  item={item}
                  onPromote={handlePromote}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          )
        )}

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </ScrollView>

      <Modal
        visible={editing !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar ideia</Text>

            <TextInput
              style={styles.modalInput}
              value={editing?.content ?? ''}
              onChangeText={text => setEditing(prev => (prev ? { ...prev, content: text } : prev))}
              placeholder="O que é essa tarefa?"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />

            <Text style={styles.modalLabel}>Quando lembrar?</Text>
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

            <Text style={styles.modalLabel}>É sobre o quê?</Text>
            <View style={styles.chips}>
              {CATEGORIES.map(cat => {
                const active = editing?.category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      active && { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] },
                    ]}
                    onPress={() =>
                      setEditing(prev =>
                        prev ? { ...prev, category: prev.category === cat ? null : cat } : prev
                      )
                    }
                  >
                    <Text style={[styles.chipText, active && { color: CATEGORY_TEXT[cat] }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 32,
  },
  cleanupBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.warningSoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    marginBottom: theme.spacing.md,
  },
  cleanupBody: {
    flex: 1,
  },
  cleanupTitle: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  cleanupText: {
    fontSize: theme.type.footnote,
    color: theme.colors.textBody,
    lineHeight: 20,
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
  list: {
    paddingBottom: 8,
  },
  loader: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28,25,23,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    fontSize: theme.type.body,
    color: theme.colors.text,
    minHeight: 64,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: theme.type.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.onPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  modalCancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: theme.type.callout,
  },
  modalSave: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 28,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  modalSaveText: {
    color: theme.colors.onPrimary,
    fontWeight: '700',
    fontSize: theme.type.callout,
  },
});
