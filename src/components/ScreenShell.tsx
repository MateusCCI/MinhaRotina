import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AccentKey, accents, bandColor, theme } from '../lib/theme';
import { IconName } from '../lib/icons';

interface ScreenShellProps {
  /** Família de cor da tela (ver `accents` em theme.ts). */
  accent: AccentKey;
  /** Ícone da tela, dentro do chip da faixa. */
  icon: IconName;
  /** Rótulo curto em caixa alta — o nome da aba. */
  label: string;
  /** Saudação ou título forte da tela. */
  headline: string;
  /** Linha de estado do moment (números que mudam). */
  state?: string;
  /** Complemento discreto (data, aviso curto). */
  meta?: string;
  /** Cards de estatística dentro da faixa. */
  stats?: ReactNode;
  /** Conteúdo claro da tela (normalmente um `ScrollView`). */
  children?: ReactNode;
  /** Barra fixa no rodapé, acima da tab bar. */
  footer?: ReactNode;
  /** Troca o corpo por um spinner sobre o papel. */
  loading?: boolean;
  style?: ViewStyle;
}

/**
 * Casca de tela: a faixa colorida é o mesmo componente nas 5 abas, então
 * elas não têm como divergir entre si. A faixa carrega a identidade
 * (família de cor + ícone + rótulo) e o corpo volta ao papel claro.
 *
 * O container pinta a cor sólida da faixa para que a área do notch
 * (`edges={['top']}`) não abra um buraco bege sobre o gradiente.
 */
export default function ScreenShell({
  accent,
  icon,
  label,
  headline,
  state,
  meta,
  stats,
  children,
  footer,
  loading = false,
  style,
}: ScreenShellProps) {
  const tone = accents[accent];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bandColor(tone) }]} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={tone.band}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.band}
      >
        <View style={styles.topRow}>
          <View style={styles.iconChip}>
            <Ionicons name={icon} size={16} color={theme.colors.onBand} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>

        <Text style={styles.headline}>{headline}</Text>
        {state ? <Text style={styles.state}>{state}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}

        {stats ? <View style={styles.stats}>{stats}</View> : null}
      </LinearGradient>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={tone.base} />
        </View>
      ) : (
        <View style={[styles.body, style]}>{children}</View>
      )}

      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  band: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  iconChip: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: theme.colors.onBandSoft,
    borderWidth: 1,
    borderColor: theme.colors.onBandBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: theme.type.caption,
    fontWeight: '800',
    color: theme.colors.onBandMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.onBand,
    letterSpacing: -0.4,
  },
  state: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.onBandMuted,
    marginTop: 4,
  },
  meta: {
    fontSize: theme.type.footnote,
    color: theme.colors.onBandFaint,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg,
  },
});
