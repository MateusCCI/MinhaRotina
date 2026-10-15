# Sessão 2026-10-11 — Versionamento do PI + lixeiras do workspace

## O que foi feito

Sessão iniciada no EnglishKids, mas o trabalho real de limpeza foi em outros
projetos. Achados registrados nos lugares certos.

## Achado principal: versões do Trabalho de PI (MinhaRotina)

Investigação feita porque o nome do arquivo enganava. Confirmação abrindo
cada `.docx` e contando o texto — não só o tamanho do arquivo:

| Arquivo | Texto | Data |
|---|---|---|
| `docs/MinhaRotina-PI.docx` | **30.201 chars** | 2026-10-07 |
| `lixeira/MinhaRotina-PI-ABNT.docx` | 29.749 chars | 2026-09-16 |
| `lixeira/MinhaRotina-PI.docx.bak` | 29.169 chars | 2026-10-01 |

### O problema

O arquivo chamado **"ABNT"** sugere ser a versão final, mas é de **16 de
setembro** — anterior à versão viva. Se alguém esvaziasse a lixeira por ele,
perderia trabalho.

### O detalhe que quase passou

`MinhaRotina-PI.docx.bak` tem **587 KB — mesmo tamanho da versão viva**,
o que faz parecer duplicata. Mas o texto tem **1.032 caracteres a menos**.
Não é cópia: é um snapshot real de 1/out, e a **única cópia** daquele
estado.

**Regra aprendida:** tamanho de arquivo não substitui comparação de
conteúdo. Dois `.docx` do mesmo tamanho podem ter conteúdos bem diferentes.

### Recomendação registrada

Manter todos os backups (1,3 MB). Custo zero, risco de perda real.

## Lixeiras do workspace

4 projetos tinham pasta `lixeira/` **sem README**, violando a regra de
documentação. Todos foram corrigidos:

| Projeto | Lixeira | O que foi documentado |
|---|---|---|
| 10.02-ExpertHookah | 63 MB | carrossel antigo, config MCP, backup de `node_modules` |
| 10.03-LifeOrganizer | 4 MB | pastas `-tmp` do BookToSkill |
| 10.05-MinhaRotina | 111 MB | instalador Tailscale, backups do PI, pastas `~` |
| 10.12-VidaEmOrdem | 156 KB | lockfile do Bun antigo |

**172 MB isolados em `_APAGAVEIS/`** (sem apagar), prontos para descarte
com autorização explícita:

- ExpertHookah: `opencode-node_modules-20260922/` (63 MB) — `npm install` reconstrói
- MinhaRotina: `tailscale.tgz` + pasta extraída (110 MB) — reinstala pelo gerenciador de pacotes

## Regras atualizadas

**`Projetos/AGENTS.md`** (raiz):
- Proibidos `rm` e `rm -rf` (a regra só citava comandos PowerShell)
- `SEMPRE` escrever `lixeira/README.md`
- `SEMPRE` verificar com `grep` antes de mover
- `NUNCA` remover da lixeira sem autorização explícita
- Tabela de comandos Windows / Linux-WSL

**`10.08-EnglishKids/AGENTS.md`**:
- Regra 11: nunca deletar, mover para lixeira com README

## Regras que valem para qualquer sessão

1. **`grep` antes de mover.** No EnglishKids salvou um arquivo: as falas
   `d_*.mp3` antigas e `r_look_i_see_dog.mp3` (usada pelo Trocar Papéis) têm
   nomes parecidos. Sem o grep, teria movido as duas.
2. **Tamanho ≠ conteúdo.** Comparar o que está dentro, não os bytes.
3. **Nome engana.** "ABNT" sugeria ser final; era o mais antigo.
4. **Plugin anti-trava funciona.** Ele bloqueou um comando com `rm` no meio
   mesmo num contexto de limpeza — a regra é mais fácil de seguir quando o
   comando é óbvio.

## Onde está o registro

- `10-Projetos/10.05-MinhaRotina/lixeira/README.md` — versões do PI
- `10-Projetos/10.02-ExpertHookah/lixeira/README.md` — `_APAGAVEIS/`
- `Projetos/AGENTS.md` — regras do workspace
- `10-Projetos/10.08-EnglishKids/AGENTS.md` — regra do projeto