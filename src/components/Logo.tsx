import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';

interface LogoProps {
  /** 'stack': marca em cima, nome centralizado embaixo. 'row': lado a lado. */
  layout?: 'stack' | 'row';
  /** Exibe o slogan sob o nome (só no 'stack'). */
  slogan?: boolean;
}

/**
 * Logo "Sol Nascente": quadrado arredondado Verde Folha com um sol branco —
 * o dia que começa organizado — e o nome do app no meio da composição.
 * Paleta alegre: Folha #15803D + Café #44403C sobre Papel #F4F2EC.
 */
export default function Logo({ layout = 'row', slogan = false }: LogoProps) {
  return (
    <View style={[styles.base, layout === 'stack' ? styles.stack : styles.row]}>
      <View style={styles.mark} accessibilityRole="image" accessibilityLabel="Logo Minha Rotina">
        <Ionicons name="sunny" size={26} color="#FFFFFF" />
      </View>
      <View style={layout === 'stack' ? styles.center : undefined}>
        <Text style={styles.wordmark}>
          Minha <Text style={styles.wordmarkAccent}>Rotina</Text>
        </Text>
        {slogan && layout === 'stack' && (
          <Text style={styles.slogan}>um dia de cada vez</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
  },
  stack: {
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  center: {
    alignItems: 'center',
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  wordmarkAccent: {
    color: theme.colors.primary,
  },
  slogan: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
