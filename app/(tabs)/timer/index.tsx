import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTimer, formatMs } from '../../../hooks/useTimer';
import ProgressBar from '../../../src/components/ProgressBar';
import { theme, statusColor, cardShadow } from '../../../src/lib/theme';

const TOTAL_MS = 25 * 60 * 1000;

export default function TimerScreen() {
  const timer = useTimer({
    prefix: 'pomodoro',
    totalMs: TOTAL_MS,
    onComplete: () => {},
  });

  const progress = TOTAL_MS > 0 ? ((TOTAL_MS - timer.remaining) / TOTAL_MS) * 100 : 0;
  const progressColor = statusColor(progress);
  const pct = Math.round(progress);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Foco</Text>
        <Text style={styles.subtitle}>25 minutos de cada vez, sem culpa</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.timerCard}>
          <Text style={styles.timeDisplay} accessibilityRole="timer">
            {formatMs(timer.remaining)}
          </Text>
          <View style={styles.dots} accessibilityLabel={`${pct}% do ciclo`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[styles.dot, progress >= i * 20 ? styles.dotOn : styles.dotOff]}
              />
            ))}
          </View>
          <Text style={styles.hint}>
            {!timer.running && progress === 0
              ? 'Aperte começar e foque em uma coisa só'
              : timer.running
                ? 'Foco ligado — o resto espera'
                : 'Pausado. Respire, depois continue.'}
          </Text>
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
          <Text style={styles.progressTitle}>Ciclo atual</Text>
          <ProgressBar percentage={progress} color={progressColor} />
          <Text style={styles.progressLabel}>
            {pct === 0
              ? 'Ciclo novinho esperando por você'
              : pct >= 100
                ? 'Ciclo completo. Merece uma pausa.'
                : `${pct}% do ciclo concluído`}
          </Text>
        </View>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
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
    backgroundColor: theme.colors.primary,
  },
  dotOff: {
    backgroundColor: theme.colors.disabled,
  },
  hint: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 14,
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
    backgroundColor: theme.colors.primary,
  },
  btnPause: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.warning,
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
  progressTitle: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
