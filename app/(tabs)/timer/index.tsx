import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTimer, formatMs } from '../../../hooks/useTimer';
import ProgressBar from '../../../src/components/ProgressBar';
import { theme, statusColor } from '../../../src/lib/theme';

const TOTAL_MS = 25 * 60 * 1000;

export default function TimerScreen() {
  const timer = useTimer({
    prefix: 'pomodoro',
    totalMs: TOTAL_MS,
    onComplete: () => {},
  });

  const progress = TOTAL_MS > 0 ? ((TOTAL_MS - timer.remaining) / TOTAL_MS) * 100 : 0;
  const progressColor = statusColor(progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MINHA ROTINA</Text>
        <Text style={styles.subtitle}>Timer Pomodoro</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.timerCard}>
          <Text style={styles.timeDisplay}>
            {formatMs(timer.remaining)}
          </Text>
          <View style={styles.dots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Text key={i} style={styles.dot}>
                {progress >= i * 20 ? '●' : '○'}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.buttons}>
          {!timer.running ? (
            <TouchableOpacity
              style={styles.btnStart}
              onPress={timer.start}
            >
              <Text style={styles.btnText}>▶ Iniciar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnPause}
              onPress={timer.pause}
            >
              <Text style={styles.btnText}>⏸ Pausar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnReset} onPress={timer.reset}>
            <Text style={styles.btnResetText}>↺ Zerar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Progresso do dia</Text>
          <ProgressBar percentage={progress} color={progressColor} />
          <Text style={styles.progressLabel}>
            {Math.round(progress)}% concluído
          </Text>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.gold,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  timerCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    fontSize: 24,
    color: theme.colors.gold,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  btnStart: {
    backgroundColor: theme.colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnPause: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnReset: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnText: {
    color: theme.colors.onGold,
    fontSize: 14,
    fontWeight: '600',
  },
  btnResetText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
});
