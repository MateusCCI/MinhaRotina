# TAP — Minha Rotina

Curso de Análise e Desenvolvimento de Sistemas — Brasília-DF, setembro de 2026.

> Termo de Abertura do Projeto Integrador Minha Rotina. O escopo considerado é o definido neste documento.

## 1. IDENTIFICAÇÃO

| Campo | Preenchimento |
|---|---|
| NOME DO PROJETO | Minha Rotina — app mobile offline de organização de rotina |
| GRUPO RESPONSÁVEL | [Nome do grupo] |
| PROFESSOR RESPONSÁVEL | Sosthenes Carlos Ferreira do Nascimento |
| EQUIPE DO PROJETO | Mateus (Aluno 1 — Saída + Timer + SQLite + DER) + Helian (Aluno 2 — Inbox + Hoje + Noite + testes) |

## 2. DISCIPLINAS VINCULADAS

Programação para Dispositivos Móveis I; Programação Orientada a Objetos; Tópicos Avançados em Análises e Desenvolvimento de Sistemas; Avaliação de Software.

## 3. ALINHAMENTO ESTRATÉGICO

O projeto aplica na prática os conhecimentos das disciplinas: Mobile I (Expo + TypeScript + SQLite offline), Orientação a Objetos e Padrões (Observer p/ alarmes, Singleton p/ banco local, Strategy p/ filtros Hoje/Backlog), Tópicos Avançados (engenharia de requisitos e modelagem) e Avaliação de Software (critérios mensuráveis de aceite + testes manuais).

## 4. PÚBLICO-ALVO

Adultos 18-45 com rotina variável (estudantes, CLT, autônomos) que esquecem itens ao sair, acumulam tarefas no celular e abandonam apps complexos. Foco em quem precisa de rotina simples offline em PT-BR.

## 5. JUSTIFICATIVA

Problema (antes): esquecimento na saída (confere no quarto, lembra na escada), Hoje com 20+ itens que paralisa, prazos curtos perdidos no meio do Inbox, apps exigindo conta/nuvem/inglês.
Mudança (depois): captura <10s em inbox único, Hoje com max 3 escolhidas na mão + barra de progresso visual (cor + %) + botão [HOJE] em 1 toque, checklist de saída ≤5 no ponto de ação, timer 25min + notificação de transição (só ao encerrar bloco) — tudo local.
Embasamento (artigos, só citação — sem anexo): GOLLWITZER & SHEERAN (2006, d=0.65, 94 testes) e SHEERAN et al. (2025, 642 testes) — intenção de implementação se-então (janelas J1/J2, checklist na porta); JONES et al. (2021, 73 estudos, g=0.805) — auxílios externos de memória com validade ecológica (inbox + alarme); CHEN et al. (2015) — implementação melhora memória prospectiva (4 botões). Viabilidade técnica: Expo managed + expo-sqlite (custo zero, sem backend); econômica: R$ 0 (open-source, 2 devs, 6 semanas).

## 6. ESCOPO/OBJETIVOS (SMART)

- OE1 (S1, sem 1-2): entregar Inbox + Hoje manual (add/list/del + promover até 3) rodando via QR em 1 Android — medido por demo viva.
- OE2 (S2, sem 3-4): entregar Saída (checklist editável ≤5 + hora + 1 alarme local) + Pomodoro 25min start/pause — medido por fluxo manhã testado.
- OE3 (S3, sem 5-6): entregar Notificação de transição + barra visual de progresso + revisão (conta inbox zerado) + DER 5 tabelas + slide + 10 casos de teste manuais aprovados — medido por checklist de aceite §14. Congelar código 3 dias antes da banca.

## 7. BENEFÍCIOS ESPERADOS

Tangíveis: APK/QR instalável offline; DER + EAP do PI; 10 testes manuais; slide 10min. Intangíveis: rotina demonstrável (sair no horário, Hoje finito); base reutilizável para TCC 2 (backend/sugestões). Insumo futuro sem comprometer IP.

## 8. EXCLUSÕES (NÃO ESCOPO)

Sem backend/nuvem/sync; sem IA; sem sugestão automática, gamificação, notícias, geofencing/NFC, iOS nativo, wearable; sem coleta de dados (100% local). Escala ("TCC 2") citada em 1 frase, sem detalhar.

## 10. RESTRIÇÕES

Prazo 6 semanas (3 sprints) até a banca; equipe 2 alunos (sem designer/QA dedicado); orçamento R$ 0; stack travada Expo+TS+SQLite; apresentação via QR (depende de 1 Android + Wi-Fi local p/ Expo Go); código congela -3 dias.

## 11. RISCOS

| Risco | Probabilidade | Impacto | Ação |
|---|---|---|---|
| Expo Go sem rede na banca | média | alto | Levar APK instalado + vídeo de 60s de backup |
| SQLite travar em Android antigo | baixa | médio | Fallback AsyncStorage (mesma interface) |
| Escopo estourar (pedir "só mais 1 feature") | alta | alto | Trava §8; nova ideia vai p/ "TCC 2" |
| Vazamento de escopo | baixa | alto | Checklist véspera (repo só com as 4 telas + TAP, sem materiais extras) |

## 12. PARTES INTERESSADAS

| PESSOA | ATRIBUIÇÕES |
|---|---|
| Mateus (Aluno 1) | Saída + Timer + SQLite + DER + arquitetura |
| Helian (Aluno 2) | Inbox + Hoje + Noite + testes + EAP do PI |
| Prof. Sosthenes | Orientação + aceite |
| Banca (Mob I, Orientação a Objetos, Tópicos, Avaliação) | Avaliação da demo + DER + testes |

## 13. CRONOGRAMA MACRO (6 semanas → banca)

| ENTREGA MACRO | DURAÇÃO | S1-S2 | S3-S4 | S5-S6 | BANCA |
|---|---|---|---|---|---|
| Setup + Inbox + Hoje | 2 sem | X | | | |
| Saída + Pomodoro | 2 sem | | X | | |
| Noite + revisão + DER + slide + testes | 2 sem | | | X | |
| Congelamento + demo | 3 dias | | | | X |

## 14. CRITÉRIOS DE ACEITAÇÃO

- CA-PI01: Inbox add→visível <10s offline; del sem travar com 50 itens.
- CA-PI02: Hoje limitado a 3 (bloqueia a 4ª com aviso neutro).
- CA-PI03: Checklist conclui em <60s, 1 toque/item; hora salva.
- CA-PI04: Pomodoro 25:00 start/pause sem resetar ao trocar de aba.
- CA-PI05: Humor/sono salvos offline; revisão conta inbox zerado da semana.
- CA-PI06: 2 alarmes locais disparam só se Inbox >0 ou há ⏰; tap abre o item.
- CA-PI07: Abre via QR em Android sem internet após instalado; zero crash na demo de 10min.

## 15. APROVAÇÕES

Gerente do Projeto: ______________________ | Responsável equipe: ______________________ | Data: ____/____/2026.

| DISCIPLINA | ASSINATURA |
|---|---|
| Programação para Dispositivos Móveis I | |
| Programação Orientada a Objetos | |
| Tópicos Avançados em Análises e Desenvolvimento de Sistemas | |
| Avaliação de Software | |
