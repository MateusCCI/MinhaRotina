import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HojeItemComponent from '../../src/components/HojeItem';
import ProgressBar from '../../src/components/ProgressBar';
import { useHoje } from '../../hooks/useHoje';
import { useInbox } from '../../hooks/useInbox';
import { HojeItem, InboxItem } from '../../src/lib/types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT } from '../../src/lib/date';
import { theme, cardShadow } from '../../src/lib/theme';

export default function HojeScreen() {
  const { items, loading, toggleItem, deleteItem, getProgress, fetchItems } = useHoje();
  const { items: inboxItems, fetchItems: fetchInbox, promoteToHoje } = useInbox();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const handleToggle = async (id: number): Promise<void> => {
    try {
      await toggleItem(id);
    } catch {
      Alert.alert('Ops', 'Não consegui atualizar o item. Tente de novo.');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteItem(id);
    } catch {
      Alert.alert('Ops', 'Não consegui remover o item. Tente de novo.');
    }
  };

  const handlePromote = async (inboxId: number): Promise<void> => {
    setPickerVisible(false);
    try {
      const ok = await promoteToHoje(inboxId);
      if (!ok) {
        Alert.alert('Limite de foco', 'Máximo 3 prioridades. Conclua ou remova uma antes de trazer outra.');
        return;
      }
      await fetchItems();
      await fetchInbox();
    } catch {
      Alert.alert('Ops', 'Não consegui mover o item para o Hoje. Tente de novo.');
    }
  };

  const handleAddPicker = (): void => {
    if (items.length >= 3) {
      Alert.alert('Limite de foco', 'Máximo 3 prioridades. Conclua ou remova uma antes de adicionar.');
      return;
    }
    if (inboxItems.length === 0) {
      Alert.alert('Inbox vazio', 'Despeje uma ideia no Inbox primeiro — depois traga para cá.');
      return;
    }
    setPickerVisible(true);
  };

  const progress = getProgress();
  const visibleItems =
    filterCategory ? items.filter(i => i.category === filterCategory) : items;
  const done = items.filter(i => i.checked).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoje</Text>
        <Text style={styles.subtitle}>
          {items.length === 0
            ? 'Nenhum foco definido — que tal escolher?'
            : `${done} de ${items.length} concluídas. Bom ritmo.`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <ProgressBar percentage={progress.percentage} color={progress.color} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity
              style={[styles.filterChip, filterCategory === null && styles.filterChipActive]}
              onPress={() => setFilterCategory(null)}
            >
              <Text style={[styles.filterChipText, filterCategory === null && styles.filterChipTextActive]}>Todas</Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => {
              const active = filterCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    active && { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] },
                  ]}
                  onPress={() => setFilterCategory(prev => (prev === cat ? null : cat))}
                >
                  <Text style={[styles.filterChipText, active && { color: CATEGORY_TEXT[cat] }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {visibleItems.map((item: HojeItem) => (
            <HojeItemComponent
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
          {visibleItems.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="sunny-outline" size={44} color={theme.colors.textMuted} />
              <Text style={styles.emptyTitle}>Dia em branco, de propósito?</Text>
              <Text style={styles.emptyText}>
                Escolha até 3 prioridades do Inbox. Pouco foco de cada vez rende mais.
              </Text>
              <TouchableOpacity style={styles.emptyCta} onPress={handleAddPicker}>
                <Text style={styles.emptyCtaText}>Escolher do Inbox</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnAdd, items.length >= 3 && styles.btnAddDisabled]}
          onPress={handleAddPicker}
          disabled={items.length >= 3}
          accessibilityLabel="Adicionar item do Inbox"
        >
          <Ionicons
            name="add"
            size={20}
            color={items.length >= 3 ? theme.colors.onDisabled : theme.colors.onPrimary}
          />
          <Text style={[styles.btnAddText, items.length >= 3 && styles.btnAddTextDisabled]}>
            {items.length >= 3 ? 'Foco cheio (3/3)' : 'Trazer do Inbox'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Qual vira prioridade?</Text>
            <Text style={styles.modalSubtitle}>Escolha uma ideia do Inbox para focar hoje.</Text>
            <ScrollView style={styles.modalList}>
              {inboxItems.map((item: InboxItem) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => handlePromote(item.id)}
                  accessibilityLabel={`Priorizar: ${item.content}`}
                >
                  <Text style={styles.modalItemText}>{item.content}</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
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
  filterBar: {
    marginBottom: 16,
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingRight: 8,
  },
  filterChip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.type.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: theme.colors.onPrimary,
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyCta: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  emptyCtaText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  footer: {
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  btnAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  btnAddDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  btnAddText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  btnAddTextDisabled: {
    color: theme.colors.onDisabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  modalTitle: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalSubtitle: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  modalList: {
    maxHeight: 320,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemText: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
  },
  modalCancel: {
    marginTop: 16,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});
