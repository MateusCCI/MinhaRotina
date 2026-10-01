export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Início do dia **local**, gravado no mesmo formato que o SQLite usa em
 * `CURRENT_TIMESTAMP` ("YYYY-MM-DD HH:MM:SS") e sempre em UTC.
 *
 * Por que passar o limite como parâmetro em vez de usar `date('now')` ou
 * `date(col, 'localtime')` no SQL: o SQLite do navegador (wa-sqlite) roda
 * sem acesso ao fuso do sistema, então `localtime` ali voltaria a ser UTC —
 * e o bug reaparecia só no web, que é onde dá para testar sem aparelho. Com
 * os dois lados em UTC, a comparação de strings já é a ordem do tempo, e o
 * mesmo código vale para web e Android.
 */
export function utcDayStart(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

export type DueTone = 'overdue' | 'today' | 'later';

export interface DueInfo {
  label: string | null;
  /** true quando o prazo venceu ou vence hoje. */
  urgent: boolean;
  /**
   * O estado do prazo como categoria, não como cor. O ícone do badge vem
   * daqui: cor sozinha não distingue vermelho de verde para quem tem
   * deuteranopia (~8% dos homens), então cada tom tem um glifo próprio.
   */
  tone: DueTone | null;
}

export function dueLabel(dueDate?: string | null): DueInfo {
  if (!dueDate) return { label: null, urgent: false, tone: null };
  const today = toLocalDateString(new Date());
  if (dueDate < today) return { label: 'atrasada', urgent: true, tone: 'overdue' };
  if (dueDate === today) return { label: 'vence hoje', urgent: true, tone: 'today' };
  if (dueDate === addDays(1)) return { label: 'vence amanhã', urgent: false, tone: 'later' };
  const [, m, d] = dueDate.split('-').map(Number);
  return {
    label: `vence ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`,
    urgent: false,
    tone: 'later',
  };
}

/** Fundo pastel do pill de categoria (fundo claro → tinta escura da mesma matiz). */
export const CATEGORY_COLORS: Record<string, string> = {
  Trabalho: '#DBEAFE',
  Estudo: '#F3E8FF',
  'Família': '#ECFCCB',
  Casa: '#FFEDD5',
  Mercado: '#FCE7F3',
  Outros: '#E7E5E4',
};

/** Texto do pill: sempre a versão escura da matiz (contraste ≥4.5:1). */
export const CATEGORY_TEXT: Record<string, string> = {
  Trabalho: '#1D4ED8',
  Estudo: '#7E22CE',
  'Família': '#3F6212',
  Casa: '#C2410C',
  Mercado: '#BE185D',
  Outros: '#57534E',
};

export const CATEGORIES = ['Trabalho', 'Estudo', 'Família', 'Casa', 'Mercado', 'Outros'];

export const DUE_OPTIONS: { key: string; label: string; value: string | null }[] = [
  { key: 'none', label: 'Sem prazo', value: null },
  { key: 'today', label: 'Hoje', value: addDays(0) },
  { key: 'tomorrow', label: 'Amanhã', value: addDays(1) },
  { key: 'week', label: '7 dias', value: addDays(7) },
];