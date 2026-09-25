export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

export function dueLabel(dueDate?: string | null): { label: string | null; urgent: boolean } {
  if (!dueDate) return { label: null, urgent: false };
  const today = toLocalDateString(new Date());
  if (dueDate < today) return { label: 'atrasada', urgent: true };
  if (dueDate === today) return { label: 'vence hoje', urgent: true };
  if (dueDate === addDays(1)) return { label: 'vence amanhã', urgent: false };
  const [, m, d] = dueDate.split('-').map(Number);
  return { label: `vence ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`, urgent: false };
}

export const CATEGORY_COLORS: Record<string, string> = {
  Trabalho: '#7AA2FF',
  Estudo: '#C084FC',
  'Família': '#4ADE80',
  Casa: '#FB923C',
  Mercado: '#F472B6',
  Outros: '#A8A29E',
};

export const CATEGORIES = ['Trabalho', 'Estudo', 'Família', 'Casa', 'Mercado', 'Outros'];

export const DUE_OPTIONS: { key: string; label: string; value: string | null }[] = [
  { key: 'none', label: 'Sem prazo', value: null },
  { key: 'today', label: 'Hoje', value: addDays(0) },
  { key: 'tomorrow', label: 'Amanhã', value: addDays(1) },
  { key: 'week', label: '7 dias', value: addDays(7) },
];