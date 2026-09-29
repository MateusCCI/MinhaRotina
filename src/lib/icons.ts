/**
 * Vocabulário de ícones do app.
 *
 * O union é escrito à mão de propósito: instanciar
 * `React.ComponentProps<typeof Ionicons>['name']` sobre os 1357 glifos do
 * Ionicons trava o `tsc` (TS 6). Só entram aqui os nomes usados em mapas —
 * em JSX o literal é conferido pelo próprio `@expo/vector-icons`.
 *
 * Ícone nunca é decoração: cada um nomeia um contexto (categoria, tela,
 * estatística). Emoji segue banido como ícone (ver `docs/DESIGN.md`).
 */
export type IconName =
  // categorias
  | 'briefcase'
  | 'school'
  | 'people'
  | 'home'
  | 'cart'
  | 'pricetags'
  // telas
  | 'file-tray'
  | 'file-tray-outline'
  | 'sunny'
  | 'sunny-outline'
  | 'timer'
  | 'timer-outline'
  | 'exit'
  | 'exit-outline'
  | 'bar-chart'
  | 'bar-chart-outline'
  | 'ellipse-outline'
  // conteúdo e ações
  | 'flag'
  | 'flame'
  | 'checkmark'
  | 'checkmark-done'
  | 'checkmark-circle-outline'
  | 'close-circle-outline'
  | 'sparkles'
  | 'sparkles-outline'
  | 'pencil-outline'
  | 'trash-outline'
  | 'add'
  | 'arrow-forward'
  | 'chevron-forward'
  | 'bag-check-outline'
  | 'time-outline'
  | 'person-outline'
  // hora do dia
  | 'partly-sunny'
  | 'moon';

/** Um ícone por categoria — as mesmas chaves de `CATEGORIES`. */
export const CATEGORY_ICONS: Record<string, IconName> = {
  Trabalho: 'briefcase',
  Estudo: 'school',
  'Família': 'people',
  Casa: 'home',
  Mercado: 'cart',
  Outros: 'pricetags',
};

/** Fallback neutro para item sem categoria. */
export function categoryIcon(category?: string | null): IconName {
  return (category ? CATEGORY_ICONS[category] : undefined) ?? 'pricetags';
}
