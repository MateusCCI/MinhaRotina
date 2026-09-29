import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ScreenShell from '../../../src/components/ScreenShell';
import StatCard from '../../../src/components/StatCard';
import { useSaida } from '../../../hooks/useSaida';
import { SaidaItem } from '../../../src/lib/types';
import { accents, theme, cardShadow } from '../../../src/lib/theme';

const SAIDA = accents.saida;

interface Editing {
  /** null = criando; número = editando o item com esse id. */
  id: number | null;
  content: string;
}

export default function SaidaScreen() {
  const { items, loading, allChecked, saidasHoje, toggleItem, registerSaida, addItem, renameItem, removeItem } = useSaida();
  const [saiuAs, setSaiuAs] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const checked = items.filter(i => i.checked).length;

  const handleToggle = (id: number): void => {
    void Haptics.selectionAsync();
    void toggleItem(id);
  };

  const handleConfirmar = async (): Promise<void> => {
    try {
      const hora = await registerSaida();
      setSaiuAs(hora);
      Alert.alert('Boa saída!', `Registrei ${hora}. Até logo.`, [
        { text: 'OK', onPress: () => setSaiuAs(null) },
      ]);
    } catch {
      Alert.alert('Ops', 'Não consegui registrar a saída. Tente de novo.');
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!editing || !editing.content.trim()) return;
    try {
      if (editing.id === null) {
        await addItem(editing.content);
      } else {
        await renameItem(editing.id, editing.content);
      }
      setEditing(null);
    } catch {
      Alert.alert('Ops', 'Não consegui salvar. Tente de novo.');
    }
  };

  const handleDelete = (item: SaidaItem): void => {
    Alert.alert('Excluir item?', `"${item.content}" sai do checklist de vez.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void removeItem(item.id).catch(() =>
            Alert.alert('Ops', 'Não consegui excluir. Tente de novo.')
          );
        },
      },
    ]);
  };

  const state =
    items.length === 0
      ? 'Nada para conferir'
      : allChecked
        ? 'Tudo pronto — pode ir tranquilo'
        : `${checked} de ${items.length} conferidos`;

  return (
    <ScreenShell
      accent="saida"
      icon="exit"
      label="Saída"
      headline="Checklist de saída"
      state={state}
      stats={
        items.length > 0 ? (
          <>
            <StatCard icon="bag-check-outline" value={`${checked}/${items.length}`} label="conferidos" />
            <StatCard icon="time-outline" value={`${saidasHoje.length}`} label="saídas hoje" />
          </>
        ) : null
      }
      loading={loading}
      footer={
        loading ? undefined : (
          <View style={styles.footer}>
            <Text style={styles.horaAtual}>
              {saidasHoje.length > 0
                ? `${saidasHoje.length} ${saidasHoje.length === 1 ? 'saída hoje' : 'saídas hoje'} — última rotina cumprida`
                : 'Nenhuma saída registrada hoje'}
            </Text>
            {saiuAs ? (
              <View style={styles.saiuMsgRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} />
                <Text style={styles.saiuMsg}>Saída das {saiuAs} registrada</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.btnConfirmar, !allChecked && styles.btnConfirmarDisabled]}
                onPress={handleConfirmar}
                disabled={!allChecked}
              >
                <Ionicons
                  name="exit"
                  size={20}
                  color={allChecked ? theme.colors.onPrimary : theme.colors.onDisabled}
                />
                <Text style={[styles.btnConfirmarText, !allChecked && styles.btnConfirmarTextDisabled]}>
                  {allChecked
                    ? 'Confirmar saída'
                    : `Confira ${items.length - checked} ${items.length - checked === 1 ? 'item' : 'itens'} para sair`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      }
    >
      <ScrollView contentContainerStyle={styles.listContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bag-check-outline" size={34} color={SAIDA.base} />
            </View>
            <Text style={styles.emptyTitle}>Checklist vazio</Text>
            <Text style={styles.emptyText}>
              Toque no + para montar seu ritual de saída: chaves, carteira, celular…
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => setEditing({ id: null, content: '' })}
            >
              <Ionicons name="add" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.emptyCtaText}>Adicionar primeiro item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.addRow}
              onPress={() => setEditing({ id: null, content: '' })}
              accessibilityLabel="Adicionar item ao checklist"
            >
              <Ionicons name="add-circle-outline" size={20} color={SAIDA.base} />
              <Text style={styles.addRowText}>Adicionar item</Text>
            </TouchableOpacity>

            {items.map(item => (
              <View key={item.id} style={[styles.item, item.checked && styles.itemChecked]}>
                <TouchableOpacity
                  style={styles.toggleZone}
                  onPress={() => handleToggle(item.id)}
                  accessibilityLabel={`Marcar ${item.content}`}
                  accessibilityRole="checkbox"
                >
                  <View style={[styles.check, item.checked && styles.checkOn]}>
                    {item.checked && <Ionicons name="checkmark" size={18} color={theme.colors.onPrimary} />}
                  </View>
                  <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                    {item.content}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowBtn}
                  onPress={() => setEditing({ id: item.id, content: item.content })}
                  accessibilityLabel={`Editar ${item.content}`}
                >
                  <Ionicons name="pencil-outline" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowBtn}
                  onPress={() => handleDelete(item)}
                  accessibilityLabel={`Excluir ${item.content}`}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </>
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
            <Text style={styles.modalTitle}>
              {editing?.id === null ? 'Novo item de saída' : 'Editar item'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editing?.content ?? ''}
              onChangeText={text => setEditing(prev => (prev ? { ...prev, content: text } : prev))}
              onSubmitEditing={handleSave}
              placeholder="Ex.: chave, ponto, marmita…"
              placeholderTextColor={theme.colors.textMuted}
              returnKeyType="done"
              maxLength={60}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditing(null)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSave}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: SAIDA.soft,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.base,
  },
  emptyCtaText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.soft,
    borderWidth: 1,
    borderColor: 'rgba(190,24,93,0.28)',
  },
  addRowText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: SAIDA.base,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 60,
    paddingVertical: 8,
    paddingLeft: theme.spacing.md,
    paddingRight: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    ...cardShadow(1),
  },
  itemChecked: {
    backgroundColor: theme.colors.successSoft,
  },
  toggleZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  checkOn: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  itemText: {
    flex: 1,
    fontSize: theme.type.body,
    color: theme.colors.textBody,
    fontWeight: '500',
  },
  itemTextChecked: {
    color: theme.colors.success,
    textDecorationLine: 'line-through',
  },
  rowBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
    gap: 10,
  },
  horaAtual: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
  },
  saiuMsgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saiuMsg: {
    fontSize: theme.type.body,
    color: theme.colors.success,
    fontWeight: '700',
  },
  btnConfirmar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    width: '100%',
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.base,
  },
  btnConfirmarDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  btnConfirmarText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
    textAlign: 'center',
  },
  btnConfirmarTextDisabled: {
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
    minHeight: 52,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
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
    backgroundColor: SAIDA.base,
  },
  modalSaveText: {
    color: theme.colors.onPrimary,
    fontWeight: '700',
    fontSize: theme.type.callout,
  },
});
