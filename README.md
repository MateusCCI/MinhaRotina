# Minha Rotina

App de organização de rotina feito para o Projeto Integrador do 4º semestre de Análise e Desenvolvimento de Sistemas — Brasília-DF, 2026.

A ideia surgiu de um problema comum: a gente anotava tudo em papel, no bloco de notas e em vários apps, e no fim esquecia o que tinha que levar ao sair de casa e perdia prazo curto. O Minha Rotina tenta resolver isso de um jeito simples, com tudo em português e conta local no próprio aparelho (nome, e-mail e senha, sem servidor).

## Como funciona

- **Inbox:** campo único no topo com prazo e categoria. Digitou e apertou Enter, salvou. Depois você edita, decide o que vira prioridade do Hoje ou apaga. Com 5+ itens o app sugere uma limpa rápida.
- **Hoje:** só cabem 3 tarefas por dia. A 4ª o app bloqueia com um aviso. Tem barra de progresso que muda de cor conforme você conclui, e filtro por categoria.
- **Saída:** checklist editável do ritual de saída (criar, renomear, excluir; ex.: chave, ponto, marmita, fone, portão). Um toque para marcar cada um e botão de confirmar saída, liberado quando tudo está marcado.
- **Timer:** Pomodoro de 25 minutos com iniciar, pausar e zerar; o estado persiste no banco mesmo trocando de aba.
- **Revisão:** resumo da semana com quantos dias você zerou o inbox, quantas saídas registrou e o horário médio, além de um ajuste escrito para a semana seguinte e a troca de perfil.

Os dados ficam salvos no próprio celular com SQLite, então não precisa de servidor. A conta é um perfil local (e-mail + senha com hash SHA-256 e salt); serve para separar o uso no mesmo aparelho.

## Interface

Cada aba tem a sua própria cor e o seu ícone, então dá para saber em que parte da rotina você está só de bater o olho: Inbox verde, Hoje azul, Timer âmbar, Saída rosa e Revisão teal. A faixa colorida do topo traz o resumo do dia em números, e todo item tem um ícone que diz a que categoria pertence. O contrato visual completo, com as regras de uso de cada cor, está em `docs/DESIGN.md`.

## Tecnologias

- React Native com Expo + TypeScript
- SQLite com expo-sqlite (inbox, hoje, saída, timer, ajustes, usuários, sessão)
- React Navigation (pilha Auth + abas)
- expo-crypto (hash de senha), expo-haptics (micro-interação) e
  expo-linear-gradient (faixa colorida das telas)
- @expo/vector-icons (ícones) e Git + GitHub

## Como rodar

Pré-requisitos: Node 18+, app Expo Go instalado no Android e o celular e o PC na mesma rede Wi-Fi.

```bash
git clone https://github.com/seu-usuario/minha-rotina.git
cd minha-rotina
npm install
npx expo start
```

Depois abra a câmera do Expo Go e leia o QR que aparece no terminal. Na primeira vez demora um pouco para carregar.

Se preferir só ver as telas sem instalar nada, abra o arquivo `docs/telas-minha-rotina.html` em qualquer navegador.

## Estrutura do projeto

```text
app/                  telas (auth, inbox, hoje, saída, timer, revisão)
src/components/       componentes reutilizáveis (ScreenShell, StatCard, Logo, CaptureInput, InboxItem, ...)
src/lib/              tema e paleta por contexto (theme.ts), ícones (icons.ts), banco local (database.ts), sessão, senha e tipos
hooks/                estado por tela (useInbox, useHoje, useSaida, useTimer)
docs/                 TAP, EAP, DESIGN, protótipo e trabalho ABNT
```

O banco tem tabelas para `inbox_items`, `hoje_items` (com cópia própria de conteúdo/prazo/categoria), `saida_items` + `saida_log`, `timer_state`, `ajustes_semanais`, `events`, `users` e `meta` (sessão). O acesso passa por uma classe única (`DatabaseSingleton`), para não abrir várias conexões ao mesmo tempo.

## Documentação

| Documento | O que tem dentro |
|---|---|
| `docs/TAP-PI-Minha-Rotina.md` | Termo de abertura: objetivo, escopo, prazo e riscos |
| `docs/EAP-MinhaRotina.md` | Divisão do trabalho por entrega e por responsável |
| `docs/telas-minha-rotina.md` | Desenho das telas em texto |
| `docs/telas-minha-rotina.html` | Protótipo navegável das telas |
| `docs/MinhaRotina-PI-ABNT.docx` | Trabalho final formatado |
| `docs/STATUS.md` | Andamento do projeto |

## Quem fez

- Mateus — telas de Saída e Timer, banco SQLite e DER
- Helian — telas de Inbox, Hoje e Revisão, testes
- Orientador: Prof. Sosthenes Carlos Ferreira do Nascimento

## O que deu trabalho e próximos passos

A parte mais chata foi o limite de 3 itens no Hoje e não deixar o timer zerar quando troca de aba. Também tivemos que simplificar o escopo no meio do caminho porque não ia dar tempo de fazer tudo em 6 semanas.

Ficou de fora (ideia para o TCC 2): sincronizar entre aparelhos, sugerir as 3 tarefas do dia e versão para iOS.

## Licença

Trabalho acadêmico, uso livre para estudo.
