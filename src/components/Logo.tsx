import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';

interface LogoProps {
  /** 'stack': marca em cima, nome centralizado embaixo. 'row': lado a lado. */
  layout?: 'stack' | 'row';
  /** Exibe o slogan sob o nome (só no 'stack'). */
  slogan?: boolean;
  /**
   * 'paper' (padrão): sobre o papel claro. 'band': sobre a faixa colorida —
   * a marca inverte (quadrado branco, sol verde) para não sumir no gradiente.
   */
  tone?: 'paper' | 'band';
}

/**
 * Logo "Sol Nascente": quadrado arredondado com um sol — o dia que começa
 * organizado — e o nome do app no meio da composição.
 */
export default function Logo({ layout = 'row', slogan = false, tone = 'paper' }: LogoProps) {
  const onBand = tone === 'band';

  return (
    <View style={[styles.base, layout === 'stack' ? styles.stack : styles.row]}>
      <View
        style={[styles.mark, onBand && styles.markOnBand]}
        accessibilityRole="image"
        accessibilityLabel="Logo Minha Rotina"
      >
        <Ionicons name="sunny" size={26} color={onBand ? theme.colors.primary : '#FFFFFF'} />
      </View>
      <View style={layout === 'stack' ? styles.center : undefined}>
        <Text style={[styles.wordmark, onBand && styles.wordmarkOnBand]}>
          Minha <Text style={onBand ? styles.accentOnBand : styles.wordmarkAccent}>Rotina</Text>
        </Text>
        {slogan && layout === 'stack' && (
          <Text style={[styles.slogan, onBand && styles.sloganOnBand]}>um dia de cada vez</Text>
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
  markOnBand: {
    backgroundColor: theme.colors.onBand,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  wordmarkOnBand: {
    color: theme.colors.onBandMuted,
  },
  wordmarkAccent: {
    color: theme.colors.primary,
  },
  accentOnBand: {
    color: theme.colors.onBand,
  },
  slogan: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sloganOnBand: {
    color: theme.colors.onBandFaint,
  },
});
