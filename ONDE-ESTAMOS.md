ONDE ESTAMOS — LEIA PRIMEIRO
==============================

Este arquivo é o ponto de partida de qualquer sessão nova. Não depende de
nada externo: está no repositório, então quem abrir o projeto já sabe o que
fazer sem procurar nada.

ESTADO EM 01/10/2026
--------------------

App funcional e completo. 4 abas (Hoje, Saída, Timer, Revisão), banco
SQLite local com 9 tabelas, 83 commits publicados em:

    https://github.com/MateusCCI/MinhaRotina

O QUE FAZER AGORA
-----------------

1. Rodar os cenários 16–23 no aparelho Android (docs/TESTES-MANUAIS.md).
   É a única pendência técnica: fecha o CA-PI07 e valida o aviso de fim de
   bloco com o app fechado. No navegador o aviso vale só com o app aberto.

2. Trocar o nome da capa do relatório. Ainda diz
   "Sosthenes Carlos Ferreira do Nascimento".
   CUIDADO: não abrir esse arquivo para salvar — o editor de texto reescreve a
   estrutura interna e já perdeu um parágrafo do relatório aqui. Salvar uma
   cópia, conferir o texto, e só então substituir o original.

ONDE ESTÁ CADA COISA
--------------------

    README.md              visão geral do projeto (comece por aqui)
    iniciar.sh             sobe o servidor de desenvolvimento
    COMO-EXECUTAR.txt      comando para rodar, em texto simples
    docs/TAP-*.md          abertura do projeto, escopo "Terá / Não terá"
    docs/EAP-*.md          estrutura analítica, pacotes e responsáveis
    docs/DESIGN.md         decisões de produto e as regras que firmaram
    docs/TESTES-MANUAIS.md roteiro de 23 cenários
    docs/MinhaRotina-PI.docx   relatório final (19 páginas, ABNT)

    docs/interno/          NOTA: ignorado pelo GitHub
      STATUS.md            a foto da situação — leia primeiro
      HANDOFF.md           histórico técnico, armadilhas e porquês

    lixeira/               descartável, ignorado pelo GitHub

AS CINCO REGRAS QUE FIRMARAM
----------------------------

Estas quebraram alguma coisa quando não foram respeitadas:

1. TRABALHE EM CÓPIA, nunca no original — para o relatório e para o servidor.
   O editor de texto reescreve a estrutura interna do arquivo do Word e já
   perdeu um parágrafo inteiro do relatório aqui.

2. CONFIRA A CONTAGEM DE PALAVRAS depois de toda edição do relatório.
   Backup restaura; comparação denuncia. Um arquivo pode abrir
   lindamente e ter perdido um parágrafo sem dar erro nenhum.

3. NÚMERO DE REGRA EM UM LUGAR SÓ — src/lib/limites.ts. Declarar o "3" no
   banco e na tela foi o que os fez discordarem sem teste nenhum acusar.

4. AUDITORIA É VARREDURA, NÃO BUSCA. Procurar só o que já se suspects
   deixou passar cinco afirmações falsas no relatório. Varra o texto todo.

DETALHES QUE ESTÃO SÓ NO MACHINE
--------------------------------

docs/interno/ tem o STATUS e o HANDOFF completos, com o histórico de
cada sessão e as armadilhas. Não está no GitHub de propósito: são notas de
trabalho, não entregável. Se uma sessão nova precisar delas, estão no
disco — em docs/interno/.

A ferramenta `nota` fica em ~/Note2026/docx-llm (repo próprio, 2 commits),
fora deste repositório de propósito.