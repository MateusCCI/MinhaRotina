import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { IconName } from '../lib/icons';

interface StatCardProps {
  icon: IconName;
  value: string;
  label: string;
  /**
   * 'positive' inverte o card (fundo branco, tinta verde): marca um alvo
   * batido — foco cheio, dia 100% — sem precisar de mais uma cor.
   */
  tone?: 'default' | 'positive';
}

/**
 * Card de estatística que fica **dentro** da faixa colorida: fundo
 * translúcido, não branco — é o que dá profundidade sem pesar o topo.
 * Ícone + número + rótulo: o número responde "quanto", o rótulo "quanto
 * de quê", e o ícone dispensa ler o rótulo.
 */
export default function StatCard({ icon, value, label, tone = 'default' }: StatCardProps) {
  const positive = tone === 'positive';
  return (
    <View style={[styles.card, positive && styles.cardPositive]}>
      <View style={styles.iconRow}>
        <Ionicons
          name={icon}
          size={13}
          color={positive ? theme.colors.success : theme.colors.onBandMuted}
        />
        <Text
          style={[styles.label, positive && styles.labelPositive]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <Text style={[styles.value, positive && styles.valuePositive]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 64,
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.onBandSoft,
    borderWidth: 1,
    borderColor: theme.colors.onBandBorder,
  },
  cardPositive: {
    backgroundColor: theme.colors.onBand,
    borderColor: theme.colors.onBand,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onBandMuted,
  },
  labelPositive: {
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.onBand,
    letterSpacing: -0.5,
    marginTop: 6,
  },
  valuePositive: {
    color: theme.colors.success,
  },
});
