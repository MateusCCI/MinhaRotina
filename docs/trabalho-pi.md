# Minha Rotina — Projeto Integrador

**Francisco Duó**

Prof. Sosthenes Carlos Ferreira do Nascimento

Brasília-DF, setembro de 2026

---

## RESUMO

O presente Projeto Integrador tem como objetivo desenvolver uma aplicação mobile de organização de rotina voltada a adultos com rotina variável e dificuldades de memória prospectiva, utilizando React Native e TypeScript. O trabalho aborda etapas de levantamento de requisitos, modelagem, desenvolvimento e testes, integrando conhecimentos de Programação para Dispositivos Móveis, Programação Orientada a Objetos, Tópicos Avançados em Análises e Desenvolvimento de Sistemas e Avaliação de Software. Para a construção do sistema, foram adotados princípios de projeto centrado no usuário, permitindo maior organização e autonomia no controle de tarefas. Além disso, o projeto evidencia a importância da interdisciplinaridade na formação acadêmica, aproximando teoria e prática. Como resultado, propõe-se um sistema funcional capaz de atender aos objetivos de captura rápida, definição diária e registro de atividades, demonstrando integração entre os saberes do curso.

Palavras-chave: Projeto Integrador; Desenvolvimento Mobile; React Native; GTD; Memória Prospectiva.

## ABSTRACT

This Integrative Project aims to develop a mobile routine organization app designed for adults with variable schedules and prospective memory difficulties, using React Native and TypeScript. The work addresses requirements gathering, modeling, development, and testing stages, integrating knowledge from Mobile Programming, Object-Oriented Programming, Advanced Systems Analysis and Development, and Software Evaluation. For system construction, user-centered design principles were adopted, enabling greater organization and autonomy in task management. Furthermore, the project highlights the importance of interdisciplinary learning, bridging theory and practice. As a result, a functional system is proposed capable of meeting objectives for rapid capture, daily definition, and activity logging, demonstrating integration among the course's knowledge areas.

Keywords: Integrative Project; Mobile Development; React Native; GTD; Prospective Memory.

---

## 1. INTRODUÇÃO

O avanço dos smartphones e a popularização de sistemas operacionais móveis trouxeram novas possibilidades para o controle de atividades cotidianas. No entanto, muitas pessoas — especialmente aquelas com rotina fragmentada, dificuldades de atenção ou deficiência de memória prospectiva — frequentemente acumulam tarefas não processadas e esquecem prazos curtos, o que gera estresse e impacto na produtividade.

Nesse cenário, o desenvolvimento de aplicações móveis que ofereçam **captura rápida**, **definição diária estruturada** e **registro de atividades** surge como alternativa para auxiliar o usuário a organizar seu dia de forma acessível.

O Projeto Integrador busca, portanto, aplicar os conhecimentos das disciplinas de Programação para Dispositivos Móveis I, Programação Orientada a Objetos, Tópicos Avançados em Análises e Desenvolvimento de Sistemas e Avaliação de Software na construção de um aplicativo — denominado **Minha Rotina** — que prioriza simplicidade, acessibilidade e privacidade.

### 1.1 Objetivo Geral

Desenvolver uma aplicação mobile de organização de rotina, utilizando React Native e TypeScript, com foco em captura rápida, definição diária de prioridades e registro de atividades, integrando conceitos de Programação Orientada a Objetos, Banco de Dados local e Tópicos Avançados.

### 1.2 Objetivos Específicos

-   Implementar tela de Inbox para captura rápida de tarefas em texto livre, sem obrigatoriedade de classificação imediata;
-   Desenvolver tela de Hoje (max 3 itens) com seleção manual de prioridades;
-   Construir checklist de saída com até 5 itens editáveis e registro de horário de saída;
-   Implementar timer Pomodoro de 25 minutos com start/pause;
-   Estruturar banco de dados local com SQLite para persistência dos dados;
-   Aplicar princípios de usabilidade e design centrado no usuário;
-   Validar o funcionamento do sistema por meio de critérios de aceite definidos.

---

## 2. FUNDAMENTAÇÃO TEÓRICA

### 2.1 Engenharia de Software

Pressman e Maxim (2021) afirmam que "quando um software é bem-sucedido — ou seja, quando atende às necessidades dos usuários, opera perfeitamente durante um longo período, é fácil de modificar e mais fácil ainda de utilizar —, ele pode mudar, e de fato muda, as coisas para melhor". Para alcançar esse nível, o autor defende a adoção de uma abordagem de engenharia disciplinada, que inclui levantamento de requisitos, análise, projeto, implementação, verificação e manutenção.

O livro destaca que a Parte I, "O processo de software", apresenta diferentes visões sobre modelos de processo, contemplando o debate entre as filosofias de processos ágeis e prescritivos. A Parte II, "Modelagem", fornece métodos de projeto e análise com técnicas orientadas a objetos. O modelo incremental adotado neste projeto dialoga diretamente com o Capítulo 3 ("Agilidade e processo") e o Capítulo 4 ("Modelo de processo recomendado"), que defendem a adaptação do processo às necessidades do projeto e dos usuários.

Sobre segurança, Pressman e Maxim (2021) ressaltam que "um requisito não funcional (NFR) de segurança deve ser considerado desde a fase de Requirements Analysis, e não como camada adicional posterior". Essa diretriz fundamenta a escolha por uma arquitetura que prioriza a privacidade dos dados do usuário.

Quanto ao desenvolvimento mobile, o autor observa que "o software residente em dispositivos móveis" representa uma área em crescimento, com desafios específicos de interface, limitações de hardware e necessidade de funcionamento offline — pontos centrais na decisão tecnológica deste projeto (Expo + SQLite).

Por fim, a Parte III do livro, "Qualidade e Segurança", apresenta conceitos de qualidade de software, garantia da qualidade (SQA) e estratégias de teste nos níveis de componentes e integração. O trabalho aplicou esses princípios por meio dos critérios de aceite (CA-PI01 a CA-PI07), realizados manualmente, alinhando-se à recomendação do autor de que "o engenheiro de software deve avaliar a qualidade do software, revisar produtos gerados e aplicar estratégias e táticas de teste".

### 2.2 Gestão de Projetos

Conforme Kerzner (2016), a gestão de projetos eficiente transcende o uso de ferramentas: trata-se de criar uma cultura organizacional na qual projetos sejam o veículo principal para a execução da estratégia. O autor define que as melhores práticas incluem planejamento estruturado, definição clara de escopo, gerenciamento de partes interessadas e acompanhamento contínuo por indicadores de desempenho (KPIs).

Neste trabalho, os KPIs foram traduzidos em critérios de aceite mensuráveis (CA-PI01 a CA-PI07), e o planejamento seguiu o padrão de divisão por módulos (Inbox, Hoje, Saída, Noite) com cronograma fixo de três sprints.

### 2.3 Requisitos Funcionais e Não Funcionais

Os requisitos foram levantados a partir de literatura especializada em memória prospectiva e organização pessoal, com destaque para a proposta de GTD (GETTING THINGS DONE), que defende a externalização de compromissos em um sistema confiável único, reduzindo a carga cognitiva.

Pressman e Maxim (2021) alertam que requisitos mal definidos são uma das principais causas de falha em projetos de software, enfatizando a necessidade de especificação clara, negociável e testável. Nesse sentido, os requisitos funcionais e não funcionais deste projeto foram documentados com critérios de aceite mensuráveis (CA-PI01 a CA-PI07), conforme metodologia recomendada pelo autor para garantir rastreabilidade entre intenção do usuário e implementação.

Foram definidos os seguintes **requisitos funcionais** para o MVP:
-   RF01: Capturar itens no Inbox com texto livre (máx. 500 caracteres);
-   RF02: Exibir max 3 tarefas no Hoje, escolhidas manualmente pelo usuário;
-   RF03: Checklist de saída com até 5 itens editáveis;
-   RF04: Timer Pomodoro de 25 minutos con start/pause;
-   RF05: Seleção rápida "hoje" no Inbox — botão [HOJE] em 1 toque, sem abrir tela de processamento;
-   RF06: Barra visual de progresso do dia — mostra hora atual, % de itens concluídos e cor muda (vermelho → amarelo → verde);
-   RF07: Notificação de transição — dispara ao encerrar um bloco ou task, perguntando "próximo item?"; não notifica por horário fixo de cada tarefa.
-   RF08: Revisão semanal simples (contagem de dias com Inbox zerado).

**Justificativa das decisões (baseada em evidência):**

-   *RF05 (seleção rápida):* Gollwitzer & Sheeran (2006) demonstram que implementar intenções ("se X, então Y") aumenta a taxa de cumprimento em d=0.65. O botão [HOJE] transforma "quero fazer depois" em "estou fazendo agora" em 1 toque, reduzindo a barreira de ativação — conceito central em memória prospectiva (CHEN et al., 2015).

-   *RF06 (barra de progresso):* A cegueira temporal é um sintoma bem documentado em adultos com TDAH, consistente com a dificuldade de perceber a passagem do tempo (SANTOS et al., 2020). A solução recomendada na literatura é externalizar o tempo visualmente, substituindo relógios numéricos por indicadores visuais como barras regressivas, que tornam o tempo concreto e imediato.

-   *RF07 (transição vs. horário):* JONES et al. (2021) mostram que auxílios externos de memória têm efeito g=0.805, mas também advertem contra excesso de notificações, que levam à habituação e ao descarte passivo pelo usuário. Notificar na transição (fim de bloco → "próximo item?") usa o momento de maior consciência do usuário, alinhado ao conceito de "fim de ciclo" do GTD.

Os **requisitos não funcionais** incluem:
-   RNF01: Interface com fonte mínima de 16px e botões de toque de 48dp;
-   RNF02: Tempo de resposta <2s para navegação entre telas;
-   RNF03: Compatibilidade com Android (SDK mínimo 21).

---

## 3. METODOLOGIA

O desenvolvimento foi realizado por meio de metodologia incremental, com três sprints sequenciais, utilizando versionamento Git e divisão de módulos por membro da equipe.

### 3.1 Ferramentas Utilizadas

-   **Expo (managed workflow)** — framework para desenvolvimento React Native simplificado;
-   **TypeScript** — tipagem estática para maior robustez do código;
-   **expo-sqlite** — banco de dados local embutido;
-   **expo-notifications** — alarmes locais para janelas de processamento;
-   **React Navigation** — navegação entre telas;
-   **VS Code** — ambiente de desenvolvimento integrado.

### 3.2 Estrutura do Banco de Dados

Foram modeladas quatro entidades principais:

| Tabela | Atributos principais |
|---|---|
| `tasks` | id, título, status (inbox/hoje/backlog/concluído), selecionado_hoje (boolean), hora_solicitada |
| `today` | task_id, dia_semana, selecionado_pelo_usuário |
| `checklist_saida` | id, label, ordem, concluído, data_referência |
| `progresso_dia` | data, total_tarefas, concluidas, cor_atual |

A entidade `tasks` recebe itens capturados no Inbox; `today` armazena as 3 seleções diárias; `checklist_saida` guarda a lista editável de itens de saída; `progresso_dia` armazena o estado da barra visual (cor e percentual) para exibir na tela Hoje.

### 3.3 Fluxo de Desenvolvimento

Cada sprint seguiu o padrão: (1) análise de requisito → (2) protótipo de tela (wireframe textual) → (3) implementação com TypeScript → (4) teste manual → (5) revisão de código. Ao final de cada ciclo, os módulos foram integrados e validados contra os critérios de aceite.

A versão final do código foi congelada três dias antes da defesa, garantindo estabilidade para a demonstração viva.

---

## 4. DESENVOLVIMENTO

### 4.1 Tela Inbox

A captura rápida é realizada por um único campo de texto com 1 linha. Ao pressionar Enter, o item é salvo com status `inbox` e timestamp. Não há pergunta de projeto, categoria ou prioridade na captura — isso evita a fadiga de decisão e mantém o tempo de ingresso abaixo de 10 segundos.

O processamento (movimentar para o Hoje, Backlog ou Lixo) ocorre em tela separada, onde o usuário responde 4 botões: **[Fazer <2min]** / **[→Hoje]** / **[Backlog]** / **[Lixo]**. Cada item leva cerca de 10 segundos para decidir.

### 4.2 Tela Hoje (com barra de progresso)

O Hoje permite escolher manualmente até 3 tarefas do Inbox. A restrição a 3 itens visa evitar sobrecarga cognitiva e paralisa por excesso de opções — princípio alinhado ao Essentialismo (MCKEOWN, 2014). No topo da tela, uma barra visual ocupa toda a largura, mostrando: hora atual (marcador vertical), percentual de conclusão (ex: `2/3`), e cor que muda conforme o progresso (vermelho → amarelo → verde).

Não há algoritmo de sugestão automática; a seleção é sempre explícita do usuário. Itens não selecionados permanecem no backlog, sem punição visual (nenhuma cor vermelha ou indicador de atraso). O botão [HOJE] na tela Inbox permite mover um item para o Hoje em 1 toque, sem abrir tela de processamento.

### 4.3 Tela Saída

A tela Saída exibe um checklist fixo (até 5 itens) na ordem do trajeto. Cada item é marcado com 1 toque. Após concluir, o usuário registra a hora de saída (`saí às __:__`).

Um alarme local pode ser configurado para tocar 15 minutos antes do compromisso (exemplo: 7h25 para sair às 7h40). O alarme dispara apenas se houver items pendentes no Inbox ou tarefas com vencimento próximo.

### 4.4 Timer Pomodoro

O timer oferece 25 minutos de foco com botão de start/pause. Ao encerrar, exibe automaticamente a barra de progresso do dia atualizada (ex: "2/3 concluídos — 66%") e dispara notificação de transição perguntando "próximo item?". A barra de progresso é também exibida no topo da tela Hoje, com cor dinâmica: vermelho (0-33%), amarelo (34-66%), verde (67-100%).

### 4.5 Revisão Semanal

A cada domingo (ou na sexta, conforme preferência), o usuário consulta um relatório simples que mostra: total de itens no Inbox, dias da semana com Inbox zerado e média de saídas registradas.

---

## 5. TESTES E VALIDAÇÃO

Foram elaborados 7 critérios de aceite (CA-PI01 a CA-PI07), testados manualmente em dispositivo Android via APK.

| CA | Critério | Status |
|---|---|---|
| CA-PI01 | Inbox add→visível em <10s; del sem travar com 50 itens | Aprovado |
| CA-PI02 | Hoje limitado a 3 (bloqueia a 4ª com aviso neutro) | Aprovado |
| CA-PI03 | Botão [HOJE] no Inbox move item em 1 toque | Aprovado |
| CA-PI04 | Barra de progresso atualiza a cada conclusão (cor + %) | Aprovado |
| CA-PI05 | Notificação de transição dispara só ao encerrar timer | Aprovado |
| CA-PI06 | 2 alarmes locais disparam só se Inbox >0 ou há ⏰; tap abre o item | Aprovado |
| CA-PI07 | Abre via QR em Android sem internet após instalado; zero crash na demo de 10min | Aprovado |

A demonstração foi conduzida em 10 minutos, com fluxo completo Inbox → Hoje 3 → checklist → timer → humor, usando dispositivo físico sem conexão com a internet.

---

## 6. CONSIDERAÇÕES FINAIS

O Projeto Integrador atingiu os objetivos propostos: uma aplicação mobile de organização de rotina, desenvolvida com React Native, TypeScript e SQLite, integrada às disciplinas de Programação para Dispositivos Móveis I, Programação Orientada a Objetos, Tópicos Avançados em Análises e Desenvolvimento de Sistemas e Avaliação de Software.

O sistema apresentou-se como solução viável para o público-alvo — adultos com rotina variável e dificuldades de memória prospectiva — ao combinar captura rápida, restrição a 3 itens no Hoje e checklist de saída.

Ficaram como trabalhos futuros: backend com sincronização segura, IA para sugerir as 3 tarefas do Hoje, gamificação leve (XP não monetizado) e expansão para iOS.

O projeto reforçou a importância da interdisciplinaridade: a Programação Orientada a Objetos trouxe padrões de projeto; o Mobile deu forma ao produto; os Tópicos Avançados orientaram a engenharia de requisitos; e a Avaliação de Software validou com critérios mensuráveis.

---

## REFERÊNCIAS

ABNT. NBR 6022: informação e documentação: artigo em publicação periódica científica impressa: apresentação. Rio de Janeiro, 2003.

ABNT. NBR 6023: informação e documentação: elaboração: referências. Rio de Janeiro, 2002.

ABNT. NBR 14724: informação e documentação: trabalhos acadêmicos: apresentação. Rio de Janeiro, 2002.

CHEN, X. J. et al. The effect of implementation intention on prospective memory: systematic and meta-analytic review. *Psychiatry Research*, v. 226, p. 14-22, 2015. DOI: 10.1016/j.psychres.2015.01.011.

GOLLWITZER, P. M.; SHEERAN, P. Implementation intentions and goal achievement: a meta-analysis of effects and processes. *Advances in Experimental Social Psychology*, v. 38, p. 69-119, 2006. DOI: 10.1016/S0065-2601(06)38002-1.

JONES, W. E.; BENGE, J. F.; SCULLIN, M. K. Preserving prospective memory in daily life: systematic review and meta-analysis. *Neuropsychology*, v. 35, n. 1, p. 123-140, 2021. DOI: 10.1037/neu0000704.

KERZNER, Harold. *Gestão de projetos: as melhores práticas*. 3. ed. Porto Alegre: Bookman, 2016.

MCKEOWN, Greg. *Essencialismo: o jeito indispensável de fazer menos e realizar mais*. Rio de Janeiro: Elsevier, 2014.

PRESSMAN, Roger S.; MAXIM, Bruce R. *Engenharia de software: uma abordagem profissional*. 9. ed. Porto Alegre: AMGH, 2021.

SHEERAN, P.; LISTROM, O.; GOLLWITZER, P. M. The when and how of planning: meta-analysis of the scope and components of implementation intentions in 642 tests. *European Review of Social Psychology*, v. 36, p. 162-194, 2025. DOI: 10.1080/10463283.2024.2334563.
