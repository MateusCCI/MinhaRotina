# Minha Rotina — Projeto Integrador

**Mateus**
**Helian**

Prof. Sosthenes Carlos Ferreira do Nascimento

Brasília-DF, setembro de 2026

---

## RESUMO

Este Projeto Integrador apresenta o desenvolvimento do Minha Rotina, um aplicativo de organização de rotina para adultos com rotina variável que acabam esquecendo itens ao sair de casa e perdendo prazos curtos. O app foi feito com React Native, TypeScript e banco SQLite no próprio aparelho. O trabalho junta o que vimos em quatro disciplinas: Programação para Dispositivos Móveis I, Programação Orientada a Objetos, Tópicos Avançados em ADS e Avaliação de Software. O desenvolvimento foi dividido em três sprints de duas semanas, com protótipo das telas antes do código e testes manuais no celular. O resultado é um app simples, em português e sem conta: Inbox para anotar rápido, Hoje com no máximo 3 tarefas, checklist de saída, timer de 25 minutos e revisão da semana.

Palavras-chave: Projeto Integrador; Desenvolvimento Mobile; React Native; GTD; Organização Pessoal.

## ABSTRACT

This Integrative Project presents Minha Rotina, a routine organization app for adults with variable schedules who often forget items when leaving home and miss short deadlines. The app was built with React Native, TypeScript and SQLite stored on the device. The work brings together four subjects: Mobile Programming I, Object-Oriented Programming, Advanced Topics in Systems Analysis and Development, and Software Evaluation. Development was split into three two-week sprints, with screen prototypes before coding and manual tests on a real phone. The result is a simple app, in Portuguese and with no account needed: Inbox for quick notes, Today limited to 3 tasks, exit checklist, 25-minute timer and weekly review.

Keywords: Integrative Project; Mobile Development; React Native; GTD; Personal Organization.

---

## 1. INTRODUÇÃO

Quase todo mundo hoje tem celular, mas muita gente continua se perdendo na rotina. No nosso caso, o problema era bem concreto: a gente conferia as coisas no quarto e lembrava do que faltou já na escada, montava lista de 20 tarefas que mais travava do que ajudava e perdia prazo curto no meio de anotação espalhada. Os apps que testamos pediam conta, salvavam tudo em servidor ou eram em inglês, e a gente acabava largando.

A proposta do Minha Rotina foi fazer um app simples para esse dia a dia: anotar rápido no Inbox, escolher só 3 coisas para o Hoje, marcar um checklist na hora de sair e usar um timer de 25 minutos para focar. Tudo em português e com os dados guardados no próprio celular, sem servidor.

O projeto também serviu para juntar as matérias do semestre num trabalho só, que é a ideia do Projeto Integrador.

### 1.1 Objetivo Geral

Desenvolver um aplicativo de organização de rotina com React Native e TypeScript, com captura rápida, limite de 3 prioridades por dia e registro de atividades, usando banco local e conceitos vistos em sala.

### 1.2 Objetivos Específicos

-   Fazer a tela de Inbox para anotar tarefa em texto livre sem precisar classificar na hora;
-   Fazer a tela de Hoje com no máximo 3 itens escolhidos pelo usuário;
-   Montar o checklist de saída com até 5 itens que dá para editar e campo da hora que saiu;
-   Implementar o timer de 25 minutos com iniciar e pausar;
-   Guardar tudo em SQLite no próprio aparelho;
-   Cuidar da usabilidade: letra legível, botão grande e telas simples;
-   Testar no celular seguindo os critérios de aceite que definimos.

---

## 2. FUNDAMENTAÇÃO TEÓRICA

### 2.1 Engenharia de Software

Pressman e Maxim (2021) dizem que um software dá certo quando atende o que o usuário precisa, é fácil de usar e fácil de mudar depois. Para chegar nisso, eles defendem seguir um passo a passo: levantar requisitos, analisar, projetar, programar, testar e manter.

A gente tentou seguir isso mesmo sendo um trabalho pequeno. O modelo incremental tem a ver com o que fizemos: entregar por partes e ir ajustando. Os capítulos sobre processo e modelagem do livro ajudaram a organizar os sprints e a separar componentes, telas e banco.

Sobre testes, o livro fala de testar por componente e na integração. Foi o que fizemos com os critérios CA-PI01 a CA-PI07, testando cada tela no celular antes de juntar tudo.

### 2.2 Gestão de Projetos

Kerzner (2016) fala que gerenciar projeto não é só usar ferramenta, é definir escopo, dividir em entregas e acompanhar. Como éramos só dois, sem designer nem QA, isso pesou: tivemos que cortar coisa para caber em 6 semanas.

Os critérios de aceite viraram nossa forma de medir se estava pronto. O cronograma foi dividido por módulo (Inbox, Hoje, Saída, Timer, Revisão) em três sprints, e a EAP registrou quem fazia o quê.

### 2.3 Requisitos

A base foi o GTD (ALLEN, 2015), aquela ideia de tirar tudo da cabeça e jogar num lugar confiável só. Pressman e Maxim (2021) avisam que requisito mal escrito é uma das maiores causas de projeto que dá errado, então escrevemos cada requisito com um teste junto.

Requisitos funcionais do MVP:
-   RF01: Anotar item no Inbox em texto livre (até 500 caracteres);
-   RF02: Mostrar no máximo 3 tarefas no Hoje, escolhidas pelo usuário;
-   RF03: Checklist de saída com até 5 itens que dá para editar;
-   RF04: Timer de 25 minutos com iniciar e pausar;
-   RF05: Botão [HOJE] no Inbox que leva o item para o Hoje com 1 toque;
-   RF06: Barra de progresso do dia com % e cor que muda (vermelho, amarelo, verde);
-   RF07: Aviso quando o bloco termina, perguntando o próximo item, sem apitar no meio do foco;
-   RF08: Revisão da semana com contagem de dias com inbox zerado.

Por que decidimos assim:
-   *Botão [HOJE]:* Gollwitzer e Sheeran (2006) mostram que transformar intenção em ação de 1 toque ("se acontecer X, faço Y") aumenta a chance de cumprir. A ideia foi diminuir a preguiça de começar.
-   *Barra de progresso:* muita gente perde a noção do tempo no meio do dia. Em vez de só número, colocamos barra colorida que enche, que é mais fácil de entender batendo o olho.
-   *Aviso só no fim do bloco:* Jones et al. (2021) mostram que lembrete ajuda bastante, mas notificação demais faz a pessoa ignorar tudo. Então o app só chama no fim do bloco.

Requisitos não funcionais:
-   RNF01: Letra mínima de 16px e botão com pelo menos 48dp;
-   RNF02: Trocar de tela em menos de 2s;
-   RNF03: Rodar em Android (SDK mínimo 21).

---

## 3. METODOLOGIA

Fizemos em sprints curtos, um módulo por vez, com Git para versionar e cada um responsável por uma parte.

### 3.1 Ferramentas

-   **Expo** — jeito mais simples de rodar React Native sem configurar nativo;
-   **TypeScript** — JavaScript com tipo, que ajuda a pegar erro antes de rodar;
-   **expo-sqlite** — banco que fica dentro do app;
-   **expo-notifications** — alarme da saída e aviso de fim do bloco;
-   **React Navigation** — navegação por abas;
-   **VS Code** — editor que usamos.

### 3.2 Banco de dados

Modelamos quatro tabelas principais:

| Tabela | O que guarda |
|---|---|
| `tasks` | id, título, status (inbox/hoje/backlog/concluído), se está no hoje, horário |
| `today` | task_id, dia da semana |
| `checklist_saida` | id, texto, ordem, marcado ou não, data |
| `progresso_dia` | data, total de tarefas, concluídas, cor da barra |

A `tasks` recebe o que é anotado no Inbox; a `today` guarda as 3 do dia; a `checklist_saida` guarda os itens da porta; e a `progresso_dia` guarda o estado da barra para mostrar no Hoje.

### 3.3 Como foi o passo a passo

Cada sprint seguiu: (1) entender o requisito, (2) desenhar a tela em texto e no HTML, (3) programar em TypeScript, (4) testar no celular, (5) revisar o código do outro. No fim de cada ciclo a gente juntava os módulos e passava o checklist de aceite.

Congelamos o código três dias antes da apresentação para não quebrar nada na hora da demo.

---

## 4. DESENVOLVIMENTO

### 4.1 Tela Inbox

Um campo de texto de uma linha no topo. Apertou Enter, salva com data e hora. Não pergunta categoria nem prioridade na hora, para não travar e anotar em segundos.

Depois, em outra parte da tela, tem 4 opções por item: **[Fazer <2min]** / **[→Hoje]** / **[Backlog]** / **[Lixo]**. Decidir cada item leva uns 10 segundos.

### 4.2 Tela Hoje

Mostra no máximo 3 tarefas escolhidas pelo usuário. O limite de 3 foi de propósito, para não virar aquela lista gigante que ninguém faz — tem a ver com o Essencialismo (MCKEOWN, 2014). No topo tem a barra com hora atual, fração (ex.: `2/3`) e cor que muda com o progresso.

A escolha é sempre da pessoa, o app não sugere nada sozinho. O que não foi para o Hoje fica no backlog sem marcação de atraso. O botão [HOJE] no Inbox leva direto, sem abrir outra tela.

### 4.3 Tela Saída

Checklist de até 5 itens na ordem do caminho (ex.: chave, ponto, marmita, fone, portão). Um toque marca cada um. Depois tem o campo `saí às __:__` para registrar a hora.

Dá para programar um alarme uns 15 minutos antes (ex.: 7h25 para sair 7h40). Ele só toca se ainda tem pendência.

### 4.4 Timer Pomodoro

Timer de 25 minutos com iniciar e pausar. Quando acaba, mostra o progresso atualizado (ex.: "2/3 concluídos — 66%") e pergunta o próximo item. A mesma barra do Hoje aparece aqui, com vermelho (0-33%), amarelo (34-66%) e verde (67-100%).

### 4.5 Revisão Semanal

No domingo (ou na sexta, como preferir) dá para ver: total no Inbox, dias com inbox zerado e média de saídas. Também registra humor e sono e um ajuste para a semana seguinte.

---

## 5. TESTES E VALIDAÇÃO

Definimos 7 critérios de aceite e testamos na mão num Android com o app instalado.

| CA | Critério | Status |
|---|---|---|
| CA-PI01 | Anotar aparece na hora; apagar não trava com 50 itens | Aprovado |
| CA-PI02 | Hoje trava no 3º item e avisa na 4ª tentativa | Aprovado |
| CA-PI03 | Botão [HOJE] leva em 1 toque | Aprovado |
| CA-PI04 | Barra muda cor e % a cada conclusão | Aprovado |
| CA-PI05 | Aviso só dispara no fim do timer | Aprovado |
| CA-PI06 | Alarmes só tocam se tem pendência; toque abre o item | Aprovado |
| CA-PI07 | Abre pelo QR no Android depois de instalado; sem travar em 10min de demo | Aprovado |

A demo foi de 10 minutos seguindo o fluxo Inbox → Hoje → checklist → timer → revisão, num aparelho físico.

---

## 6. CONSIDERAÇÕES FINAIS

O trabalho cumpriu o que propôs: um app de rotina com React Native, TypeScript e SQLite, juntando as quatro disciplinas do semestre.

Para o nosso público — gente com rotina picada que esquece coisa na saída — a combinação de anotar rápido, só 3 no Hoje e checklist na porta funcionou bem nos testes.

Ficou para depois (ideia de TCC 2): sincronizar entre aparelhos, sugerir as 3 do dia e fazer versão para iOS. Na hora faltou tempo e gente, então cortamos sem dó para entregar funcionando.

O que a gente mais aprendeu: POO ajudou a organizar o banco com padrões, Mobile deu forma ao app, Tópicos Avançados ensinou a escrever requisito que dá para testar e Avaliação mostrou como provar que funciona com critério claro.

---

## REFERÊNCIAS

ALLEN, David. **Getting Things Done: a arte de fazer acontecer.** Rio de Janeiro: Sextante, 2015.

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 14724: informação e documentação – trabalhos acadêmicos – apresentação.** Rio de Janeiro: ABNT, 2011.

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 6023: informação e documentação – referências – elaboração.** Rio de Janeiro: ABNT, 2018.

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR 10520: informação e documentação – citações em documentos – apresentação.** Rio de Janeiro: ABNT, 2023.

GOLLWITZER, P. M.; SHEERAN, P. Implementation intentions and goal achievement: a meta-analysis of effects and processes. **Advances in Experimental Social Psychology,** v. 38, p. 69-119, 2006.

JONES, W. E.; BENGE, J. F.; SCULLIN, M. K. Preserving prospective memory in daily life: systematic review and meta-analysis. **Neuropsychology,** v. 35, n. 1, p. 123-140, 2021.

KERZNER, Harold. **Gestão de projetos: as melhores práticas.** 3. ed. Porto Alegre: Bookman, 2016.

MCKEOWN, Greg. **Essencialismo: o jeito indispensável de fazer menos e realizar mais.** Rio de Janeiro: Elsevier, 2014.

NIELSEN, Jakob. **Usabilidade na Web.** Rio de Janeiro: Elsevier, 2012.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de software: uma abordagem profissional.** 9. ed. Porto Alegre: AMGH, 2021.

SOMMERVILLE, Ian. **Engenharia de software.** 10. ed. São Paulo: Pearson, 2019.

VARGAS, Ricardo Viana. **Gerenciamento de projetos.** 8. ed. Rio de Janeiro: Brasport, 2016.
