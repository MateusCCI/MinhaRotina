import { Platform } from 'react-native';

/**
 * Mundo visual "Papel & Âmbar" — tema claro, amigável, gramática iOS.
 *
 * Teste de paleta alegre (sessão 28/09): tinta primária Verde Folha e texto
 * Marrom Café; o Âmbar segue como acento quente (avisos, prazos).
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
    border: 'rgba(68,64,60,0.10)',
    borderStrong: 'rgba(21,128,61,0.40)',
    overlay: 'rgba(68,64,60,0.45)',

    // Texto sobre fundo claro (Marrom Café e derivados)
    text: '#44403C',
    textBody: '#57534E',
    textSecondary: '#6E6A61',
    textMuted: '#6E6A61',

    // Tinta única: Verde Folha (ação primária, seleção, foco)
    primary: '#15803D',
    primaryPress: '#166534',
    primarySoft: 'rgba(21,128,61,0.10)',
    onPrimary: '#FFFFFF',

    // Semânticas
    success: '#15803D',
    successSoft: 'rgba(21,128,61,0.12)',
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
  if (Platform.OS === 'web') {
    // RN Web depreciou shadow* em favor do CSS boxShadow.
    return { boxShadow: '0 2px 8px rgba(68,64,60,0.08)' } as const;
  }
  return {
    shadowColor: '#44403C',
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
