# Minha Rotina

Aplicativo mobile offline de organização de rotina para adultos com rotina variável e dificuldades de memória prospectiva (esquecer itens ao sair, perder horários, acumular pendências).

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas — Brasília-DF, setembro de 2026.

## Sumário

- [O problema](#o-problema)
- [A solução](#a-solução)
- [Telas](#telas)
- [Demonstração (protótipo)](#demonstração-protótipo)
- [Documentação](#documentação)
- [Tecnologias e arquitetura](#tecnologias-e-arquitetura)
- [Disciplinas integradas](#disciplinas-integradas)
- [Cronograma](#cronograma)
- [Critérios de aceite](#critérios-de-aceite)
- [Fora do escopo](#fora-do-escopo)
- [Equipe](#equipe)

## O problema

Antes do app, a rotina típica do público-alvo (18-45 anos, estudantes, CLT, autônomos):
- Confere os itens no quarto e lembra do que faltou já na escada
- Monta listas de 20+ tarefas que paralisam em vez de ajudar
- Perde prazos curtos no meio de anotações espalhadas
- Abandona aplicativos que exigem conta, nuvem ou inglês

## A solução

Um app 100% local, em português, sem conta e sem internet: captura em inbox único em menos de 10 segundos, dia limitado a 3 prioridades com barra de progresso visual, checklist de saída no ponto de ação e temporizador de 25 minutos por bloco de foco.

## Telas

### 1. Inbox — captura rápida
Campo único no topo: digitar + Enter salva em menos de 10 segundos, mesmo offline. Cada item tem botões de mover para o Hoje (1 toque) e excluir sem confirmação. Meta: zerar o inbox todo dia.

### 2. Hoje — máximo 3 prioridades
Apenas 3 itens (a 4ª é bloqueada com aviso neutro). Checkbox grande (≥48dp), barra de progresso que muda de cor (vermelho → amarelo → verde) e percentual concluído. Botão de executar abre o timer da tarefa.

### 3. Saída — checklist de porta
Checklist editável de até 5 itens na ordem do trajeto (ex.: chave, ponto, marmita, fone, portão), 1 toque por item, conclusão em menos de 60 segundos, com horário de saída salvo e 1 alarme local.

### 4. Timer — Pomodoro de 25 minutos
Contagem regressiva visual por tarefa, com pausar/retomar sem resetar ao trocar de aba e notificação apenas ao encerrar o bloco (sem interrupções no meio do foco).

### 5. Revisão — fechamento da semana
Conta dias com inbox zerado, registra humor/sono offline e define 1 ajuste para a semana seguinte.

## Demonstração (protótipo)

O protótipo interativo das telas roda direto no navegador, sem instalar nada:

1. Abra `docs/telas-minha-rotina.html` em qualquer navegador moderno
2. Teste: despejar ideia no Inbox, mover para o Hoje com `[→ Hoje]`, marcar checkboxes e rodar o Timer
3. O desenho de cada tela em texto está em `docs/telas-minha-rotina.md`

## Documentação

| Documento | Conteúdo |
|---|---|
| `docs/TAP-PI-Minha-Rotina.md` | Termo de Abertura: objetivos SMART, escopo, cronograma, riscos, aceite |
| `docs/EAP-MinhaRotina.md` | EAP: pacotes, responsáveis, sprints e marcos |
| `docs/trabalho-pi.md` | Trabalho acadêmico em formato ABNT |
| `docs/telas-minha-rotina.md` | Desenho das telas em texto + interações |
| `docs/telas-minha-rotina.html` | Protótipo interativo navegável |

## Tecnologias e arquitetura

- React Native via Expo + TypeScript
- SQLite local via expo-sqlite (todo o dado fica no aparelho)
- Programação Orientada a Objetos com padrões: Observer (alarmes), Singleton (banco local) e Strategy (filtros Hoje/Backlog)
- Sem backend, sem sincronização em nuvem, sem coleta de dados

## Disciplinas integradas

| Disciplina | Contribuição no projeto |
|---|---|
| Programação para Dispositivos Móveis I | App Expo + TypeScript + SQLite offline |
| Programação Orientada a Objetos | Modelagem e padrões (Observer, Singleton, Strategy) |
| Tópicos Avançados em ADS | Engenharia de requisitos, modelagem e DER |
| Avaliação de Software | Critérios mensuráveis de aceite + 10 casos de teste manuais |

## Cronograma

| Entrega | Período |
|---|---|
| Setup + Inbox + Hoje (demo via QR em 1 Android) | Semanas 1-2 |
| Saída + Pomodoro (fluxo da manhã testado) | Semanas 3-4 |
| Revisão + DER (5 tabelas) + slide + 10 testes | Semanas 5-6 |
| Congelamento do código (3 dias antes) + banca | Apresentação |

## Critérios de aceite

- Inbox: item digitado visível em <10s offline; exclusão sem travar com 50 itens
- Hoje: limite de 3 respeitado; checklist de saída concluído em <60s
- Timer: 25:00 com start/pause, sem resetar ao trocar de aba
- Revisão: humor/sono salvos offline; contagem de inbox zerado da semana
- App abre via QR em Android sem internet após instalado; zero crash na demo de 10 minutos

## Fora do escopo

Sem backend/nuvem, sem IA ou sugestões automáticas, sem gamificação, sem geofencing/NFC, sem iOS nativo e sem coleta de dados. Escala futura (ex.: backend) fica para o TCC 2.

## Equipe

- Responsável por Saída + Timer + SQLite + DER + arquitetura
- Responsável por Inbox + Hoje + Revisão + testes
- Orientação: Prof. Sosthenes Carlos Ferreira do Nascimento
