# HANDOFF — Minha Rotina

Sessão encerrada em: 29/09/2026 (3º turno). Ponto de partida da próxima
sessão — ler só as duas primeiras seções para retomar sem contexto externo.

## Onde paramos (29/09, 6º turno) — lápis do Inbox na linha dos pills

O usuário pediu o lápis do Inbox na mesma linha do lembrete. Feito
(`d8d2273`): o item passou de três linhas (texto, pills, botão) para duas, com
o lápis encostado à direita dos pills. A dica do que o lápis faz saiu de cada
linha (viravam três cópias da mesma frase) e ficou uma, sob o cabeçalho da
zona.

**Detalhe que importa para quem mexer nisso:** a linha de metadados é
renderizada **sempre**, mesmo sem prazo e sem categoria. Sem isso o lápis
mudaria de lugar de um item para outro, e alvo que se move é alvo que se erra.

## Onde paramos (29/09, 5º turno) — um lápis só na Saída

O usuário pediu para tirar o lápis de todas as opções da aba Saída e deixar
**um** que edita tudo. Feito no commit `a44293f`: as linhas ficaram só com
checkbox + texto, e existe um único *Editar tudo* que abre a folha
`EditarChecklist` com todos os itens em campo próprio (renomeia no lugar).

**Assumi uma coisa e avisei:** tirei a lixeira por linha também. Deixar só a
lixeira enquanto o lápis vai para a folha ficaria torto — e apagar é decisão
sobre **um** item, então continua por linha, agora dentro da folha. Se quiser
a lixeira de volta na lista, é uma linha de mudança.

**A régua que saiu disso** (registrada no DESIGN.md): botão em linha é para
ação frequente; ação de manutenção fica atrás de um único ponto de entrada.
Marcar o que já está na tela acontece o dia inteiro; renomear e excluir são
raros.

## Onde paramos (29/09, 4º turno) — alarme de saída + aviso de fim de bloco

O usuário pediu "atualizar o que tiver desatualizado". Isso revelou um
problema de integridade no trabalho ABNT: a seção 5 declarava **CA-PI05 e
CA-PI06 como "Aprovado"**, e nada dos dois existia (`onComplete: () => {}`,
`expo-notifications` sem nenhuma chamada). O usuário escolheu **implementar o
que faltava** em vez de rebaixar os critérios.

| Commit | Conteúdo |
|---|---|
| `d2192c5` | `alarme.ts` (lembrete de saída 15 min antes), `BlocoConcluido.tsx` (RF07), e o **`useTimer` reescrito** — o relógio era quadrático |

**Bug grave e pré-existente, encontrado ao ligar o `onComplete`:** o timer
somava o tempo duas vezes (`prev.elapsed + (Date.now() - startRef.current)`),
o que fazia o relógio acelerar sem parar — 25 min acabavam em segundos. Nenhum
testo pegou porque ninguém olhou o relógio por tempo suficiente. Só apareceu
medindo tempo de parede contra relógio. Ver `docs/DESIGN.md`, seção
"Cronômetro".

**O que ficou parcial (e o trabalho ABNT diz isso):** CA-PI06 é **parcial** —
a notificação local não consegue ler o banco no instante em que dispara, então
a contagem de pendências vai congelada no agendamento. CA-PI07 e a demo de 10
min estão marcados como **pendentes de validação no aparelho Android**, porque
o ambiente de rede de teste bloqueava o celular.

### Onde paramos (29/09, 3º turno) — **4 abas, funil em uma tela**

O usuário, vendo o redesign, pediu três coisas: (1) fundir Inbox e Hoje numa
tela só, (2) mais cor que signifique algo na primeira tela, (3) **um único
ícone de lápis** por linha, em vez de vários botões, para não poluir o layout.
Fechado com: fusão das telas, categorias sempre coloridas, folha de ações, e
`notify()` no lugar de `Alert`.

**Commits deste turno** (branch `main`):

| Commit | Conteúdo |
|---|---|
| `fa17827` | Fusão Inbox + Hoje (4 abas), `RowActions` (folha de ações), categorias coloridas de cara, `StatCard tone='positive'`, `notify.ts` no lugar de `Alert` |

Antes disso, no 2º turno: `597eaf1` (paleta por contexto), `2625f4c`
(`ScreenShell`/`StatCard` + Inbox redesenhado), `eb42ef6` (as 5 telas na casca
nova), `cad7e8d` (tab bar por tinta), `cdef02a` (rótulos de contexto errados,
achados na inspeção visual no navegador).

Referências: `v2-designer-por-contexto` (estado de 5 abas) e
`designer-antigo` / `v1-designer-simples` (a v1 de 4 cores, para comparação
com o professor).

### O que mudou de verdade

- **`app/(tabs)/hoje.tsx`** reescrito: três zonas na mesma `ScrollView` —
  Prioridades (0/3, família **azul**) → captura → Inbox (família **verde**).
  `app/(tabs)/inbox.tsx` e `app/index.tsx` removidos. **Sem mudança de banco**:
  `inbox_items` e `hoje_items` já eram separadas.
- **`src/components/RowActions.tsx`** (novo): folha de ações com ícone, rótulo
  e linha de apoio. A linha do Inbox carrega só o lápis; promover, editar e
  excluir saem dali. A folha avisa **em texto** quando o foco está cheio (3/3).
- **Categorias sempre visíveis**: os 6 chips nascem com a tinta da categoria
  (selecionado ganha borda na tinta). Antes ficavam cinza até o toque — era
  exatamente a queixa das "4 cores" na primeira tela.
- **`src/lib/notify.ts`** (novo): o `Alert` do react-native-web é **no-op
  silencioso**; `notify`/`confirmDestructive` usam o diálogo nativo no
  Android/iOS e o do navegador no web. Migrados os 15 `Alert.alert`.
- **`dueLabel`** passou a devolver `tone` (`overdue`/`today`/`later`) e
  `DUE_ICONS` dá um glifo por estado — cor não pode ser a única pista
  (deuteranopia).

### Armadilhas desta sessão

- **`git add -A src` pega `src/lib/notify.ts`.** O `fa17827` acabou juntando a
  fusão e o `notify` num commit só porque o `add` cobriu a pasta inteira. Não
  consegui separar sem `git add -p` (interativo); preferi corrigir a mensagem
  do commit a fingir que tinha separado.
- **Editor: `oldString` curto casa na occurrence errada.** Um `} as const;`
  isolado desmontou o `cardShadow()` do `theme.ts` e o `tsc` acusou
  `Modifiers cannot appear here`. Ao editar, sempre leve linhas vizinhas no
  `oldString`.
- **`StyleSheet.absoluteFillObject` não existe** nesta versão do RN — use
  `StyleSheet.absoluteFill` ou posicione explicitamente.

### Validação

`npm run typecheck` limpo · `npx eslint src/ hooks/ app/ App.tsx --ext .ts,.tsx`
0 erros 0 warnings · `npx expo export --platform web` compila · **Chromium
headless**: cadastro → 4 capturas com categoria → promover 3 → concluir 1 →
limite de foco avisa → editar abre sheet → exclusão confirma → varre as 4 abas,
zero `pageerror`.

**Falta validação humana no aparelho** (contraste real, altura da faixa em tela
pequena, se as duas zonas do Hoje se distinguem). O roteiro
`docs/TESTES-MANUAIS.md` foi reescrito depois para a estrutura de 4 telas
(15 cenários) — a versão de 10 cenários citada aqui não existe mais.

## Onde paramos (29/09, 2º turno)

**Push para o GitHub PENDENTE** — `git push -u origin main` retorna **403**
porque a conta atual do `gh` (`msantosgame-prog`) não tem escrita em
`MateusCCI/MinhaRotina`. O usuário escolheu **trocar o login do gh** para a
conta dona do repo. Falta ele rodar `gh auth login` no terminal dele e avisar;
aí é só dar o push. Branch e tag locais (`designer-antigo`,
`v1-designer-simples`, `v2-designer-por-contexto`) só vão para o remoto com
push explícito.

> **Reconferido no 4º turno:** `gh auth status` **continua** em
> `msantosgame-prog` (escopos `repo`, `read:org`, `workflow`, `gist` — o token
> tem permissão, falta é ser da conta certa). `origin/main` continua com
> 1 commit só (`bd41a42`). Nada foi enviado em nenhum turno. Para destravar:
> `gh auth logout && gh auth login` entrando como `MateusCCI`.

### Estado do git (2º turno)

Branch local **`main`** — renomeada de `master` no 1º turno. O push é
`git push -u origin main`.

Remoto em HTTPS (`https://github.com/MateusCCI/MinhaRotina.git`); **SSH dá
`Permission denied` nesta máquina**, então não adianta tentar
`git@github.com:MateusCCI/MinhaRotina.git`.

Remoto tem só `main` com 1 commit (`bd41a42` Initial), já incorporado por
merge `--allow-unrelated-histories` (README resolvido com `--ours`, o nosso é
superset).

**O hash do merge é `2421859`.** Antes de corrigir o autor ele era `068bebf`;
a correção de autoria (de `msantosgame-prog` para `Mateus Outubro2020`)
reescreveu o commit e mudou o hash. Se algum texto antigo citar `068bebf`, ele
está desatualizado — o parágrafo acima é a única fonte.

**Não commitar/pushar:** `RELATORIO-TAILSCALE.md` (untracked, não é do projeto)
nem artefatos Tailscale (`tailscale.tgz`, scripts, `tailscale_1.102.4_amd64/`),
nem `~`.

## Próximo passo sugerido

1. **Rodar no aparelho Android** — é o que fecha CA-PI07 e a demo de 10 min,
   e é o único jeito de confirmar que a notificação de saída chega com o app
   fechado. Tentar hotspot invertido ou `npx expo start --tunnel` (a rede
   institucional bloqueou o teste anterior).
2. **Rodar `docs/TESTES-MANUAIS.md`** (15 cenários). O 11 mede o relógio: anote
   o tempo, espere 30 s, leia de novo.
3. Confirmar `gh auth status` com a conta certa → `git push -u origin main`.
4. Depois: DER atualizado (agora com 9 tabelas, incluindo `users`, `meta` e a
   chave `alarme_saida`) + slide M3.

## Sessões anteriores (resumo)

- 29/09 p2: paleta por contexto, faixa em gradiente, 5 telas redesenhadas,
  tab bar por tinta, rótulos de contexto corrigidos.
- 28/09 p3: Saída editável (`52442cb`), repetir senha (`761c472`), README
  sincronizado, `docs/TESTES-MANUAIS.md` (`aa7ef02`).
- 28/09 p2: login e-mail+senha com SHA-256+salt (`1270cfd`).
- 28/09 p1: fix perda de dado no promote (`ab6a14a`), paleta alegre em teste,
  logo Sol Nascente, Inbox enriquecido (`ebd21ea`, `7558472`, `accf27d`).
- 26/09: redesign claro iOS; 25/09: tema dark + 5 tabs (ver histórico abaixo).

---

Sessão (28/09/2026, parte 2): login completo com e-mail + senha (`1270cfd`).
Antes: bug promote, paleta alegre, logo, primeira tela, perfis
(`ab6a14a`→`accf27d`). Depois: Saída editável (`52442cb`), repetir senha
(`761c472`), README sincronizado, roteiro de testes manuais.

## Login completo (e-mail + senha)

- Nova dep `expo-crypto`; `src/lib/password.ts` (funções puras: `hashPassword`,
  `verifyPassword`, `isValidEmail`, `normalizeEmail`).
- `users` ganha `email/salt/password_hash` (migration via `ensureColumn`);
  `createUserWithCredentials` recusa duplicado (`EMAIL_TAKEN`).
- `app/auth.tsx` reescrito: modos entrar/criar, validação inline por campo,
  mostrar/esconder senha, CTA com loading. Sessão e troca de perfil inalterados.
- Validação: `tsc` + `eslint` limpos, `expo export --platform web` compila.
- Perfis antigos (só nome, sem e-mail) não entram pelo login novo — dado de
  dev; limpar com Clear site data (web) ou reinstalar (celular).

## Sessão 28/09, parte 3 (`52442cb`, `761c472` + README sincronizado)

- **Saída editável:** `insert/update/deleteSaidaItem` no banco,
  `addItem/renameItem/removeItem` no `useSaida`, modal criar/editar, botões
  lápis/lixeira por linha (excluir com confirmação), botão + no header.
- **Repetir senha** no cadastro (`confirmPassword`, checagem de coincidência
  inline, limpa as duas ao trocar de modo).
- **README sincronizado** com a realidade: conta local, Saída CRUD, Timer
  persistente, Revisão sem humor/sono, estrutura e tabelas atuais; removido
  `expo-notifications` (não usado no código).
- Roteiro de validação humana em `docs/TESTES-MANUAIS.md` (10 cenários —
  serve de base aos testes do M3).

## Sessão 28/09 — o que foi feito

1. **Bug crítico do "Virar prioridade":** `promoteToHoje` inseria em `hoje_items` e deletava a linha do inbox — mas `getHojeItems` fazia `JOIN` com o inbox. Resultado: item sumia das duas telas (perda de dado). Fix: `hoje_items` agora tem `content/due_date/category` próprios (migration via `ensureColumn` + limpeza de órfãos); `insertHojeItem` copia os campos; `getHojeItems` e `resetHojeForNewDay` sem JOIN.
2. **Paleta alegre em teste:** `primary #15803D` (Verde Folha), `text #44403C` (Marrom Café); Âmbar vira acento (warning/prazos); Família em lima; token novo `overlay`. Detalhes em `docs/DESIGN.md`.
3. **Logo "Sol Nascente"** (`src/components/Logo.tsx`, layouts `stack`/`row` + slogan).
4. **Primeira tela (Inbox) enriquecida p/ professor:** Logo + saudação por horário + data pt-BR + card "Resumo do dia" (inbox/hoje x/3/% com `ProgressBar` reutilizada, `DaySummary` tipado, `useMemo`, helpers puros `greetingFor`/`todayLabel`).
5. **Login/cadastro local:** tabelas `users` + `meta(active_user_id)`; `src/lib/session.ts` (pub/sub); `app/auth.tsx` (entrar por perfil / cadastrar nome); `App.tsx` condiciona `Auth` × `Main`; Revisão tem seção Perfil + Trocar.
6. Validação: `tsc` limpo, `eslint` limpo, `expo export --platform web` compila.

## Pendente p/ próxima

- Validação humana: testar promote (Inbox→Hoje), cadastro/login/trocar perfil, paleta alegre no aparelho.
- Celular pulado (rede institucional com isolamento; usar hotspot invertido ou `--tunnel`).
- Quota: Hoje mostra dia em UTC (SQLite `CURRENT_TIMESTAMP`); perto da meia-noite local pode virar o dia às 21h. Aceito por ora.

---

Sessão (26/09/2026, continuação): redesign claro iOS "Papel & Âmbar". Ver seção nova no topo; abaixo, o handoff da sessão anterior (25/09).

## Sessão 26/09 — redesign claro iOS (não commitado ainda)

Decisão do usuário: **"Redesign claro iOS"** (trocar o dark Neo Kinpaku por tema claro estilo Lovable/iOS).
Contrato do mundo novo em `docs/DESIGN.md` (ler antes de mexer em UI).

- `src/lib/theme.ts` — reescrito: bg `#F4F2EC`, surface `#FFFFFF`, tinta única `primary #B45309`, sucesso `#0F766E`, perigo `#DC2626`; + `radius`, `spacing`, `type`, `cardShadow()`. Nomes antigos (`gold`, `patina`…) removidos.
- `src/lib/date.ts` — `CATEGORY_COLORS` virou pastel (fundo) + novo `CATEGORY_TEXT` (texto escuro da matiz).
- `App.tsx` — tab bar branca iOS com Ionicons (outline/cheio), `SafeAreaProvider`, `StatusBar style="dark"`.
- 5 telas + 4 componentes reescritos no mundo novo: large titles, bottom-sheets, empty states que ensinam, haptic (`expo-haptics`) em concluir/promover/marcar saída, zero emoji como ícone.
- Nova dep: `@expo/vector-icons` (oficial Expo). **Armadilha registrada no DESIGN.md:** não usar `ComponentProps<typeof Ionicons>['name']` (trava o tsc); usar union local `IconName`. Nomes válidos: `file-tray-*` (não `tray`), `checkmark` (não `check`).
- Validação: `tsc --noEmit` limpo, `eslint` limpo, `expo export --platform web` compila.
- Detector impeccable: pulado (plataforma nativa — o detector lê HTML/CSS; vale o craft-floor + revisão manual).
- Falta: validação humana no aparelho (5 telas), revisar contraste/copys com um olhar fresco.

---

Sessão encerrada em: 25/09/2026. Este documento é o ponto de partida da próxima sessão — quem continuar lê **só isto** para retomar sem contexto externo.

## Objetivo da sessão

Implementar as melhorias pedidas na ordem: (1) skill `impeccable` no engsoft, (2) tema escuro Neo Kinpaku no MinhaRotina, (3) as 5 telas na navegação, (4) edição posterior de itens do Inbox, (5) banner + contador de limpeza do Inbox. **Tudo concluído.**

## Concluído (commits do repo `master`)

| Commit | Conteúdo |
|---|---|
| `31b3118` | Timer persistido em SQLite (tabela `timer_state`, funciona no Android) + lint zerado |
| `d5871c5` | Prazos e categorias no Inbox, badges, filtro por categoria no Hoje |
| `2ffb041` | Tema Neo Kinpaku, 5 tabs, modal de edição do Inbox, banner + contador de limpeza |

Detalhes do `2ffb041` (lote mais recente):

- `src/lib/theme.ts` — tokens oficiais do sistema **Neo Kinpaku** (skill impeccable), convertidos OKLCH→hex:
  - `bg #080706`, `surface #141210`, `surfaceAlt #1D1A15`, bordas gold-hairline
  - `gold #FFBA00` (CTA, com texto `onGold #0B0A08`), `patina #0FB6AC` (sucesso), `danger #FF5F56`, `warning #FFBD2E`
  - `statusColor(pct)` centraliza as cores de progresso (≥67 patina, ≥34 warning, senão danger)
- `App.tsx` — 5 tabs (Inbox, Hoje, Saída, Timer, Revisão), tab bar escura, badge dourado com a contagem do Inbox
- `app/(tabs)/inbox.tsx` — banner "Hora de limpar o Inbox" quando **≥ 5 itens** + modal de edição (conteúdo, prazo, categoria)
- `src/lib/inboxCount.ts` — pub/sub leve (padrão observer): `useInbox` publica a contagem, `App.tsx` assina para o badge
- `hooks/useInbox.ts` — novo `updateItem(id, content, dueDate?, category?)`
- `src/lib/database.ts` — novo `updateInboxItem(id, content, dueDate, category)` (UPDATE nas 3 colunas)
- Todas as telas/componentes migrados para tokens; **zero cor hardcoded** no código (grep verificado)
- Removido `app/_layout.tsx` — código morto, duplicata antiga do App.tsx, não importado por ninguém (projeto não usa expo-router)

## Fora do repo (engsoft)

Skill `impeccable` instalada em `/home/pam/Projetos/10.10-EngSoft/.opencode/skills/impeccable/` (SKILL.md + reference/ + scripts/) e registrada no `AGENTS.md` e `docs/BOOT.md` do engsoft. **Não commitada** — o engsoft está dentro do repo git pai (`Projetos`) e só se commita se o usuário pedir.

## Validação (rodar a cada mudança)

```bash
npm run typecheck                          # tsc --noEmit — limpo
npx eslint src/ hooks/ app/ App.tsx --ext .ts,.tsx   # 0 erros
```

Teste manual na web: `npm start` → navegador → `Ctrl+Shift+R` **duas vezes** (limitação do OPFS: só uma aba acessa o SQLite; HMR pode quebrar). Não afeta Android.

## Restrições e decisões firmadas

- **Regra do usuário:** commit antes de cada alteração; commits separados por passo.
- Não mexer em `metro.config.js` (wasm); não commitar artefatos Tailscale (`.tgz`, scripts, `tailscale_*/`) nem `~`.
- Limite do Hoje: 3 itens (`insertHojeItem` lança `MAX_ITEMS`).
- Banner de limpeza: limite **5 itens** (heurística — ajustável na constante `CLEANUP_LIMIT` em `inbox.tsx`).
- `CURRENT_TIMESTAMP` do SQLite é UTC.
- No web, expo-sqlite usa OPFS (uma aba só).
- Cores das categorias em fundo escuro: Trabalho `#7AA2FF`, Estudo `#C084FC`, Família `#4ADE80`, Casa `#FB923C`, Mercado `#F472B6`, Outros `#A8A29E`.

## Mapa de arquivos

- `App.tsx` — entrypoint (`index.ts` → App); navegação + tema + badge
- `src/lib/theme.ts` — tokens (sempre referenciar, nunca cor literal)
- `src/lib/database.ts` — singleton SQLite; migrações defensivas via `ensureColumn`
- `src/lib/date.ts` — `toLocalDateString`, `dueLabel`, `CATEGORIES`, `CATEGORY_COLORS`, `DUE_OPTIONS`
- `src/lib/inboxCount.ts` — pub/sub da contagem do inbox
- `hooks/` — `useInbox`, `useHoje`, `useSaida`, `useTimer` (persistente), `useAjustes` se existir
- `src/components/` — `CaptureInput` (chips prazo/categoria), `InboxItem` (badges + editar), `HojeItem`, `ProgressBar`
- `app/(tabs)/` — as 5 telas; `saida/`, `timer/`, `revisao/` em subpastas

## Próximos passos (sugestões)

1. **Validação humana:** rodar o app e revisar o tema nas 5 telas (contraste, chips, banner, modal de edição, badge).
2. **Sync com docs:** o `docs/STATUS.md` está defasado (08/09, ainda diz "próximo passo S1") — atualizar com a situação real ou apontar para este HANDOFF.
3. Melhorias possíveis: animação do banner, limite de limpeza configurável, testes unitários de `date.ts`/`useInbox`, revisão com a skill `impeccable` para polish visual.
4. Tudo o que a EAP cobra nas sprints S1-S4 já está implementado no código — falta conferir M2/M3 da EAP (notificações, DER, testes manuais, slide).

## Como continuar

1. Ler este arquivo (e o `README.md` para visão geral do produto)
2. Rodar `typecheck` + `lint` para confirmar estado limpo
3. Escolher um dos próximos passos acima e **commitar antes** de qualquer alteração
