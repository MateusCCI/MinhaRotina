# DESIGN.md — Minha Rotina

Mundo visual: **Papel & Âmbar**. Tema claro, amigável, gramática iOS para um app
Operate (o visitante completa tarefas; a ferramenta some na tarefa).

**Teste de paleta alegre (28/09):** tinta primária Verde Folha `#15803D`, texto
Marrom Café `#44403C`; Âmbar `#B45309` segue como acento quente (avisos,
prazos). Família virou lima (`#ECFCCB`/`#3F6212`) para não colidir com a tinta.
Tokens `overlay` e `border` em marrom. Se o teste não agradar, reverter é só
trocar `primary`/`text` em `theme.ts`.

## Logo "Sol Nascente" (`src/components/Logo.tsx`)

Quadrado arredondado Verde Folha com sol branco (o dia que começa organizado)
+ wordmark **Minha Rotina** no meio da composição (`layout="stack"`, com slogan
"um dia de cada vez") ou ao lado (`layout="row"` para headers). Slogan e nome
em Marrom Café; "Rotina" em Folha para dar o acento.

## Cena física (decide claro vs. escuro)

Pessoa com TDAH confere a rotina no celular durante o dia, com uma mão, sob luz
ambiente clara. Por isso: fundo claro quente + cards brancos — nunca o inverso.

## Direction contract (redesign claro iOS, sessão 26/09/2026)

- **THESIS:** rotina que acolhe em vez de cobrar. Uma ideia por vez, foco máximo
  de 3, progresso celebrado. Recusa o arranjo padrão da categoria (dark
  "hacker" com gold neon + emoji como ícone).
- **OWN-WORLD:** papel quente `#F4F2EC` com cards brancos de sombra suave
  (offset + blur, nunca halo); UMA tinta âmbar queimado `#B45309` só para ação
  primária, seleção e estado; pills pastéis por categoria com texto escuro da
  mesma matiz; tipografia do sistema com large titles; ícones Ionicons de traço
  único (nunca emoji como ícone); cópia em português que ensina e encoraja.
- **STORY:** o usuário despeja sem filtro no Inbox, promove até 3 prioridades,
  confere a saída, foca em ciclos de 25min e revisa a semana com carinho.
- **FIRST VIEWPORT:** cada aba abre com large title + subtítulo de estado
  ("3 ideias esperando por você"), conteúdo em cards brancos sobre o papel,
  CTA primário âmbar de no mínimo 52pt no rodapé ou no card.
- **FORM:** iOS grouped lists + tab bar branca com 5 seções (seções, nunca
  ações), bottom-sheet para tarefas focadas (editar, escolher do Inbox),
  sem modal central. Modo: Operate, estratégia Restrained.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with
  the finish review, the verdict, DESIGN.md, and every shipping raster carrying
  its provenance.

## Tokens (`src/lib/theme.ts` — fonte única, zero cor fora daqui)

| Papel | Valor |
|---|---|
| `bg` (grouped) | `#F4F2EC` |
| `surface` (cards) | `#FFFFFF` |
| `surfaceAlt` (inputs, inativo) | `#ECE9E1` |
| `border` / `borderStrong` | `rgba(28,25,23,0.10)` / `rgba(180,83,9,0.40)` |
| `text` / `textBody` / `textSecondary` / `textMuted` | `#1C1917` / `#44403C` / `#57534E` / `#6E6A61` |
| `primary` / `primaryPress` / `primarySoft` / `onPrimary` | `#15803D` / `#166534` / `rgba(21,128,61,0.10)` / `#FFFFFF` |
| `success` / `successSoft` | `#15803D` / `rgba(21,128,61,0.12)` |
| `danger` / `dangerSoft` | `#DC2626` / `rgba(220,38,38,0.08)` |
| `warning` / `warningSoft` | `#B45309` / `rgba(180,83,9,0.10)` |
| `disabled` / `onDisabled` | `#E7E5E4` / `#6E6A61` |

Texto e placeholder miram contraste ≥ 4.5:1. `statusColor(pct)`: ≥67 success,
≥34 warning, senão danger. `cardShadow()`: offset (0,2) + blur 8 + elevation.

## Categorias (`src/lib/date.ts`)

Pill pastel + texto escuro da matiz (nunca cinza sobre cor):

| Categoria | Fundo | Texto |
|---|---|---|
| Trabalho | `#DBEAFE` | `#1D4ED8` |
| Estudo | `#F3E8FF` | `#7E22CE` |
| Família | `#DCFCE7` | `#15803D` |
| Casa | `#FFEDD5` | `#C2410C` |
| Mercado | `#FCE7F3` | `#BE185D` |
| Outros | `#E7E5E4` | `#57534E` |

## Componentes e convenções

- **Alvos de toque:** mínimo 44pt (chips, botões de ícone, itens de lista);
  CTAs primários com 52–54pt.
- **Raios:** `lg 20` (cards), `md 14` (botões/inputs), `pill 999` (chips).
- **Tipo:** largeTitle 30/800 nas 5 telas, title 20, body 17, callout 15,
  footnote 13, caption 12 (labels uppercase com tracking 0.8).
- **Tab bar:** branca, ícones Ionicons (outline/inativo, cheio/ativo), tinta
  `primary`, badge âmbar, label 12/600.
- **Sheets:** edição e "escolha do Inbox" sobem de baixo (`animationType="slide"`)
  com overlay `rgba(28,25,23,0.45)`; cancelar fecha por swipe/gesto do SO.
- **Micro-interação (uma só):** `expo-haptics` `selectionAsync` ao concluir,
  promover e marcar saída — estado físico, não decoração.
- **Statubar:** `StatusBar style="dark"`; telas dentro de `SafeAreaView`
  (`edges={['top']}`).
- **Anti-padrões banidos aqui:** emoji como ícone, `border-left` colorida,
  texto em gradiente, cards de mesmo tamanho como estrutura, kicker acima de
  título, `fontFamily: 'monospace'` como fantasia (Timer usa
  `fontVariant: tabular-nums`).

## Notas de implementação

- `@expo/vector-icons` (Ionicons) é dependência oficial; **não** usar
  `React.ComponentProps<typeof Ionicons>['name']` — instanciar esse genérico
  sobre o union de 1300 glifos trava o `tsc` (TS 6). Usar union local com os
  nomes usados (ver `App.tsx`, `IconName`).
- Nomes válidos checados: `file-tray`/`file-tray-outline` (não `tray`),
  `checkmark` (não `check`).
