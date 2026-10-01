# Minha Rotina

App de organização de rotina para adultos com rotina variável — projeto
integrador do 4º semestre de Análise e Desenvolvimento de Sistemas.

A ideia nasceu de um problema comum: a gente anota tudo em papel, no bloco de
notas e em três ou quatro apps, e no fim esquece o que tinha que levar ao sair
de casa e perde prazo curto no meio da anotação espalhada. O Minha Rotina junta
tudo num app só, em português, com os dados no próprio aparelho.

## O que ele faz

Quatro abas, e o dia inteiro acontece na primeira:

- **Hoje** — o funil completo numa tela só. No topo, até 3 prioridades do dia; no
  meio, o campo de captura com prazo e categoria; embaixo, o inbox despejado.
  Cada ideia tem um lápis que abre *virar prioridade*, *editar* e *excluir* numa
  folha.
- **Saída** — checklist do ritual de porta (chave, ponto, marmita, fone,
  portão), editável, com confirmação de saída e um lembrete opcional 15 minutos
  antes.
- **Timer** — Pomodoro de 25 minutos que sobrevive à troca de aba. No fim do
  bloco, uma folha mostra quanto do dia já saiu e oferece a prioridade que
  continua em aberto.
- **Revisão** — dias com inbox zerado, saídas registradas, horário médio de
  saída e um ajuste escrito para a semana seguinte.

Sem servidor. A conta é um perfil local (e-mail e senha com hash SHA-256 e
salt), só para separar o uso no mesmo aparelho.

## Como rodar

Precisa de Node 18+.

```bash
git clone https://github.com/MateusCCI/MinhaRotina.git
cd MinhaRotina
npm install
npx expo start
```

Abra o QR com o app Expo Go no celular, na mesma rede do computador. Se a rede
da faculdade isolar o celular, use `npx expo start --tunnel` ou um hotspot
invertido.

Para ver as telas sem instalar nada: `npx expo start --web` (o SQLite no
navegador usa OPFS, então **só uma aba por vez**).

## Validação

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint, sem erros nem avisos
```

O roteiro de validação manual está em
[`docs/TESTES-MANUAIS.md`](docs/TESTES-MANUAIS.md) — 15 cenários, com o
critério de aceite de cada um.

## Estrutura

```text
App.tsx                    navegação, tema e login
app/
  auth.tsx                 login e cadastro
  (tabs)/                  as 4 telas
src/
  components/              ScreenShell, StatCard, RowActions, EditarChecklist,
                           CaptureInput, InboxItem, HojeItem, BlocoConcluido…
  lib/
    database.ts            Singleton do SQLite + criação e migração do schema
    types.ts               InboxItem, HojeItem, SaidaItem, WeeklyStats
    theme.ts               tokens e paleta por contexto
    icons.ts               vocabulário de ícones
    password.ts            hash e verificação de senha
    session.ts             sessão do usuário (Observer)
    inboxCount.ts          contador do inbox para a tab bar (Observer)
    alarme.ts              lembrete de saída com notificação agendada
    notify.ts              avisos que funcionam também no navegador
hooks/                     useInbox, useHoje, useSaida, useTimer
docs/                      TAP, EAP, testes, contrato visual e o relatório
```

Duas decisões de modelagem que valem explicação:

- **`inbox_items` e `hoje_items` são tabelas separadas.** Promover uma ideia
  copia o conteúdo para `hoje_items` e apaga do inbox. Quando as duas eram uma
  tabela só com um campo de status, o item sumia das duas telas ao promover.
- **O banco é um Singleton** (`DatabaseSingleton.getInstance()`), com
  migração defensiva por `ensureColumn` — abrir um app antigo nunca quebra por
  coluna faltando.

## Documentação

| Documento | O que tem |
|---|---|
| [`docs/MinhaRotina-PI.docx`](docs/MinhaRotina-PI.docx) | Relatório final do projeto |
| [`docs/TAP-PI-Minha-Rotina.md`](docs/TAP-PI-Minha-Rotina.md) | Termo de abertura: objetivo, escopo, prazo e riscos |
| [`docs/EAP-MinhaRotina.md`](docs/EAP-MinhaRotina.md) | Estrutura analítica: entregas e responsáveis |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Contrato visual: paleta, ícones, componentes |
| [`docs/TESTES-MANUAIS.md`](docs/TESTES-MANUAIS.md) | 15 cenários de validação manual |
| [`docs/telas-minha-rotina.md`](docs/telas-minha-rotina.md) | Desenho das telas, primeira versão |
| [`docs/telas-minha-rotina.html`](docs/telas-minha-rotina.html) | Protótipo navegável da primeira versão |
| [`docs/figura-telas.png`](docs/figura-telas.png) | As 4 telas do app, como aparecem no relatório |

As duas últimas peças são o protótipo feito antes do código (M1). O app
final mudou em dois pontos depois: Inbox e Hoje viraram uma tela só, e a paleta
virou uma família de cor por aba.

## Autores

- **Mateus** — telas de Saída e Timer, banco SQLite e DER
- **Helian** — telas de Inbox, Hoje e Revisão, e os testes
- Orientador: Prof. Sosthenes Carlos Ferreira do Nascimento

## O que ficou para trás

Duas coisas deram trabalho e não são óbvias pelo código: o limite de 3
prioridades no Hoje (que é a decisão de produto, não um detalhe) e o timer
persistir sem zerar ao trocar de aba. Também cortamos escopo no meio do caminho
porque não cabia em seis semanas.

Para o TCC 2 ficaram: sincronizar entre aparelhos, sugerir as três prioridades
do dia e versão para iOS.

## Licença

Trabalho acadêmico, uso livre para estudo.