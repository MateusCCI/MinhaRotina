import React, { useState, useEffect } from 'react';
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
import * as Haptics from 'expo-haptics';
import ScreenShell from '../../../src/components/ScreenShell';
import StatCard from '../../../src/components/StatCard';
import EditarChecklist from '../../../src/components/EditarChecklist';
import { useSaida } from '../../../hooks/useSaida';
import { SaidaItem } from '../../../src/lib/types';
import { accents, theme, cardShadow } from '../../../src/lib/theme';
import { confirmDestructive, notify } from '../../../src/lib/notify';
import { agendarAlarme, cancelarAlarme, horarioAlarme, unsupportedPlatform } from '../../../src/lib/alarme';
import DatabaseSingleton from '../../../src/lib/database';

const SAIDA = accents.saida;

interface Editing {
  /** null = criando; número = editando o item com esse id. */
  id: number | null;
  content: string;
}

/** Meia hora à frente, arredondada — padrão sensato para "quando saio?". */
function nextHalfHour(): string {
  const d = new Date(Date.now() + 30 * 60 * 1000);
  d.setMinutes(d.getMinutes() > 30 ? 60 : 30, 0, 0);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function SaidaScreen() {
  const { items, loading, allChecked, saidasHoje, toggleItem, registerSaida, addItem, renameItem, removeItem } = useSaida();
  const [saiuAs, setSaiuAs] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [alarme, setAlarme] = useState<string | null>(null);
  const [showAlarme, setShowAlarme] = useState(false);
  const [editandoLista, setEditandoLista] = useState(false);
  const checked = items.filter(i => i.checked).length;

  useEffect(() => {
    DatabaseSingleton.getInstance()
      .then(db => db.getAlarmeSaida())
      .then(setAlarme)
      .catch(() => setAlarme(null));
  }, []);

  /** Agenda (ou cancela) o lembrete 15 min antes da saída escolhida. */
  const aplicarAlarme = async (hora: string | null): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      if (hora === null) {
        await cancelarAlarme();
        await db.setAlarmeSaida(null);
        setAlarme(null);
        return;
      }
      const total = await db.countPendenciasSaida();
      const feito = await agendarAlarme(hora, total);
      await db.setAlarmeSaida(feito ? hora : hora);
      setAlarme(hora);
    } catch {
      notify('Ops', 'Não consegui agendar o lembrete. Tente de novo.');
    }
  };

  const handleAlarmeChange = (delta: number): void => {
    const [h, m] = (alarme ?? nextHalfHour()).split(':').map(Number);
    const total = ((h * 60 + m + delta) % 1440 + 1440) % 1440;
    const nova = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    setAlarme(nova);
    void aplicarAlarme(nova);
  };

  const handleToggle = (id: number): void => {
    void Haptics.selectionAsync();
    void toggleItem(id);
  };

  const handleConfirmar = async (): Promise<void> => {
    try {
      const hora = await registerSaida();
      setSaiuAs(hora);
      setSaiuAs(null);
      notify('Boa saída!', `Registrei ${hora}. Até logo.`);
    } catch {
      notify('Ops', 'Não consegui registrar a saída. Tente de novo.');
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
      notify('Ops', 'Não consegui salvar. Tente de novo.');
    }
  };

  const handleDelete = (item: SaidaItem): void => {
    confirmDestructive(
      'Excluir item?',
      `"${item.content}" sai do checklist de vez.`,
      'Excluir',
      () => {
        void removeItem(item.id).catch(() => notify('Ops', 'Não consegui excluir. Tente de novo.'));
      },
    );
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
        {/* Alarme de saída: 15 min antes, no canal de notificações do sistema */}
        <View style={styles.alarmCard}>
          <View style={styles.alarmHead}>
            <View style={styles.alarmIcon}>
              <Ionicons name={alarme ? 'alarm' : 'alarm-outline'} size={20} color={SAIDA.base} />
            </View>
            <View style={styles.alarmBody}>
              <Text style={styles.alarmTitle}>{alarme ? `Saída às ${alarme}` : 'Lembrete de saída'}</Text>
              <Text style={styles.alarmSub}>
                {alarme
                  ? `O celular avisa às ${horarioAlarme(alarme)} — 15 min antes.`
                  : unsupportedPlatform()
                    ? 'Avise 15 min antes de sair para não esquecer nada.'
                    : 'Receba um aviso 15 minutos antes, sem apitar no meio do dia.'}
              </Text>
            </View>
          </View>

          {!showAlarme ? (
            <TouchableOpacity style={styles.alarmBtn} onPress={() => setShowAlarme(true)}>
              <Ionicons name="add" size={18} color={theme.colors.onPrimary} />
              <Text style={styles.alarmBtnText}>{alarme ? 'Mudar horário' : 'Programar lembrete'}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.alarmPicker}>
              <TouchableOpacity
                style={styles.alarmStep}
                onPress={() => handleAlarmeChange(-15)}
                accessibilityLabel="15 minutos antes"
              >
                <Ionicons name="chevron-back" size={18} color={SAIDA.base} />
              </TouchableOpacity>
              <View style={styles.alarmValue}>
                <Text style={styles.alarmValueText}>{alarme ?? nextHalfHour()}</Text>
                <Text style={styles.alarmValueLabel}>avisa {horarioAlarme(alarme ?? nextHalfHour())}</Text>
              </View>
              <TouchableOpacity
                style={styles.alarmStep}
                onPress={() => handleAlarmeChange(15)}
                accessibilityLabel="15 minutos depois"
              >
                <Ionicons name="chevron-forward" size={18} color={SAIDA.base} />
              </TouchableOpacity>
            </View>
          )}

          {alarme && (
            <TouchableOpacity
              style={styles.alarmOff}
              onPress={() => {
                setShowAlarme(false);
                void aplicarAlarme(null);
              }}
            >
              <Ionicons name="close-circle-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.alarmOffText}>Desligar lembrete</Text>
            </TouchableOpacity>
          )}

          {unsupportedPlatform() && alarme && (
            <Text style={styles.alarmWarn}>
              O horário fica salvo neste aparelho. Para receber o aviso do sistema, abra o app
              no celular.
            </Text>
          )}
        </View>

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
            <View style={styles.manageRow}>
              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => setEditing({ id: null, content: '' })}
                accessibilityLabel="Adicionar item ao checklist"
              >
                <Ionicons name="add-circle-outline" size={19} color={SAIDA.base} />
                <Text style={styles.manageText}>Adicionar</Text>
              </TouchableOpacity>
              {/* O único lápis da tela: abre a folha onde TODOS os itens são
                  editados de uma vez. */}
              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => setEditandoLista(true)}
                accessibilityLabel="Editar todos os itens do checklist"
              >
                <Ionicons name="pencil-outline" size={19} color={SAIDA.base} />
                <Text style={styles.manageText}>Editar tudo</Text>
              </TouchableOpacity>
            </View>

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
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <EditarChecklist
        visible={editandoLista}
        items={items}
        onRename={renameItem}
        onDelete={handleDelete}
        onAdd={() => {
          setEditandoLista(false);
          setEditing({ id: null, content: '' });
        }}
        onClose={() => setEditandoLista(false)}
      />

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
  alarmCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(190,24,93,0.26)',
    marginBottom: theme.spacing.lg,
  },
  alarmHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  alarmIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: SAIDA.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmBody: {
    flex: 1,
  },
  alarmTitle: {
    fontSize: theme.type.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  alarmSub: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
  alarmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.base,
  },
  alarmBtnText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  alarmPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alarmStep: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.soft,
  },
  alarmValue: {
    flex: 1,
    alignItems: 'center',
  },
  alarmValueText: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  alarmValueLabel: {
    fontSize: theme.type.caption,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  alarmOff: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    marginTop: theme.spacing.sm,
  },
  alarmOffText: {
    fontSize: theme.type.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  alarmWarn: {
    fontSize: theme.type.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    lineHeight: 16,
    textAlign: 'center',
  },
  manageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  manageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: theme.radius.md,
    backgroundColor: SAIDA.soft,
    borderWidth: 1,
    borderColor: 'rgba(190,24,93,0.28)',
  },
  manageText: {
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
    paddingHorizontal: theme.spacing.md,
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
