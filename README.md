# Minha Rotina

App de organização de rotina feito para o Projeto Integrador do 4º semestre de Análise e Desenvolvimento de Sistemas — Brasília-DF, 2026.

A ideia surgiu de um problema comum: a gente anotava tudo em papel, no bloco de notas e em vários apps, e no fim esquecia o que tinha que levar ao sair de casa e perdia prazo curto. O Minha Rotina tenta resolver isso de um jeito simples, com tudo em português e sem precisar criar conta.

## Como funciona

- **Inbox:** campo único no topo. Digitou e apertou Enter, salvou. Depois você decide o que vai para o Hoje ou apaga.
- **Hoje:** só cabem 3 tarefas por dia. A 4ª o app bloqueia com um aviso. Tem barra de progresso que muda de cor conforme você conclui.
- **Saída:** checklist de até 5 itens na ordem do caminho (ex.: chave, ponto, marmita, fone, portão). Um toque para marcar cada um e campo para anotar que horas você saiu.
- **Timer:** Pomodoro de 25 minutos com iniciar e pausar. Quando termina, ele pergunta qual é o próximo item.
- **Revisão:** resumo da semana com quantos dias você zerou o inbox e quantas saídas registrou, além de humor/sono e um ajuste para a semana seguinte.

Os dados ficam salvos no próprio celular com SQLite, então não precisa de conta nem de servidor.

## Tecnologias

- React Native com Expo + TypeScript
- SQLite com expo-sqlite
- React Navigation (navegação por abas)
- expo-notifications (alarme da saída e aviso de fim do bloco)
- Git + GitHub

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
app/                  telas (inbox, hoje, saída, timer, revisão)
src/components/       componentes reutilizáveis (CaptureInput, InboxItem, ...)
src/lib/              banco local (database.ts) e tipos (types.ts)
docs/                 TAP, EAP, protótipo e trabalho ABNT
```

O banco tem duas tabelas principais: `inbox_items` (id, content, created_at) e `hoje_items` (id, inbox_id, checked, created_at). O acesso passa por uma classe única (`DatabaseSingleton`), para não abrir várias conexões ao mesmo tempo.

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
