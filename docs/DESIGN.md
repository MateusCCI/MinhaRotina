# DESIGN.md — Minha Rotina

Mundo visual: **Papel & Aurora**. Tema claro, amigável, gramática iOS para um
app Operate (o visitante completa tarefas; a ferramenta some na tarefa).

## Paleta por contexto (revisão de 29/09, feedback do professor)

O professor leu a paleta anterior como "4 cores" e pediu mais cor, mais ícones
e mais vida. A resposta **não** foi espalhar cor: foi dar a cada contexto a
sua própria família, com regra fixa de uso. E, na revisão seguinte, ficou
claro que a primeira tela continuava monocromática — o que a matiz é que
precisa de **regra para aparecer**, não só existir.

### As três respostas ao feedback

| Pergunta do professor | Resposta no design |
|---|---|
| "só 4 cores?" | A paleta deixou de ser uma lista e virou um **sistema: 4 famílias de contexto + 6 matizes de categoria + 1 tinta de marca**. Cada cor responde a uma pergunta — *em que parte da rotina eu estou?* e *do que é essa tarefa?* |
| "coloque mais cores" | Faixa em gradiente no topo de cada aba, StatCards que acendem quando um objetivo é batido, as **6 categorias sempre visíveis** e um bloco colorido no empty state. Nada de cor decorativa. |
| "use ícones" | `src/lib/icons.ts` — um ícone por categoria, por tela, por estatística, por ação e **por estado de prazo**. Ícone nomeia contexto, nunca decora. |

### Regra 1 — cor por contexto (a faixa)

1. **A faixa colorida** (`band`) abre a tela e carrega o título — identidade.
   O corpo volta ao papel claro; cards brancos sobre ele.
2. **`base`** tinta ícones, números, valores ativos e o botão primário da tela.
3. **`soft`** é a versão translúcida para chips, empty states e faixas de destaque.
4. **`primary` (Verde Folha)** continua sendo a ação primária do app — é a marca,
   e por isso não muda com a tela.

| Tela | Família | `base` | `deep` (fim do gradiente) |
|---|---|---|---|
| Hoje (Inbox + prioridades) | verde → teal | `#15803D` | `#0E7490` |
| Saída | rosa → violeta | `#BE185D` | `#7C3AED` |
| Timer | âmbar → laranja | `#B45309` | `#C2410C` |
| Revisão | teal → esmeralda | `#0F766E` | `#065F46` |

Os dois tons de cada faixa são **escuros de propósito**: é o que garante
contraste ≥ 4.5:1 com o texto branco do topo até o fim do gradiente.

### Regra 2 — cor por zona (dentro da tela do dia)

Com Inbox e Hoje fundidos em uma tela, uma família só não bastava. As duas
zonas do mesmo scroll usam famílias diferentes:

- **Prioridades de hoje** — família `hoje` (azul). É a parte que exige foco.
- **Inbox despejado** — família `inbox` (verde). É a parte que despeja.

A faixa do topo é verde (a marca do app); o azul entra na primeira vez que o
olho desce para a zona de foco. É por isso que a primeira tela mostra **verde
+ azul + as 6 categorias** sem virar uma competição de cores.

### Regra 3 — a cor que significa algo aparece (a correção importante)

A primeira versão do redesign **não resolveu** a queixa das "4 cores": os
chips de categoria existiam, mas nasciam cinza e só ganhavam cor depois do
toque. Resultado: a tela abria branco + verde + cinza, exatamente a complaint.

**Regra:** toda cor que carrega informação que o usuário age sobre aparece
**antes** do toque. Hoje isso significa os 6 chips de categoria já tingidos
(selecionado ganha borda na tinta da categoria) e o empty state em bloco
colorido. Cor que não informa nada não entra — é o oposto do que foi pedido.

## Cena física (decide claro vs. escuro)

Pessoa com TDAH confere a rotina no celular durante o dia, com uma mão, sob luz
ambiente clara. Por isso: fundo claro quente + cards brancos — nunca o inverso.

## Direction contract

- **THESIS:** rotina que acolhe em vez de cobrar. Uma ideia por vez, foco máximo
  de 3, progresso celebrado. Recusa o arranjo padrão da categoria (dark
  "hacker" com gold neon + emoji como ícone).
- **OWN-WORLD:** papel quente `#F4F2EC` com cards brancos de sombra suave
  (offset + blur, nunca halo); faixa em gradiente no topo de cada aba; quatro
  famílias de cor por contexto; pills pastéis por categoria com texto escuro da
  mesma matiz; tipografia do sistema; ícones Ionicons de traço único (nunca
  emoji como ícone); cópia em português que ensina e encoraja.
- **STORY:** o usuário abre o app e vê o dia inteiro: despeja uma ideia sem
  filtro, promove até 3 prioridades, conclui, foca em ciclos de 25min e fecha
  revisando a semana com carinho. Tudo isso cabe em quatro abas, e a primeira
  é o funil completo.
- **FIRST VIEWPORT:** cada aba abre com faixa colorida (chip de ícone + rótulo
  + título + estado) e, quando há número, três StatCards translúcidos sobre a
  faixa. Na aba Hoje, as três zonas (prioridades, captura, Inbox) começam logo
  abaixo da faixa, sobre o papel.
- **FORM:** iOS grouped lists + tab bar branca com 4 seções (seções, nunca
  ações) que acende na tinta da aba; bottom-sheet para tarefas focadas (editar,
  escolher do Inbox) e para as ações da linha, sem modal central. Modo:
  Operate, estratégia Contida por contexto.
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

## Forma das telas (4 abas, funil em uma tela só)

A decisão do usuário: **Inbox e Hoje viraram uma tela**. O funil inteiro —
capturar, promover, executar — acontece em uma rolagem, sem pular de aba.
Cinco abas viraram quatro. Isso é mudança de tela, não de banco:
`inbox_items` e `hoje_items` já eram tabelas separadas.

- **Hoje** — três zonas na mesma `ScrollView`:
  1. `Prioridades de hoje` (0/3, família azul) no topo: os itens de hoje com
     checkbox e a barra de progresso; empty tracejado explicando o próximo passo.
  2. `Captura` no meio: o campo de despejo com prazo e categoria.
  3. `Inbox` (família verde) embaixo: a lista com o lápis por linha e o
     banner de limpa rápida a partir de 5 ideias.
  A faixa do topo traz os três StatCards (prioridades, no inbox, concluído) e
  o badge da aba conta o Inbox — é o que ainda espera virar prioridade.
- **Saída** — checklist do ritual e o card do
  **lembrete de saída** (`src/lib/alarme.ts`): escolhe-se a hora de sair e o
  celular avisa 15 min antes. O agendamento anterior é cancelado a cada
  mudança e o horário fica na tabela `meta` (chave/valor, sem migração).
  **Limite honesto:** notificação local agendada não lê o banco no instante
  em que dispara, então a contagem de pendências vai congelada no momento do
  agendamento. A condição real exigiria tarefa de background, fora do escopo
  — e o rodapé do card diz isso para o usuário.
- **Timer** — Pomodoro de 25 min com dois StatCards (ciclo e restante) e a
  folha de fim de bloco (`BlocoConcluido`), que só abre **no fim do ciclo**
  (RF07): mostra `x/3 concluídas — NN%` e oferece as prioridades em aberto.
  Não oferece uma 4ª — o limite de 3 é o princípio do produto, e o fim do
  bloco convida a continuar o que já foi escolhido.
- **Revisão** — hero do % do dia, resumo da semana, ajuste escrito, perfil.

### Revelação progressiva: um lápis, e ele edita tudo

Na aba Hoje, a linha do Inbox carrega **um só botão: o lápis**, que abre a
folha `RowActions` com as três ações (promover, editar, excluir). Ele fica na
**mesma linha dos pills**, encostado à direita: o item ocupa dois blocos (texto
e metadados) em vez de três, e o olho percorre o cartão numa varredura só. A
linha de metadados existe mesmo quando o item não tem prazo nem categoria —
senão o lápis pularia de lugar conforme a lista muda, e alvo que se move é
alvo que se erra. A explicação do que o lápis faz aparece **uma vez**, sob o
cabeçalho da zona, e não repetida em cada linha.

Na aba Saída a mesma ideia foi um passo adiante: as linhas **não têm botão
nenhum** — só checkbox e texto — e existe **um único lápis na tela**, que abre
a folha `EditarChecklist` com todos os itens de uma vez, cada um em campo
próprio já preenchido (renomeia no lugar, grava ao sair do campo). Apagar
continua por linha, porque apagar é sempre decisão sobre **um** item, e não
sobre a lista inteira.

### Por que as linhas da Saída ficaram sem botões

Cada linha do Inbox carrega **um só botão: o lápis**. Ele abre a folha
`RowActions` com as três ações (promover, editar, excluir), cada uma com
ícone, rótulo e uma linha de apoio que explica o efeito. Com três botões em
cada linha, a lista vira um mural de controles e a hierarquia se perde — o
olho vai para o botão, não para a tarefa. A folha também **avisa em texto**
quando o foco já está cheio (3/3), em vez de deixar o usuário descobrir só
depois do erro. Mesmo padrão vale na linha do Hoje: checkbox à esquerda,
remover à direita, uma ação por elemento.

A régua que guia os dois casos: **botão em linha é para ação frequente;
ação de manutenção fica atrás de um único ponto de entrada.** Marcar o que
já está na tela acontece o dia inteiro; renomear e excluir são raros. Por
isso o checkbox fica exposto e o lápis é um só.

## Ícones (`src/lib/icons.ts`)

Um ícone por contexto, nunca decorativo:

- **Categorias** — Trabalho `briefcase`, Estudo `school`, Família `people`,
  Casa `home`, Mercado `cart`, Outros `pricetags`.
- **Telas** — Hoje `sunny`, Timer `timer`/`flame`, Saída `exit`,
  Revisão `bar-chart`.
- **Estatísticas** — `file-tray` (inbox), `flag` (prioridades),
  `checkmark-done` (concluído), `bag-check-outline` (conferidos),
  `time-outline` (prazo/horário), `sparkles` (ação de cuidado).
- **Ações** — `pencil-outline` (menu da linha), `arrow-up-circle` (promover),
  `create-outline` (editar), `trash-outline` (excluir), `add`,
  `checkmark`, `arrow-forward`, `refresh-outline`.
- **Prazo por estado** — `alert-circle` (atrasado), `time` (vence hoje),
  `calendar-outline` (amanhã/futuro). Cor e ícone andam juntos: a cor é o
  reforço, o glifo é a informação. Vermelho vs. verde é justamente o par
  que ~8% dos homens não distinguem (deuteranopia), então nunca é a única pista.

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

- **`ScreenShell`** — casca única das 4 abas (e da faixa do login): gradiente,
  chip de ícone, `StatusBar` claro, corpo sobre o papel, `footer` opcional.
  Uma tela só de cabeçalho significa que nenhuma aba diverge da outra.
- **`StatCard`** — ícone + número + rótulo dentro da faixa, em fundo
  translúcido. O número responde "quanto", o rótulo "quanto de quê", e o ícone
  dispensa ler o rótulo. `tone="positive"` inverte o card (fundo branco, tinta
  verde) para marcar um objetivo batido — foco cheio, dia em 100% — sem
  inventar uma cor nova.
- **`RowActions`** — folha de ações do item (bottom sheet), com `statusBarTranslucent`
  para o conteúdo não ficar sob a barra do sistema. É onde mora a revelação
  progressiva: a linha mostra o lápis, a folha mostra as opções.
- **Alvos de toque:** mínimo 44pt (chips, botões de ícone, itens de lista);
  CTAs primários com 52–54pt.
- **Raios:** `lg 20` (cards), `md 14` (botões/inputs), `pill 999` (chips),
  `sm 10` (chips de bloco).
- **Tipo:** headline da faixa 28/800, title 20, body 17, callout 15,
  footnote 13, caption 12 (labels uppercase com tracking 0.8–1.1).
- **Sheets:** edição, ações da linha e "escolha do Inbox" sobem de baixo
  (`animationType="slide"`) com overlay `rgba(68,64,60,0.45)` e
  `statusBarTranslucent`; cancelar fecha por toque no fundo, swipe/gesto do SO.
- **Avisos:** `src/lib/notify.ts` (`notify` / `confirmDestructive`) em vez de
  `Alert` cru. No Android/iOS é o diálogo nativo; no web cai no diálogo do
  navegador. Motivo: o `Alert` do react-native-web é **no-op silencioso** — o
  navegador é o ambiente de teste e todo aviso sumia. Visibilidade de erro
  vale mais que estética. Evolução natural: um toast no app, no mesmo padrão
  pub/sub de `inboxCount.ts`.
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

## Cronômetro (o relógio que quase mentia)

`useTimer` modela o tempo com dois valores: `baseRef` (já consumido, congelado
durante a pausa) e `startRef` (início do segmento atual). O decorrido é
`base + (agora - início)`, calculado **fora** do acumulador.

A primeira versão somava dentro do acumulador — `prev.elapsed + (Date.now()
- startRef.current)` —, o que **conta o tempo duas vezes**: a cada quadro o
decorado inteiro desde o início voltava a ser somado por cima do já
acumulado. O relógio ficava quadrático e acelerava sem parar; 25 minutos
acabavam em segundos. Passou anos de "funcionando" porque nenhum teste olhou
o relógio por tempo suficiente para o desvio aparecer. **A regra que evita a
reincidência:** nunca guarde o valor calculado dentro da ref que o produziu —
a conta tem que ser derivada, não acumulada. Junto disso: `reset` não pode
disparar `onComplete` (zerar não é terminar), e o `raf` precisa parar quando o
tempo chega a zero, senão o callback de fim dispara a cada quadro.

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
