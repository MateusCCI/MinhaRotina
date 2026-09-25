export const theme = {
  colors: {
    bg: '#080706',
    surface: '#141210',
    surfaceAlt: '#1D1A15',
    border: 'rgba(255,186,0,0.16)',
    borderStrong: 'rgba(255,186,0,0.45)',
    text: '#E1E1E1',
    textBody: '#D7D7D7',
    textSecondary: '#A3A09A',
    textMuted: '#73706A',
    gold: '#FFBA00',
    goldPress: '#E0A300',
    goldSoft: 'rgba(255,186,0,0.14)',
    onGold: '#0B0A08',
    patina: '#0FB6AC',
    patinaPale: '#8ED3CC',
    danger: '#FF5F56',
    warning: '#FFBD2E',
    dangerSoft: 'rgba(255,95,86,0.16)',
    successSoft: 'rgba(15,182,172,0.16)',
    warningSoft: 'rgba(255,189,46,0.16)',
    disabled: '#3A3630',
    onDisabled: '#8A857C',
  },
} as const;

export function statusColor(pct: number): string {
  if (pct >= 67) return theme.colors.patina;
  if (pct >= 34) return theme.colors.warning;
  return theme.colors.danger;
}