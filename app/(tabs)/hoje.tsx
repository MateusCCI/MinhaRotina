import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HojeItemComponent from '../../src/components/HojeItem';
import ScreenShell from '../../src/components/ScreenShell';
import StatCard from '../../src/components/StatCard';
import ProgressBar from '../../src/components/ProgressBar';
import { useHoje } from '../../hooks/useHoje';
import { useInbox } from '../../hooks/useInbox';
import { HojeItem, InboxItem } from '../../src/lib/types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT } from '../../src/lib/date';
import { accents, theme, cardShadow } from '../../src/lib/theme';
import { categoryIcon } from '../../src/lib/icons';

const HOJE = accents.hoje;

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
  const restantes = items.length - done;

  const state =
    items.length === 0
      ? 'Nenhum foco definido — que tal escolher?'
      : restantes === 0
        ? 'Tudo concluído. Orgulho seu.'
        : `${done} de ${items.length} concluídas. Bom ritmo.`;

  return (
    <ScreenShell
      accent="hoje"
      icon="flag"
      label="Hoje"
      headline="Foco do dia"
      state={state}
      stats={
        items.length > 0 ? (
          <>
            <StatCard icon="flag" value={`${done}/${items.length}`} label="concluídas" />
            <StatCard icon="checkmark-done" value={`${progress.percentage}%`} label="do dia" />
            <StatCard icon="file-tray" value={String(inboxItems.length)} label="no inbox" />
          </>
        ) : null
      }
      loading={loading}
      footer={
        loading ? undefined : (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btnAdd, items.length >= 3 && styles.btnAddDisabled]}
              onPress={handleAddPicker}
              disabled={items.length >= 3}
              accessibilityLabel="Adicionar item do Inbox"
            >
              <Ionicons
                name="file-tray-outline"
                size={20}
                color={items.length >= 3 ? theme.colors.onDisabled : theme.colors.onPrimary}
              />
              <Text style={[styles.btnAddText, items.length >= 3 && styles.btnAddTextDisabled]}>
                {items.length >= 3 ? 'Foco cheio (3/3)' : 'Trazer do Inbox'}
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
    >
      <ScrollView contentContainerStyle={styles.listContent}>
        {items.length > 0 && (
          <View style={styles.progressCard}>
            <ProgressBar percentage={progress.percentage} color={progress.color} embedded />
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            style={[styles.filterChip, filterCategory === null && styles.filterChipActive]}
            onPress={() => setFilterCategory(null)}
          >
            <Ionicons
              name="sparkles"
              size={15}
              color={filterCategory === null ? theme.colors.onPrimary : theme.colors.textSecondary}
            />
            <Text style={[styles.filterChipText, filterCategory === null && styles.filterChipTextActive]}>Todas</Text>
          </TouchableOpacity>
          {CATEGORIES.map(cat => {
            const active = filterCategory === cat;
            const ink = active ? (CATEGORY_TEXT[cat] ?? theme.colors.text) : theme.colors.textSecondary;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  active && { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] },
                ]}
                onPress={() => setFilterCategory(prev => (prev === cat ? null : cat))}
                accessibilityLabel={`Filtrar por ${cat}`}
              >
                <Ionicons name={categoryIcon(cat)} size={15} color={ink} />
                <Text style={[styles.filterChipText, active && { color: ink }]}>{cat}</Text>
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
            <View style={styles.emptyIcon}>
              <Ionicons name="sunny-outline" size={34} color={HOJE.base} />
            </View>
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
                  <View
                    style={[
                      styles.modalItemIcon,
                      { backgroundColor: item.category ? CATEGORY_COLORS[item.category] : HOJE.soft },
                    ]}
                  >
                    <Ionicons
                      name={categoryIcon(item.category)}
                      size={16}
                      color={item.category ? CATEGORY_TEXT[item.category] : HOJE.base}
                    />
                  </View>
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 24,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...cardShadow(),
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: HOJE.base,
    borderColor: HOJE.base,
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
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: HOJE.soft,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: theme.radius.md,
    backgroundColor: HOJE.base,
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
    backgroundColor: HOJE.base,
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
    gap: 10,
    minHeight: 56,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
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
