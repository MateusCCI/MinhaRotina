import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimer, formatMs } from '../../../hooks/useTimer';
import ScreenShell from '../../../src/components/ScreenShell';
import ProgressBar from '../../../src/components/ProgressBar';
import StatCard from '../../../src/components/StatCard';
import { accents, statusColor, theme, cardShadow } from '../../../src/lib/theme';

const TOTAL_MS = 25 * 60 * 1000;
const TIMER = accents.timer;

export default function TimerScreen() {
  const timer = useTimer({
    prefix: 'pomodoro',
    totalMs: TOTAL_MS,
    onComplete: () => {},
  });

  const progress = TOTAL_MS > 0 ? ((TOTAL_MS - timer.remaining) / TOTAL_MS) * 100 : 0;
  const progressColor = statusColor(progress);
  const pct = Math.round(progress);

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
      state="25 minutos de cada vez, sem culpa"
      stats={
        <>
          <StatCard icon="flame" value={`${pct}%`} label="do ciclo" />
          <StatCard icon="timer-outline" value={formatMs(timer.remaining)} label="restante" />
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
          </View>
        </View>

        <View style={styles.buttons}>
          {!timer.running ? (
            <TouchableOpacity
              style={styles.btnStart}
              onPress={timer.start}
              accessibilityLabel="Iniciar foco"
            >
              <Ionicons name="play" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.btnText}>{progress > 0 ? 'Continuar' : 'Começar'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPause}
              onPress={timer.pause}
              accessibilityLabel="Pausar foco"
            >
              <Ionicons name="pause" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.btnText}>Pausar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnReset}
            onPress={timer.reset}
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
