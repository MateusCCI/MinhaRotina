# STATUS — Minha Rotina (foto da situação)

Atualizado em: 29/09/2026 (2º turno). Última frente: **redesign visual das 5 telas** a partir do feedback do professor ("designer muito simples", "das 4 cores da paleta", "use ícones, mais cores, mais vida"). Detalhe técnico em `docs/DESIGN.md` e `docs/HANDOFF.md`.

Este arquivo diz onde o projeto está e qual é o próximo passo, para qualquer sessão continuar sem contexto externo.

> **Sessão a sessão:** o detalhamento técnico (commits, tokens, comandos de validação) está no **`docs/HANDOFF.md`** — leia-o antes de codar.

## Onde estamos

Código pronto e validado (`tsc`, `eslint`, `expo export --platform web` limpos). **O que falta é olho humano no aparelho** — o redesign é visual, e nenhum teste automatizado diz se ficou bom. `docs/TESTES-MANUAIS.md` com 10 cenários segue aguardando execução. Push para o GitHub continua pendente no login do `gh`.

## Concluído

- [x] TAP aprovado em estrutura (`docs/TAP-PI-Minha-Rotina.md`)
- [x] EAP com pacotes, responsáveis, sprints e marcos (`docs/EAP-MinhaRotina.md`)
- [x] Trabalho ABNT (`docs/trabalho-pi.md`)
- [x] Desenho das telas em texto (`docs/telas-minha-rotina.md`)
- [x] Protótipo interativo navegável (`docs/telas-minha-rotina.html`, testado)
- [x] Equipe nomeada: Mateus (Saída + Timer + SQLite + DER) e Helian (Inbox + Hoje + Revisão + testes)
- [x] M1/S1-S2: Setup Expo + Inbox + Hoje (commits `31b3118`, `d5871c5`)
- [x] M2/S3-S4: Saída + Timer (Pomodoro persistido em SQLite) + Revisão nas 5 abas (commit `2ffb041`)
- [x] Login e cadastro com e-mail + senha (SHA-256 com salt), sessão local (commit `1270cfd`)
- [x] Saída editável e Inbox/Hoje com CRUD completo (commits `52442cb`, `761c472`)
- [x] **Paleta por contexto: 5 famílias de cor, faixa colorida nas 5 telas, ícones por categoria/tela/estatística** (commits `597eaf1`, `2625f4c`, `eb42ef6`)
- [x] Lint e typecheck zerados (`npm run typecheck` + `eslint`)

## Pendente

- [ ] **Validação visual do redesign no aparelho** — 5 telas com a faixa colorida, contraste dos StatCards, altura da faixa em tela pequena
- [ ] **Validação funcional:** rodar o roteiro `docs/TESTES-MANUAIS.md` (10 cenários) e reexecutar o cenário 1 (Inbox), que mudou
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

- A paleta não é mais "Restrained com 4 cores": são 5 famílias por contexto
  (Inbox verde, Hoje azul, Timer âmbar, Saída rosa/violeta, Revisão teal) mais
  a tinta de marca e as 6 matizes de categoria. Contrato e justificativa em
  `docs/DESIGN.md` — é o material para responder ao professor.
- Numeração do TAP sequencial (§1 a §14); EAP e STATUS apontam para §6, §11, §12 e §13.
- TAP, EAP, README e trabalho ABNT com o mesmo texto base e sem anglicismo "offline".
- Artefatos Tailscale (`tailscale.tgz`, scripts, `tailscale_1.102.4_amd64/`) e `~` **não são para commitar**.
