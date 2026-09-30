import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../../src/components/ScreenShell';
import StatCard from '../../src/components/StatCard';
import CaptureInput, { CaptureMeta } from '../../src/components/CaptureInput';
import InboxItemComponent from '../../src/components/InboxItem';
import HojeItemComponent from '../../src/components/HojeItem';
import RowActions, { RowAction } from '../../src/components/RowActions';
import ProgressBar from '../../src/components/ProgressBar';
import { useInbox } from '../../hooks/useInbox';
import { useHoje } from '../../hooks/useHoje';
import { InboxItem } from '../../src/lib/types';
import { accents, statusColor, theme, cardShadow } from '../../src/lib/theme';
import { notify } from '../../src/lib/notify';
import { categoryIcon } from '../../src/lib/icons';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT, DUE_OPTIONS } from '../../src/lib/date';

const CLEANUP_LIMIT = 5;
const MAX_FOCUS = 3;

/** A tela é uma, mas as duas zonas têm identidade própria. */
const BRAND = accents.inbox;
const FOCUS = accents.hoje;

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Bom dia';
  if (h >= 12 && h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function greetingIconFor(date: Date): 'partly-sunny' | 'sunny' | 'moon' {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'partly-sunny';
  if (h >= 12 && h < 18) return 'sunny';
  return 'moon';
}

function todayLabel(date: Date): string {
  const s = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface EditState {
  id: number;
  content: string;
  dueKey: string;
  category: string | null;
}

/** Cabeçalho de zona: ícone + nome + contador à direita. */
function ZoneHeader({
  icon,
  title,
  count,
  accent,
}: {
  icon: 'flag' | 'file-tray';
  title: string;
  count: string;
  accent: { base: string; soft: string };
}) {
  return (
    <View style={styles.zoneHead}>
      <View style={[styles.zoneIcon, { backgroundColor: accent.soft }]}>
        <Ionicons name={icon} size={15} color={accent.base} />
      </View>
      <Text style={styles.zoneTitle}>{title}</Text>
      <View style={[styles.zoneCount, { backgroundColor: accent.soft }]}>
        <Text style={[styles.zoneCountText, { color: accent.base }]}>{count}</Text>
      </View>
    </View>
  );
}

export default function HojeScreen() {
  const {
    items: inboxItems,
    loading: inboxLoading,
    isEmpty,
    addItem,
    updateItem,
    deleteItem,
    promoteToHoje,
  } = useInbox();
  const { items: hojeItems, loading: hojeLoading, toggleItem, deleteItem: removeFromHoje, fetchItems: fetchHoje } =
    useHoje();

  const [menuFor, setMenuFor] = useState<InboxItem | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);

  const now = useMemo(() => new Date(), []);
  const loading = inboxLoading || hojeLoading;
  const done = hojeItems.filter(i => i.checked).length;
  const pct = hojeItems.length > 0 ? Math.round((done / hojeItems.length) * 100) : 0;
  const focusFull = hojeItems.length >= MAX_FOCUS;
  const ready = !loading && (inboxItems.length > 0 || hojeItems.length > 0);

  const state =
    hojeItems.length === 0
      ? 'Nenhuma prioridade ainda — escolha uma abaixo'
      : done === hojeItems.length
        ? 'Dia completo. Orgulho seu.'
        : `${done} de ${hojeItems.length} concluídas`;

  // ---- ações -------------------------------------------------------------

  const handleToggle = useCallback(async (id: number) => {
    try {
      await toggleItem(id);
    } catch {
      notify('Ops', 'Não consegui atualizar o item. Tente de novo.');
    }
  }, [toggleItem]);

  const handlePromote = useCallback(async (id: number) => {
    try {
      const moved = await promoteToHoje(id);
      if (!moved) {
        notify('Limite de foco', `Máximo ${MAX_FOCUS} prioridades. Conclua ou remova uma antes de trazer outra.`);
        return;
      }
      await fetchHoje();
    } catch {
      notify('Ops', 'Não consegui mover para o dia. Tente de novo.');
    }
  }, [promoteToHoje, fetchHoje]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteItem(id);
    } catch {
      notify('Ops', 'Não consegui excluir o item. Tente de novo.');
    }
  }, [deleteItem]);

  const handleCapture = useCallback(async (content: string, meta: CaptureMeta) => {
    try {
      await addItem(content, meta.dueDate, meta.category);
    } catch {
      notify('Ops', 'Não consegui guardar a ideia. Tente de novo.');
    }
  }, [addItem]);

  const openEdit = useCallback((item: InboxItem) => {
    const opt = DUE_OPTIONS.find(o => o.value === (item.due_date ?? null));
    setEditing({
      id: item.id,
      content: item.content,
      dueKey: opt ? opt.key : 'none',
      category: item.category ?? null,
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editing || !editing.content.trim()) return;
    try {
      const option = DUE_OPTIONS.find(o => o.key === editing.dueKey);
      await updateItem(editing.id, editing.content.trim(), option?.value ?? null, editing.category);
      setEditing(null);
    } catch {
      notify('Ops', 'Não consegui salvar as alterações. Tente de novo.');
    }
  }, [editing, updateItem]);

  const menuActions: RowAction[] = !menuFor
    ? []
    : [
        {
          key: 'promote',
          label: 'Virar prioridade de hoje',
          description: focusFull
            ? `O foco já está cheio (${MAX_FOCUS}/${MAX_FOCUS}). Conclua ou remova uma antes.`
            : 'Sai do Inbox e entra no topo da tela como tarefa do dia.',
          icon: 'arrow-up-circle',
          onPress: () => handlePromote(menuFor.id),
        },
        {
          key: 'edit',
          label: 'Editar',
          description: 'Muda o texto, o prazo e a categoria.',
          icon: 'create-outline',
          onPress: () => openEdit(menuFor),
        },
        {
          key: 'delete',
          label: 'Excluir',
          description: 'Some do Inbox sem volta.',
          icon: 'trash-outline',
          tone: 'danger',
          onPress: () => handleDelete(menuFor.id),
        },
      ];

  return (
    <ScreenShell
      accent="inbox"
      icon={greetingIconFor(now)}
      label="Hoje"
      headline={greetingFor(now)}
      state={state}
      meta={todayLabel(now)}
      loading={loading}
      stats={
        ready ? (
          <>
            <StatCard icon="flag" value={`${done}/${hojeItems.length}`} label="prioridades" tone={focusFull ? 'positive' : 'default'} />
            <StatCard icon="file-tray" value={String(inboxItems.length)} label="no inbox" />
            <StatCard icon="checkmark-done" value={`${pct}%`} label="concluído" tone={pct >= 100 ? 'positive' : 'default'} />
          </>
        ) : null
      }
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* ZONA 1 — as 3 prioridades do dia, no topo da tela */}
        <View style={styles.zone}>
          <ZoneHeader icon="flag" title="Prioridades de hoje" count={`${hojeItems.length}/${MAX_FOCUS}`} accent={FOCUS} />

          {hojeItems.length === 0 ? (
            <View style={styles.emptyFocus}>
              <View style={[styles.emptyIcon, { backgroundColor: FOCUS.soft }]}>
                <Ionicons name="flag" size={24} color={FOCUS.base} />
              </View>
              <Text style={styles.emptyFocusText}>
                Toque no lápis de uma ideia lá embaixo e escolha “Virar prioridade”.
              </Text>
            </View>
          ) : (
            <>
              {hojeItems.map(item => (
                <HojeItemComponent
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onDelete={removeFromHoje}
                />
              ))}
              <View style={styles.progressCard}>
                <ProgressBar percentage={pct} color={statusColor(pct)} embedded />
              </View>
            </>
          )}
        </View>

        {/* ZONA 2 — captura */}
        <CaptureInput onCapture={handleCapture} />

        {/* ZONA 3 — o Inbox despejado */}
        <View style={styles.zone}>
          <ZoneHeader icon="file-tray" title="Inbox" count={String(inboxItems.length)} accent={BRAND} />

          {inboxItems.length >= CLEANUP_LIMIT && (
            <View style={styles.cleanupBanner}>
              <View style={styles.cleanupIcon}>
                <Ionicons name="sparkles" size={20} color={theme.colors.warning} />
              </View>
              <View style={styles.cleanupBody}>
                <Text style={styles.cleanupTitle}>Que tal uma limpa rápida?</Text>
                <Text style={styles.cleanupText}>
                  São {inboxItems.length} ideias aqui. Promova o que importa para o dia e deixe o resto esperar.
                </Text>
              </View>
            </View>
          )}

          {inboxItems.map(item => (
            <InboxItemComponent key={item.id} item={item} onMenu={setMenuFor} />
          ))}

          {isEmpty && !loading && (
            <View style={styles.emptyInbox}>
              <View style={[styles.emptyIcon, { backgroundColor: BRAND.soft }]}>
                <Ionicons name="sparkles-outline" size={26} color={BRAND.base} />
              </View>
              <Text style={styles.emptyInboxTitle}>Inbox zerado. Respira.</Text>
              <Text style={styles.emptyInboxText}>
                Quando surgir qualquer ideia, despeje no campo acima. Ela espera por você aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <RowActions
        visible={menuFor !== null}
        title={menuFor?.content}
        actions={menuActions}
        onClose={() => setMenuFor(null)}
      />

      <Modal
        visible={editing !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setEditing(null)}
          accessibilityLabel="Fechar edição"
        />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.sheetTitle}>Editar ideia</Text>

          <TextInput
            style={styles.input}
            value={editing?.content ?? ''}
            onChangeText={text => setEditing(prev => (prev ? { ...prev, content: text } : prev))}
            placeholder="O que é essa tarefa?"
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />

          <Text style={styles.sheetLabel}>Quando lembrar?</Text>
          <View style={styles.chips}>
            {DUE_OPTIONS.map(opt => {
              const active = editing?.dueKey === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setEditing(prev => (prev ? { ...prev, dueKey: opt.key } : prev))}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sheetLabel}>É sobre o quê?</Text>
          <View style={styles.chips}>
            {CATEGORIES.map(cat => {
              const active = editing?.category === cat;
              const tint = CATEGORY_COLORS[cat];
              const ink = CATEGORY_TEXT[cat] ?? theme.colors.text;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, { backgroundColor: tint }, active && { borderColor: ink, borderWidth: 2 }]}
                  onPress={() =>
                    setEditing(prev => (prev ? { ...prev, category: prev.category === cat ? null : cat } : prev))
                  }
                >
                  <Ionicons name={categoryIcon(cat)} size={15} color={active ? theme.colors.onPrimary : ink} />
                  <Text style={[styles.chipText, { color: active ? theme.colors.onPrimary : ink }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.cancel} onPress={() => setEditing(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={handleSaveEdit}>
              <Ionicons name="checkmark" size={18} color={theme.colors.onPrimary} />
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 32,
  },
  zone: {
    marginBottom: theme.spacing.lg,
  },
  zoneHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  zoneIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneTitle: {
    flex: 1,
    fontSize: theme.type.callout,
    fontWeight: '800',
    color: theme.colors.text,
  },
  zoneCount: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
  },
  zoneCountText: {
    fontSize: theme.type.caption,
    fontWeight: '800',
  },
  emptyFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
  },
  emptyFocusText: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    lineHeight: 21,
  },
  emptyInbox: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...cardShadow(),
  },
  emptyInboxTitle: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyInboxText: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...cardShadow(1),
  },
  cleanupBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.warningSoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.30)',
    marginBottom: theme.spacing.md,
  },
  cleanupIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cleanupBody: {
    flex: 1,
  },
  cleanupTitle: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  cleanupText: {
    fontSize: theme.type.footnote,
    color: theme.colors.textBody,
    lineHeight: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 32,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sheetTitle: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
  },
  input: {
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
  sheetLabel: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
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
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancel: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: theme.type.callout,
  },
  save: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  saveText: {
    color: theme.colors.onPrimary,
    fontWeight: '700',
    fontSize: theme.type.callout,
  },
});
