import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimer, formatMs } from '../../../hooks/useTimer';
import ScreenShell from '../../../src/components/ScreenShell';
import ProgressBar from '../../../src/components/ProgressBar';
import StatCard from '../../../src/components/StatCard';
import BlocoConcluido from '../../../src/components/BlocoConcluido';
import ConfigurarBloco, { DURACAO_PADRAO_MIN } from '../../../src/components/ConfigurarBloco';
import { useHoje } from '../../../hooks/useHoje';
import { accents, statusColor, theme, cardShadow } from '../../../src/lib/theme';
import { notify } from '../../../src/lib/notify';
import DatabaseSingleton from '../../../src/lib/database';

const CHAVE_DURACAO = 'timer.duracaoMin';
const TIMER = accents.timer;

export default function TimerScreen() {
  // O Timer precisa saber o que está em aberto para oferecer o próximo passo
  // no fim do bloco (RF07). Só lê; quem escreve é a aba Hoje.
  const { items: hojeItems, toggleItem } = useHoje();

  const [blocoAberto, setBlocoAberto] = useState(false);
  const [configAberta, setConfigAberta] = useState(false);
  /**
   * A duração mora no banco (`meta`), não no estado: é uma preferência que
   * precisa sobreviver ao fechamento do app. O 25 é o valor canônico do
   * método e também o fallback se o banco falhar.
   */
  const [duracaoMin, setDuracaoMin] = useState(DURACAO_PADRAO_MIN);

  useEffect(() => {
    let cancelado = false;
    DatabaseSingleton.getInstance()
      .then(db => db.getMeta(CHAVE_DURACAO))
      .then(valor => {
        if (cancelado || !valor) return;
        const min = Number(valor);
        if (Number.isFinite(min) && min > 0) setDuracaoMin(min);
      })
      .catch(error => console.error('Erro ao ler duração do bloco:', error));
    return () => {
      cancelado = true;
    };
  }, []);

  /** RF07: o aviso só acontece no fim do bloco, e uma vez só. */
  const handleComplete = useCallback(() => {
    setBlocoAberto(true);
  }, []);

  const timer = useTimer({
    prefix: 'pomodoro',
    totalMs: duracaoMin * 60 * 1000,
    onComplete: handleComplete,
  });

  const handleEscolherDuracao = useCallback(
    (min: number) => {
      setConfigAberta(false);
      setDuracaoMin(min);
      void timer.setTotalMs(min * 60 * 1000);
      DatabaseSingleton.getInstance()
        .then(db => db.setMeta(CHAVE_DURACAO, String(min)))
        .catch(error => {
          console.error('Erro ao salvar duração do bloco:', error);
          notify('Ops', 'A duração vale só nesta sessão.');
        });
    },
    [timer]
  );

  // O progresso precisa usar a duração em uso, não a de quando a tela
  // montou — senão a barra mentia depois de trocar a preferência.
  const progress =
    timer.totalMs > 0 ? ((timer.totalMs - timer.remaining) / timer.totalMs) * 100 : 0;
  const progressColor = statusColor(progress);
  const pct = Math.round(progress);

  /**
   * Horário de término: o relógio grande já diz quanto falta, então repetir
   * "restante" num card ao lado é ruído. Isto responde a pergunta diferente
   * — "a que horas eu saio daqui?" — que é a que planeja o resto do dia.
   */
  const fimDoBloco = new Date(Date.now() + timer.remaining).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const done = hojeItems.filter(i => i.checked).length;
  const dayPct = hojeItems.length > 0 ? Math.round((done / hojeItems.length) * 100) : 0;
  const proximas = hojeItems.filter(i => !i.checked);

  const handleEscolher = useCallback(
    (id: number) => {
      setBlocoAberto(false);
      void toggleItem(id).catch(() => notify('Ops', 'Não consegui atualizar o item. Tente de novo.'));
    },
    [toggleItem],
  );

  const hint = !timer.running && progress === 0
    ? 'Aperte começar e foque em uma coisa só'
    : timer.running
      ? 'Foco ligado — o resto espera'
      : 'Pausado. Respire, depois continue.';

  return (
    <ScreenShell
      accent="timer"
      icon="flame"
      label="Timer"
      headline="Foco"
      state={`${duracaoMin} minutos de cada vez, sem culpa`}
      stats={
        <>
          <StatCard icon="flame" value={`${pct}%`} label="do ciclo" />
          <StatCard icon="flag" value={fimDoBloco} label="termina às" />
        </>
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.timerCard}>
          <Text style={styles.timeDisplay} accessibilityRole="timer">
            {formatMs(timer.remaining)}
          </Text>
          <View style={styles.dots} accessibilityLabel={`${pct}% do ciclo`}>
            {[1, 2, 3, 4, 5].map(i => (
              <View
                key={i}
                style={[styles.dot, progress >= i * 20 ? styles.dotOn : styles.dotOff]}
              />
            ))}
          </View>
          <View style={styles.hintRow}>
          <Ionicons
              name={timer.running ? 'flame' : 'time-outline'}
              size={15}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.hint}>{hint}</Text>
            <TouchableOpacity
              style={styles.ajustar}
              onPress={() => setConfigAberta(true)}
              hitSlop={10}
              accessibilityRole="button"
              testID="timer-ajustar-duracao"
              accessibilityLabel={`Ajustar duração do bloco. Bloco de ${duracaoMin} minutos`}
            >
              <Ionicons name="settings-outline" size={17} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttons}>
          {!timer.running ? (
            <TouchableOpacity
              style={styles.btnStart}
              onPress={timer.start}
              testID="timer-iniciar"
              accessibilityLabel="Iniciar foco"
            >
              <Ionicons name="play" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.btnText}>{progress > 0 ? 'Continuar' : 'Começar'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPause}
              onPress={timer.pause}
              testID="timer-pausar"
              accessibilityLabel="Pausar foco"
            >
              <Ionicons name="pause" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.btnText}>Pausar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnReset}
            onPress={timer.reset}
            testID="timer-zerar"
            accessibilityLabel="Zerar timer"
          >
            <Ionicons name="refresh-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.btnResetText}>Zerar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <ProgressBar percentage={progress} color={progressColor} embedded label="Progresso do ciclo" />
          <View style={styles.progressFoot}>
            <Ionicons name="checkmark-done" size={15} color={theme.colors.textMuted} />
            <Text style={styles.progressLabel}>
              {pct === 0
                ? 'Ciclo novinho esperando por você'
                : pct >= 100
                  ? 'Ciclo completo. Merece uma pausa.'
                  : `${pct}% do ciclo concluído`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BlocoConcluido
        visible={blocoAberto}
        duracaoMin={duracaoMin}
        concluidas={done}
        total={hojeItems.length}
        pct={dayPct}
        proximas={proximas}
        onEscolher={handleEscolher}
        onClose={() => setBlocoAberto(false)}
      />

      <ConfigurarBloco
        visible={configAberta}
        selectedMin={duracaoMin}
        onSelect={handleEscolherDuracao}
        onClose={() => setConfigAberta(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 24,
    gap: 16,
  },
  timerCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...cardShadow(),
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: '800',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  dots: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotOn: {
    backgroundColor: TIMER.base,
  },
  dotOff: {
    backgroundColor: theme.colors.disabled,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  hint: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
  ajustar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  btnStart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: TIMER.base,
  },
  btnPause: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.danger,
  },
  btnReset: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 54,
    paddingHorizontal: 22,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
  btnResetText: {
    color: theme.colors.textSecondary,
    fontSize: theme.type.callout,
    fontWeight: '600',
  },
  progressSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...cardShadow(1),
  },
  progressFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  progressLabel: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
  },
});
