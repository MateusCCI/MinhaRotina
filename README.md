# Minha Rotina

Aplicativo mobile de organização de rotina para adultos com rotina variável e dificuldades de memória prospectiva (esquecer compromissos, horários e itens do dia a dia).

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas — Brasília-DF, setembro de 2026.

## O problema

Quem tem rotina variável (estudo, trabalho, turnos) costuma:
- Esquecer itens ao sair de casa (chave, marmita, fone)
- Se atrasar por não visualizar o tempo restante
- Acumular pendências sem um lugar único para despejar e revisar

## A solução

Um app offline-first, em português, com 5 telas focadas em uma ação principal cada:

| Tela | O que faz |
|---|---|
| **Inbox** | Captura rápida de ideias em menos de 10 segundos |
| **Hoje** | Até 3 prioridades do dia com barra de progresso |
| **Saída** | Checklist de porta (máx. 5 itens) + horário de saída |
| **Timer** | Temporizador por tarefa com contagem regressiva visual |
| **Revisão** | Resumo semanal: inbox zerado, saídas no horário, 1 ajuste |

## Documentação

| Documento | Conteúdo |
|---|---|
| `docs/TAP-PI-Minha-Rotina.md` | Termo de Abertura do Projeto (objetivos, escopo, cronograma) |
| `docs/trabalho-pi.md` | Trabalho acadêmico em formato ABNT |
| `docs/telas-minha-rotina.md` | Desenho das telas em texto + interações |
| `docs/telas-minha-rotina.html` | Protótipo interativo navegável no navegador |

## Como ver o protótipo

Abra `docs/telas-minha-rotina.html` em qualquer navegador moderno. Não precisa instalar nada: marque checkboxes, mova itens do Inbox para o Hoje e execute o timer.

## Tecnologias

- React Native (Expo) + TypeScript
- SQLite local via expo-sqlite (funciona 100% offline)
- Sem backend, sem conta, sem coleta de dados

## Disciplinas integradas

- Programação para Dispositivos Móveis I
- Programação Orientada a Objetos
- Tópicos Avançados em Análises e Desenvolvimento de Sistemas
- Avaliação de Software

## Status

Documentação, protótipo de telas e regras de negócio concluídos. Desenvolvimento do aplicativo em andamento.
