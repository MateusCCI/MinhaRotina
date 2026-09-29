# STATUS — Minha Rotina (foto da situação)

Atualizado em: 28/09/2026. Saída editável + repetir senha commitados (`52442cb`, `761c472`); README sincronizado; roteiro de 10 testes manuais em `docs/TESTES-MANUAIS.md` aguardando execução humana. Este arquivo diz onde o projeto está e qual é o próximo passo, para qualquer sessão continuar sem contexto externo.

> **Sessão a sessão:** o detalhamento técnico da última sessão (commits, tokens do tema, comandos de validação) está no **`docs/HANDOFF.md`** — leia-o antes de codar.

## Onde estamos

Fase de **redesign claro iOS concluída no código** (contrato em `docs/DESIGN.md`). Próximo passo: **validação humana + marcos M2/M3 da EAP**.

## Concluído

- [x] TAP aprovado em estrutura (`docs/TAP-PI-Minha-Rotina.md`)
- [x] EAP com pacotes, responsáveis, sprints e marcos (`docs/EAP-MinhaRotina.md`)
- [x] Trabalho ABNT (`docs/trabalho-pi.md`)
- [x] Desenho das telas em texto (`docs/telas-minha-rotina.md`)
- [x] Protótipo interativo navegável (`docs/telas-minha-rotina.html`, testado)
- [x] Equipe nomeada: Mateus (Saída + Timer + SQLite + DER) e Helian (Inbox + Hoje + Revisão + testes)
- [x] M1/S1-S2: Setup Expo + Inbox + Hoje (commits `31b3118`, `d5871c5`)
- [x] M2/S3-S4: Saída + Timer (Pomodoro persistido em SQLite) + Revisão nas 5 abas (commit `2ffb041`)
- [x] Tema escuro Neo Kinpaku, edição posterior do Inbox, banner + contador de limpeza (commit `2ffb041`)
- [x] Lint e typecheck zerados (`npm run typecheck` + `eslint`)

## Pendente (por marco da EAP)

- [ ] **Validação humana:** rodar o app e revisar tema/fluxos nas 5 telas (web: `Ctrl+Shift+R` 2× por causa do OPFS)
- [ ] M3 (S5-S6): DER (5 tabelas) + slide 10min + 10 testes manuais
- [ ] Conferir notificações (expo-notifications) — README menciona, código não usa ainda
- [ ] Banca: congelar código 3 dias antes + demo de 10 min sem crash
- [ ] Sincronizar README com a realidade do código (tema, 5 abas)

## Como continuar

1. Ler `docs/HANDOFF.md` (estado técnico detalhado) e este arquivo
2. Ler o `README.md` para a visão do produto
3. Rodar `npm run typecheck` e `npx eslint src/ hooks/ app/ App.tsx --ext .ts,.tsx` para confirmar estado limpo
4. Escolher um item de "Pendente" — **commitar antes de qualquer alteração**

## Observações

- Numeração do TAP sequencial (§1 a §14); EAP e STATUS apontam para §6, §11, §12 e §13.
- TAP, EAP, README e trabalho ABNT com o mesmo texto base e sem anglicismo "offline".
- Artefatos Tailscale (`tailscale.tgz`, scripts, `tailscale_1.102.4_amd64/`) e `~` **não são para commitar**.
