# HANDOFF — Minha Rotina

Sessão (28/09/2026, parte 2): login completo com e-mail + senha (`d00bd47`,
a commitar). Antes: bug promote, paleta alegre, logo, primeira tela, perfis
(`ab6a14a`→`accf27d`).

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
