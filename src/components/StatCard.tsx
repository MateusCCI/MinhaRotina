import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { IconName } from '../lib/icons';

interface StatCardProps {
  icon: IconName;
  value: string;
  label: string;
}

/**
 * Card de estatística que fica **dentro** da faixa colorida: fundo
 * translúcido, não branco — é o que dá profundidade sem pesar o topo.
 * Ícone + número + rótulo: o número responde "quanto", o rótulo "quanto
 * de quê", e o ícone dispensa ler o rótulo.
 */
export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconRow}>
        <Ionicons name={icon} size={13} color={theme.colors.onBandMuted} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
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
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.onBand,
    letterSpacing: -0.5,
    marginTop: 6,
  },
});
