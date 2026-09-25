# HANDOFF — Minha Rotina

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
