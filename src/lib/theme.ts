import { Platform } from 'react-native';

/**
 * Mundo visual "Papel & Aurora" — tema claro, amigável, gramática iOS.
 *
 * Paleta por contexto (revisão de 29/09): a estratégia saiu de Restrained
 * (uma tinta e neutros) para **cinco famílias de cor, uma por contexto**,
 * cada uma com regra fixa de uso. A cor passou a *informar* em que parte da
 * rotina o usuário está, em vez de repetir a mesma tinta nas 4 abas. São 5
 * famílias em 4 abas porque a família `hoje` (azul) identifica a zona de
 * prioridades dentro da tela do dia, que tem faixa verde.
 *
 * Regra de uso dos acentos (idêntica nas 4 abas):
 * 1. A faixa colorida (`band`) abre a tela e carrega o título — identidade.
 * 2. `base` tinta ícones, valores e estados ativos do conteúdo.
 * 3. `soft` é a versão translúcida para cards e chips sobre o papel claro.
 * 4. `primary` (Verde Folha) continua sendo a ação primária do app — a marca.
 *
 * Cena física: pessoa com TDAH confere a rotina no celular durante o dia,
 * com uma mão, sob luz ambiente clara — por isso fundo claro quente
 * (grouped) com cards brancos, e nunca o inverso.
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

    // Tinta da marca: ação primária, seleção e foco
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

    // Sobre a faixa colorida (todos os `band` passam de 4.5:1 com branco)
    onBand: '#FFFFFF',
    onBandMuted: 'rgba(255,255,255,0.90)',
    onBandFaint: 'rgba(255,255,255,0.78)',
    onBandSoft: 'rgba(255,255,255,0.16)',
    onBandBorder: 'rgba(255,255,255,0.30)',

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

export type AccentKey = 'inbox' | 'hoje' | 'timer' | 'saida' | 'revisao';

export interface Accent {
  /** Tinta da família: ícones, valores e estado ativo do conteúdo. */
  base: string;
  /** Segundo tom da faixa (escuro: branco sobre ele passa de 4.5:1). */
  deep: string;
  /** Versão translúcida para cards e chips sobre o papel claro. */
  soft: string;
  /** Par [base, deep] na ordem da faixa, de cima para baixo. */
  band: readonly [string, string];
}

/**
 * Cinco famílias de cor, uma por contexto. Escolhidas por matiz e não por
 * gosto: verde (guardar), azul (focar), âmbar (esforço), rosa/violeta
 * (encerrar) e teal (revisar) — nenhuma se repete dentro da faixa.
 */
export const accents: Record<AccentKey, Accent> = {
  inbox: { base: '#15803D', deep: '#0E7490', soft: 'rgba(21,128,61,0.10)', band: ['#15803D', '#0E7490'] },
  hoje: { base: '#1D4ED8', deep: '#4338CA', soft: 'rgba(29,78,216,0.10)', band: ['#1D4ED8', '#4338CA'] },
  timer: { base: '#B45309', deep: '#C2410C', soft: 'rgba(180,83,9,0.10)', band: ['#B45309', '#C2410C'] },
  saida: { base: '#BE185D', deep: '#7C3AED', soft: 'rgba(190,24,93,0.10)', band: ['#BE185D', '#7C3AED'] },
  revisao: { base: '#0F766E', deep: '#065F46', soft: 'rgba(15,118,110,0.10)', band: ['#0F766E', '#065F46'] },
};

/** Cor sólida da faixa, para pintar o container atrás da área do notch. */
export function bandColor(accent: Accent): string {
  return accent.band[0];
}

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
