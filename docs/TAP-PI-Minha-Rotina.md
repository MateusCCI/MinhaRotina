TAP - Minha Rotina

Curso de Analise e Desenvolvimento de Sistemas - Brasilia-DF, setembro de 2026.

Termo de Abertura do Projeto Integrador Minha Rotina. Vale o que esta escrito aqui.

1. IDENTIFICACAO

Nome do projeto: Minha Rotina - app de organizacao de rotina
Grupo responsavel: Dupla Minha Rotina
Professor responsavel: Sosthenes Carlos Ferreira do Nascimento
Equipe do projeto: Mateus (Saida + Timer + SQLite + DER) + Helian (Inbox + Hoje + Revisao + testes)

2. DISCIPLINAS VINCULADAS

Programacao para Dispositivos Moveis I; Programacao Orientada a Objetos; Topicos Avancados em ADS; Avaliacao de Software.

3. O QUE O PROJETO JUNTA

O projeto junta o que vimos nas materias: Mobile I (app com Expo + TypeScript e banco no proprio aparelho), Orientacao a Objetos (padroes Singleton no banco, Observer nos avisos e Strategy nos filtros), Topicos Avancados (requisitos e modelagem do banco) e Avaliacao de Software (criterios de aceite e testes manuais no celular).

4. PARA QUEM E

Gente de 18 a 45 anos com rotina picada (estudante, CLT, autonomo) que esquece o que ia levar ao sair, acumula anotacao no celular e largou outros apps por serem complicados. Foco em quem quer rotina simples, em portugues e sem criar conta.

5. JUSTIFICATIVA

Problema (antes): confere as coisas no quarto e lembra na escada, lista de 20 itens que trava, prazo curto perdido no meio de anotacao espalhada, app pedindo conta e servidor ou em ingles.

Mudanca (depois): anotar no Inbox em segundos, Hoje com no maximo 3 escolhidas na mao e barra de progresso com cor e percentual, botao HOJE que leva em 1 toque, checklist de saida com ate 5 itens, timer de 25 min que so avisa no fim do bloco. Tudo com os dados guardados no celular.

Base: GTD (ALLEN, 2015), de tirar tudo da cabeca e jogar num lugar so; intencao de implementacao (GOLLWITZER e SHEERAN, 2006); lembretes simples (JONES e outros, 2021). Viabilidade: Expo + expo-sqlite, custo zero, 2 pessoas, 6 semanas.

6. OBJETIVOS

OE1 (semanas 1-2): entregar Inbox + Hoje (anotar, listar, apagar e levar ate 3 para o Hoje) abrindo pelo QR em 1 Android. Prova: demo funcionando.

OE2 (semanas 3-4): entregar Saida (checklist de ate 5 + hora + 1 alarme) + timer de 25 min com iniciar e pausar. Prova: fluxo da manha testado.

OE3 (semanas 5-6): entregar aviso de fim de bloco + barra de progresso + Revisao (conta dias com inbox zerado) + DER com 5 tabelas + slide + 10 casos de teste passando. Congelar o codigo 3 dias antes da banca.

7. O QUE VAI SER ENTREGUE

App instalado por QR ou APK, DER + EAP, 10 testes manuais passando, slide de 10 min e demo de 10 min sem travar. Depois da para continuar no TCC 2.

8. O QUE FICOU DE FORA

Sem servidor e sem sincronizar entre aparelhos; sem IA e sem sugerir tarefa sozinha; sem gamificacao, sem geofencing, sem versao para iOS e sem coletar dado de ninguem. Ideia nova vai para a lista do TCC 2.

9. RESTRICOES

Prazo de 6 semanas ate a banca; equipe de 2 (sem designer e sem QA); orcamento zero; stack presa em Expo + TypeScript + SQLite; apresentacao pelo QR (precisa de 1 Android e Wi-Fi na hora para o Expo Go); codigo congela 3 dias antes.

10. RISCOS

Risco 1: Wi-Fi falhar na banca e o QR nao abrir. Chance media, efeito alto. O que fazer: levar app ja instalado + video de 60s de reserva.

Risco 2: SQLite travar em celular antigo. Chance baixa, efeito medio. O que fazer: trocar por AsyncStorage mantendo as mesmas funcoes.

Risco 3: Quererem enfiar mais funcao no fim. Chance alta, efeito alto. O que fazer: negar e anotar para o TCC 2.

Risco 4: Faltar arquivo na vespera. Chance baixa, efeito alto. O que fazer: checklist na vespera com os 4 docs e o prototipo.

11. QUEM FAZ O QUE

Mateus: Saida + Timer + SQLite + DER + arquitetura.
Helian: Inbox + Hoje + Revisao + testes + EAP.
Prof. Sosthenes: orientacao + aceite.
Banca (4 materias): avalia demo + DER + testes.

12. CRONOGRAMA (6 semanas ate a banca)

Setup + Inbox + Hoje: 2 semanas (S1-S2).
Saida + Timer: 2 semanas (S3-S4).
Revisao + DER + slide + testes: 2 semanas (S5-S6).
Congelamento + demo: 3 dias (banca).

13. CRITERIOS DE ACEITE

CA-PI01: anotou, apareceu na hora; apagar nao trava com 50 itens.
CA-PI02: Hoje so deixa 3 (a 4a mostra aviso simples).
CA-PI03: checklist termina em menos de 60s, 1 toque por item; hora salva.
CA-PI04: timer de 25 min com iniciar e pausar sem zerar ao trocar de aba.
CA-PI05: humor e sono salvos no aparelho; revisao conta os dias com inbox zerado.
CA-PI06: 2 alarmes so tocam se tem pendencia; tocar abre o item.
CA-PI07: abre pelo QR no Android depois de instalado; sem travar em 10 min de demo.

14. APROVACOES

Gerente do Projeto: ______________________   Responsavel equipe: ______________________   Data: ____/____/2026.

Programacao para Dispositivos Moveis I: ______________________
Programacao Orientada a Objetos: ______________________
Topicos Avancados em ADS: ______________________
Avaliacao de Software: ______________________
