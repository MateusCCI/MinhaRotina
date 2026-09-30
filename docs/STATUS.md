# STATUS — Minha Rotina (foto da situação)

Atualizado em: 29/09/2026 (3º turno). Duas frentes concluídas hoje: o **redesign visual** a partir do feedback do professor ("designer muito simples", "das 4 cores da paleta", "use ícones, mais cores, mais vida") e, em seguida, a **fusão do Inbox com o Hoje numa tela só**, pedida pelo usuário. Detalhe técnico em `docs/DESIGN.md` e `docs/HANDOFF.md`.

Este arquivo diz onde o projeto está e qual é o próximo passo, para qualquer sessão continuar sem contexto externo.

> **Sessão a sessão:** o detalhamento técnico (commits, tokens, comandos de validação) está no **`docs/HANDOFF.md`** — leia-o antes de codar.

## Onde estamos

**4 abas** (eram 5): Hoje (Inbox + prioridades fundidos em uma tela), Saída, Timer e Revisão. Código validado com `tsc`, `eslint`, `expo export --platform web` e uma passada de verificação real no Chromium (cadastro, captura com categoria, promover, concluir, limite de foco, editar, excluir, varrer as 4 abas). **O que falta é olho humano no aparelho** — o redesign é visual, e nenhum teste automatizado diz se ficou bom. `docs/TESTES-MANUAIS.md` com 10 cenários continua aguardando execução. Push para o GitHub segue pendente no login do `gh`.

## Concluído

- [x] TAP aprovado em estrutura (`docs/TAP-PI-Minha-Rotina.md`)
- [x] EAP com pacotes, responsáveis, sprints e marcos (`docs/EAP-MinhaRotina.md`)
- [x] Trabalho ABNT (`docs/trabalho-pi.md`)
- [x] Desenho das telas em texto (`docs/telas-minha-rotina.md`)
- [x] Protótipo interativo navegável (`docs/telas-minha-rotina.html`, testado)
- [x] Equipe nomeada: Mateus (Saída + Timer + SQLite + DER) e Helian (Inbox + Hoje + Revisão + testes)
- [x] M1/S1-S2: Setup Expo + Inbox + Hoje (commits `31b3118`, `d5871c5`)
- [x] M2/S3-S4: Saída + Timer (Pomodoro persistido em SQLite) + Revisão nas abas (commit `2ffb041`)
- [x] Login e cadastro com e-mail + senha (SHA-256 com salt), sessão local (commit `1270cfd`)
- [x] Saída editável e Inbox com CRUD completo (commits `52442cb`, `761c472`)
- [x] **Paleta por contexto: famílias de cor por tela, faixa em gradiente, ícones por categoria/tela/estatística/estado** (commits `597eaf1`, `2625f4c`, `eb42ef6`, `cad7e8d`, `cdef02a`)
- [x] **Fusão Inbox + Hoje numa tela só**, com zonas de cor própria e lápis único que abre a folha de ações (`fa17827`)
- [x] **Avisos que funcionam no navegador** (`notify.ts`) — o `Alert` do react-native-web era no-op silencioso
- [x] Lint e typecheck zerados (`npm run typecheck` + `eslint`)

## Pendente

- [ ] **Validação visual no aparelho** — as 4 abas com a faixa colorida, contraste dos StatCards, altura da faixa em tela pequena, e se as duas zonas da aba Hoje se distinguem bem
- [ ] **Validação funcional:** rodar o roteiro `docs/TESTES-MANUAIS.md` (10 cenários) — os cenários de Inbox e Hoje mudaram de forma
- [ ] Push para o GitHub (travado no `gh auth login` da conta dona do repo)
- [ ] M3 (S5-S6): DER (5 tabelas) + slide 10min + testes manuais
- [ ] Conferir notificações (expo-notifications) — README menciona, código não usa ainda
- [ ] Banca: congelar código 3 dias antes + demo de 10 min sem crash

## Como continuar

1. Ler `docs/HANDOFF.md` (estado técnico detalhado) e este arquivo
2. Ler `docs/DESIGN.md` (contrato visual) antes de mexer em qualquer tela
3. Rodar `npm run typecheck` e `npx eslint src/ hooks/ app/ App.tsx --ext .ts,.tsx` para confirmar estado limpo
4. Escolher um item de "Pendente" — **commitar antes de qualquer alteração**

## Observações

- A paleta é um sistema, não uma lista: **4 famílias por tela** (Hoje verde,
  Saída rosa/violeta, Timer âmbar/laranja, Revisão teal) + **6 matizes de
  categoria** que aparecem **antes do toque** + a tinta de marca. Dentro da aba
  Hoje, as zonas usam famílias diferentes (prioridades azul, Inbox verde).
  Contrato e justificativa em `docs/DESIGN.md` — é o material para responder ao
  professor.
- Códigos de referência: `v2-designer-por-contexto` (estado anterior, 5 abas) e
  `designer-antigo` / `v1-designer-simples` (a v1 de 4 cores, para comparação).
- Numeração do TAP sequencial (§1 a §14); EAP e STATUS apontam para §6, §11, §12 e §13.
- TAP, EAP, README e trabalho ABNT com o mesmo texto base e sem anglicismo "offline".
- Artefatos Tailscale (`tailscale.tgz`, scripts, `tailscale_1.102.4_amd64/`) e `~` **não são para commitar**.
