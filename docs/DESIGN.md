# DESIGN.md — Minha Rotina

Mundo visual: **Papel & Aurora**. Tema claro, amigável, gramática iOS para um
app Operate (o visitante completa tarefas; a ferramenta some na tarefa).

## Paleta por contexto (revisão de 29/09, feedback do professor)

O professor leu a paleta anterior como "4 cores" e pediu mais cor, mais ícones
e mais vida. A resposta **não** foi espalhar cor: foi dar a cada contexto a
sua própria família, com regra fixa de uso. Agora são 5 famílias + 1 tinta de
marca + 6 matizes de categoria, todas com nome, todas com regra.

### As três respostas ao feedback

| Pergunta do professor | Resposta no design |
|---|---|
| "só 4 cores?" | A paleta deixou de ser uma lista e virou um **sistema de 5 famílias por contexto**. Cada cor responde a uma pergunta — *em que parte da rotina eu estou?* — em vez de repetir a mesma tinta 5 vezes. |
| "coloque mais cores" | Cores novas **com significado**: faixa colorida em todas as telas, 3–4 cartões de estatística com cor própria, fundo colorido no logo, ícones por categoria. Nada de cor decorativa. |
| "use ícones" | `src/lib/icons.ts` — um ícone por categoria, por tela e por estatística. Ícone nomeia contexto, nunca decora. |

### Regra de uso dos acentos (válida nas 5 telas)

1. **A faixa colorida** (`band`) abre a tela e carrega o título — identidade.
   O corpo volta ao papel claro; cards brancos sobre ele.
2. **`base`** tinta ícones, números, valores ativos e o botão primário da tela.
3. **`soft`** é a versão translúcida para chips, empty states e faixas de destaque.
4. **`primary` (Verde Folha)** continua sendo a ação primária do app — é a marca,
   e por isso não muda com a tela.

| Tela | Família | `base` | `deep` (fim do gradiente) |
|---|---|---|---|
| Inbox | verde → teal | `#15803D` | `#0E7490` |
| Hoje | azul → índigo | `#1D4ED8` | `#4338CA` |
| Timer | âmbar → laranja | `#B45309` | `#C2410C` |
| Saída | rosa → violeta | `#BE185D` | `#7C3AED` |
| Revisão | teal → esmeralda | `#0F766E` | `#065F46` |

Os dois tons de cada faixa são **escuros de propósito**: é o que garante
contraste ≥ 4.5:1 com o texto branco do topo até o fim do gradiente.

## Cena física (decide claro vs. escuro)

Pessoa com TDAH confere a rotina no celular durante o dia, com uma mão, sob luz
ambiente clara. Por isso: fundo claro quente + cards brancos — nunca o inverso.

## Direction contract

- **THESIS:** rotina que acolhe em vez de cobrar. Uma ideia por vez, foco máximo
  de 3, progresso celebrado. Recusa o arranjo padrão da categoria (dark
  "hacker" com gold neon + emoji como ícone).
- **OWN-WORLD:** papel quente `#F4F2EC` com cards brancos de sombra suave
  (offset + blur, nunca halo); faixa em gradiente no topo de cada aba; cinco
  famílias de cor por contexto; pills pastéis por categoria com texto escuro da
  mesma matiz; tipografia do sistema; ícones Ionicons de traço único (nunca
  emoji como ícone); cópia em português que ensina e encoraja.
- **STORY:** o usuário despeja sem filtro no Inbox, promove até 3 prioridades,
  confere a saída, foca em ciclos de 25min e revisa a semana com carinho.
- **FIRST VIEWPORT:** cada aba abre com faixa colorida (chip de ícone + rótulo
  + título + estado) e, quando há número, três StatCards translúcidos sobre a
  faixa. O corpo abre com o campo de captura ou a lista, sobre o papel.
- **FORM:** iOS grouped lists + tab bar branca com 5 seções (seções, nunca
  ações) que acende na tinta da aba; bottom-sheet para tarefas focadas (editar,
  escolher do Inbox), sem modal central. Modo: Operate, estratégia Contida por
  contexto.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with
  the finish review, the verdict, DESIGN.md, and every shipping raster carrying
  its provenance.

## Tokens (`src/lib/theme.ts` — fonte única, zero cor fora daqui)

| Papel | Valor |
|---|---|
| `bg` (grouped) | `#F4F2EC` |
| `surface` (cards) | `#FFFFFF` |
| `surfaceAlt` (inputs, inativo) | `#ECE9E1` |
| `border` | `rgba(68,64,60,0.10)` |
| `text` / `textBody` / `textSecondary` / `textMuted` | `#44403C` / `#57534E` / `#6E6A61` / `#6E6A61` |
| `primary` / `primaryPress` / `primarySoft` / `onPrimary` | `#15803D` / `#166534` / `rgba(21,128,61,0.10)` / `#FFFFFF` |
| `success` / `successSoft` | `#15803D` / `rgba(21,128,61,0.12)` |
| `danger` / `dangerSoft` | `#DC2626` / `rgba(220,38,38,0.08)` |
| `warning` / `warningSoft` | `#B45309` / `rgba(180,83,9,0.10)` |
| `onBand` / `onBandMuted` / `onBandFaint` | `#FFFFFF` / `rgba(255,255,255,0.90)` / `rgba(255,255,255,0.78)` |
| `onBandSoft` / `onBandBorder` | `rgba(255,255,255,0.16)` / `rgba(255,255,255,0.30)` |
| `disabled` / `onDisabled` | `#E7E5E4` / `#6E6A61` |

`statusColor(pct)`: ≥67 success, ≥34 warning, senão danger. `cardShadow()`:
offset (0,2) + blur 8 + elevation. `bandColor(accent)`: cor sólida da faixa,
para pintar o container atrás da área do notch.

## Ícones (`src/lib/icons.ts`)

Um ícone por contexto, nunca decorativo:

- **Categorias** — Trabalho `briefcase`, Estudo `school`, Família `people`,
  Casa `home`, Mercado `cart`, Outros `pricetags`.
- **Telas** — Inbox `file-tray`, Hoje `flag`, Timer `timer`/`flame`,
  Saída `exit`, Revisão `bar-chart`.
- **Estatísticas** — `file-tray` (inbox), `flag` (prioridades),
  `checkmark-done` (concluído), `bag-check-outline` (conferidos),
  `time-outline` (prazo/horário), `sparkles` (ação de cuidado).
- **Ações** — `pencil-outline`, `trash-outline`, `close-circle-outline`,
  `add`, `checkmark`, `arrow-forward`, `refresh-outline`.

## Categorias (`src/lib/date.ts`)

Pill pastel + texto escuro da matiz (nunca cinza sobre cor):

| Categoria | Fundo | Texto | Ícone |
|---|---|---|---|
| Trabalho | `#DBEAFE` | `#1D4ED8` | `briefcase` |
| Estudo | `#F3E8FF` | `#7E22CE` | `school` |
| Família | `#ECFCCB` | `#3F6212` | `people` |
| Casa | `#FFEDD5` | `#C2410C` | `home` |
| Mercado | `#FCE7F3` | `#BE185D` | `cart` |
| Outros | `#E7E5E4` | `#57534E` | `pricetags` |

## Componentes e convenções

- **`ScreenShell`** — casca única das 5 abas (e da faixa do login): gradiente,
  chip de ícone, `StatusBar` claro, corpo sobre o papel, `footer` opcional.
  Uma tela só de cabeçalho significa que nenhuma aba diverge da outra.
- **`StatCard`** — ícone + número + rótulo dentro da faixa, em fundo
  translúcido. O número responde "quanto", o rótulo "quanto de quê", e o ícone
  dispensa ler o rótulo.
- **Alvos de toque:** mínimo 44pt (chips, botões de ícone, itens de lista);
  CTAs primários com 52–54pt.
- **Raios:** `lg 20` (cards), `md 14` (botões/inputs), `pill 999` (chips),
  `sm 10` (chips de bloco).
- **Tipo:** headline da faixa 28/800, title 20, body 17, callout 15,
  footnote 13, caption 12 (labels uppercase com tracking 0.8–1.1).
- **Sheets:** edição e "escolha do Inbox" sobem de baixo (`animationType="slide"`)
  com overlay `rgba(68,64,60,0.45)`; cancelar fecha por swipe/gesto do SO.
- **Micro-interação (uma só):** `expo-haptics` `selectionAsync` ao concluir,
  promover e marcar saída — estado físico, não decoração.
- **Statubar:** cada aba declara `StatusBar style="light"` via `ScreenShell`; o
  login também (faixa verde). O `expo-status-bar` aplica o **último montado**,
  então quem tiver faixa colorida precisa declarar o seu — sem isso, trocar de
  tela deixa a barra ilegível.
- **Anti-padrões banidos aqui:** emoji como ícone, `border-left` colorida,
  texto em gradiente (o gradiente é só de fundo), cards de mesmo tamanho como
  estrutura, kicker acima de título, `fontFamily: 'monospace'` como fantasia
  (Timer usa `fontVariant: tabular-nums`), cor literal fora do `theme.ts`.

## Auth local (`app/auth.tsx`, `src/lib/password.ts`, tabelas `users` + `meta`)

Login completo com e-mail + senha, sem backend: senha guardada como
SHA-256 com salt de 16 bytes (`expo-crypto`), e-mail normalizado em minúsculas,
unicidade garantida em código (`EMAIL_TAKEN`). Sessão = `active_user_id` na
tabela `meta` + pub/sub em `src/lib/session.ts`. Erros inline no formulário
(nunca só Alert), olho mostra/esconde senha, CTA com loading. Troca de perfil
na Revisão. A tela de login abre com a faixa verde do Inbox e o logo em
`tone="band"` — o app já começa falando a língua de cor das abas. Limite
honesto: sem comparação em tempo constante nem bloqueio contra força bruta —
fora do escopo do MVP local.

## Notas de implementação

- `@expo/vector-icons` (Ionicons) é dependência oficial; **não** usar
  `React.ComponentProps<typeof Ionicons>['name']` — instanciar esse genérico
  sobre o union de 1357 glifos trava o `tsc` (TS 6). Usar o union local
  `IconName` de `src/lib/icons.ts` (só para mapas; em JSX o literal já é
  conferido pelo próprio pacote).
- Nomes válidos checados no glyphmap: `file-tray`/`file-tray-outline` (não
  `tray`), `checkmark` (não `check`), `add-circle-outline`, `create-outline`,
  `pricetags-outline`, `partly-sunny`, `moon`, `flame`, `flag`.
- `expo-linear-gradient` é a única dependência nova desta revisão (faixa das
  telas e do login). Nativa do Expo, compila para web e Android.
