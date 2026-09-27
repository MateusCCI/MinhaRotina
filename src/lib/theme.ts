import { Platform } from 'react-native';

/**
 * Mundo visual "Papel & Âmbar" — tema claro, amigável, gramática iOS.
 *
 * Cena física: pessoa com TDAH confere a rotina no celular durante o dia,
 * com uma mão, sob luz ambiente clara — por isso fundo claro quente
 * (grouped) com cards brancos, e não o inverso.
 *
 * Estratégia de cor: Restrained (modo Operate) — neutros quentes + UMA
 * tinta (âmbar queimado) só para ação primária, seleção e estado.
 * Contrastes miram ≥4.5:1 em texto e placeholder (craft floor).
 */
export const theme = {
  colors: {
    // Superfícies (iOS grouped, versão quente)
    bg: '#F4F2EC',
    surface: '#FFFFFF',
    surfaceAlt: '#ECE9E1',
    border: 'rgba(28,25,23,0.10)',
    borderStrong: 'rgba(180,83,9,0.40)',

    // Texto sobre fundo claro
    text: '#1C1917',
    textBody: '#44403C',
    textSecondary: '#57534E',
    textMuted: '#6E6A61',

    // Tinta única: âmbar queimado (ação primária, seleção, foco)
    primary: '#B45309',
    primaryPress: '#92400E',
    primarySoft: 'rgba(180,83,9,0.10)',
    onPrimary: '#FFFFFF',

    // Semânticas
    success: '#0F766E',
    successSoft: 'rgba(15,118,110,0.10)',
    danger: '#DC2626',
    dangerSoft: 'rgba(220,38,38,0.08)',
    warning: '#B45309',
    warningSoft: 'rgba(180,83,9,0.10)',

    disabled: '#E7E5E4',
    onDisabled: '#6E6A61',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  type: {
    largeTitle: 30,
    title: 20,
    body: 17,
    callout: 15,
    footnote: 13,
    caption: 12,
  },
} as const;

/** Sombra suave de card claro: sempre com offset + blur (nunca halo). */
export function cardShadow(elev = 2) {
  if (Platform.OS === 'android') {
    return { elevation: elev } as const;
  }
  return {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  } as const;
}

export function statusColor(pct: number): string {
  if (pct >= 67) return theme.colors.success;
  if (pct >= 34) return theme.colors.warning;
  return theme.colors.danger;
}
