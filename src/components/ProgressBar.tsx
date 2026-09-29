import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';

interface ProgressBarProps {
  percentage: number;
  color: string;
  /** True quando o componente já está dentro de um card (sem card próprio). */
  embedded?: boolean;
  /** Rótulo da barra — o mesmo componente mede dia e ciclo do timer. */
  label?: string;
}

export default function ProgressBar({
  percentage,
  color,
  embedded = false,
  label = 'Progresso de hoje',
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  return (
    <View
      style={[styles.container, embedded && styles.containerEmbedded]}
      accessibilityRole="progressbar"
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentage, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  containerEmbedded: {
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  percentage: {
    fontSize: theme.type.title,
    fontWeight: '800',
  },
  track: {
    height: 12,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
});
