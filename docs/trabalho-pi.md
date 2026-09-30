# Minha Rotina — Projeto Integrador

**Mateus**
**Helian**

Prof. Sosthenes Carlos Ferreira do Nascimento

Brasília-DF, setembro de 2026

---

## RESUMO

Este Projeto Integrador apresenta o desenvolvimento do Minha Rotina, um aplicativo de organização de rotina para adultos com rotina variável que acabam esquecendo itens ao sair de casa e perdendo prazos curtos. O app foi feito com React Native, TypeScript e banco SQLite no próprio aparelho. O trabalho junta o que vimos em quatro disciplinas: Programação para Dispositivos Móveis I, Programação Orientada a Objetos, Tópicos Avançados em ADS e Avaliação de Software. O desenvolvimento foi dividido em três sprints de duas semanas, com protótipo das telas antes do código e testes manuais no celular. O resultado é um app simples, em português e com conta local no próprio aparelho (e-mail e senha com hash SHA-256 e salt, sem servidor): uma tela de dia que junta o Inbox de captura rápida com o limite de 3 prioridades, mais o checklist de saída, o timer de 25 minutos e a revisão da semana.

Palavras-chave: Projeto Integrador; Desenvolvimento Mobile; React Native; GTD; Organização Pessoal.

## ABSTRACT

This Integrative Project presents Minha Rotina, a routine organization app for adults with variable schedules who often forget items when leaving home and miss short deadlines. The app was built with React Native, TypeScript and SQLite stored on the device. The work brings together four subjects: Mobile Programming I, Object-Oriented Programming, Advanced Topics in Systems Analysis and Development, and Software Evaluation. Development was split into three two-week sprints, with screen prototypes before coding and manual tests on a real phone. The result is a simple app, in Portuguese and with a local account stored on the device (e-mail and password hashed with SHA-256 and a salt, no server): a day screen that brings the quick-capture Inbox together with the 3-priority limit, plus the exit checklist, the 25-minute timer and the weekly review.

Keywords: Integrative Project; Mobile Development; React Native; GTD; Personal Organization.

---

## 1. INTRODUÇÃO

Quase todo mundo hoje tem celular, mas muita gente continua se perdendo na rotina. No nosso caso, o problema era bem concreto: a gente conferia as coisas no quarto e lembrava do que faltou já na escada, montava lista de 20 tarefas que mais travava do que ajudava e perdia prazo curto no meio de anotação espalhada. Os apps que testamos pediam conta, salvavam tudo em servidor ou eram em inglês, e a gente acabava largando.

A proposta do Minha Rotina foi fazer um app simples para esse dia a dia: anotar rápido, escolher só 3 coisas para o dia, marcar um checklist na hora de sair e usar um timer de 25 minutos para focar. Tudo em português e com os dados guardados no próprio celular, sem servidor. A captura e o dia do usuário acabaram na mesma tela, porque o caminho da ideia até a prioridade é um funil só e trocar de aba no meio dele só custava velocidade.

O projeto também serviu para juntar as matérias do semestre num trabalho só, que é a ideia do Projeto Integrador.

### 1.1 Objetivo Geral

Desenvolver um aplicativo de organização de rotina com React Native e TypeScript, com captura rápida, limite de 3 prioridades por dia e registro de atividades, usando banco local e conceitos vistos em sala.

### 1.2 Objetivos Específicos

-   Fazer a captura rápida de tarefa em texto livre, sem precisar classificar na hora;
-   Fazer o limite de no máximo 3 prioridades por dia, escolhidas pelo usuário;
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
-   RF05: Levar uma ideia capturada para as prioridades do dia com poucos toques, pela folha de ações do item;
-   RF06: Barra de progresso do dia com % e cor que muda (vermelho, amarelo, verde);
-   RF07: Aviso quando o bloco termina, perguntando o próximo item, sem apitar no meio do foco;
-   RF08: Revisão da semana com contagem de dias com inbox zerado.

Por que decidimos assim:
-   *Promoção com poucos toques:* Gollwitzer e Sheeran (2006) mostram que transformar intenção em ação de poucos toques ("se acontecer X, faço Y") aumenta a chance de cumprir. A ideia foi diminuir a preguiça de começar. Na primeira versão era um botão [HOJE] direto na linha; na revisão de interface virou um único lápis que abre a folha de ações, porque três botões em cada linha faziam o olhar ir para o controle em vez de ir para a tarefa.
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
-   **expo-notifications** — dependência prevista para o aviso de fim do bloco (RF07), ainda **não implementada** no código;
-   **React Navigation** — navegação por abas (pilha de autenticação + 4 abas);
-   **expo-linear-gradient** — a faixa colorida que identifica cada aba;
-   **VS Code** — editor que usamos.

### 3.2 Banco de dados

Modelamos nove tabelas:

| Tabela | O que guarda |
|---|---|
| `inbox_items` | id, conteúdo, prazo, categoria, data de criação |
| `hoje_items` | id, id do item de origem, conteúdo, prazo, categoria, marcado, data |
| `saida_items` | id, conteúdo, ordem, marcado |
| `saida_log` | horário de cada saída registrada |
| `timer_state` | chave e valor do ciclo em andamento |
| `ajustes_semanais` | texto do ajuste e data |
| `events` | evento do dia (por exemplo, inbox zerado), com data |
| `users` | nome, e-mail, salt e hash da senha |
| `meta` | chave e valor — guarda qual usuário está com a sessão aberta |

A `inbox_items` recebe o que é anotado; a `hoje_items` guarda as 3 do dia — as
duas são tabelas **separadas de propósito**, e não uma tabela só com um status,
porque foi exatamente essa escolha que evitou a perda de dado corrigida em
setembro: ao promover, o item é copiado para `hoje_items` e apagado do Inbox.
A `users` e a `meta` sustentam a conta local, sem servidor.

### 3.3 Como foi o passo a passo

Cada sprint seguiu: (1) entender o requisito, (2) desenhar a tela em texto e no HTML, (3) programar em TypeScript, (4) testar no celular, (5) revisar o código do outro. No fim de cada ciclo a gente juntava os módulos e passava o checklist de aceite.

Congelamos o código três dias antes da apresentação para não quebrar nada na hora da demo.

---

## 4. DESENVOLVIMENTO

### 4.1 Tela Inbox

Um campo de captura no meio da tela, com prazo e categoria opcionais logo abaixo
— dá para despachar em segundos e classificar depois, se quiser. Apertou *Guardar*,
o item entra na lista do Inbox com data e hora.

Cada item da lista carrega **um único botão: o lápis**. Ele abre uma folha de
ações com três opções — *virar prioridade de hoje*, *editar* e *excluir* — cada
uma com uma linha de texto explicando o efeito. Na primeira versão eram quatro
botões direto na linha (**[Fazer <2min]** / **[→Hoje]** / **[Backlog]** /
**[Lixo]**); a revisão de interface trocou por um só, porque quatro controles em
cada linha faziam o olhar ir para o botão em vez de ir para a tarefa. A folha
também avisa em texto, antes de você decidir, quando o dia já tem as 3
prioridades ocupadas.

### 4.2 Tela Hoje

Mostra no máximo 3 tarefas escolhidas pelo usuário. O limite de 3 foi de propósito, para não virar aquela lista gigante que ninguém faz — tem a ver com o Essencialismo (MCKEOWN, 2014). No topo tem a barra com hora atual, fração (ex.: `2/3`) e cor que muda com o progresso.

A escolha é sempre da pessoa, o app não sugere nada sozinho. O que não foi promovido fica no Inbox, sem marcação de atraso.

O Hoje e o Inbox chegaram a ser telas separadas. Na revisão de interface foram
fundidos numa tela só, com as prioridades no topo, a captura no meio e o Inbox
despejado embaixo: o caminho da ideia até a prioridade é um funil, e trocar de
aba no meio de um funil só custava velocidade.

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
