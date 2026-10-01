# Testes manuais — Minha Rotina (base do M3)

**Atualizado em 01/10/2026**: 4 abas (Hoje = Inbox + prioridades fundidos, Saída,
Timer, Revisão), **duração do bloco configurável** e **aviso de fim de bloco com
o app em segundo plano**. Os cenários 16–21 cobrem os defeitos corrigidos em
01/10 — alarme de saída empilhado, "hoje" em UTC, corrida do toggle, `0/7`
inventado na Revisão, contraste do erro no login e ciclo de 3 segundos no Timer.

## Como executar

```bash
npx expo start --web --clear   # navegador (uma aba só)
npx expo start                 # Expo Go (hotspot invertido ou --tunnel)
```

- **Web:** o SQLite fica em OPFS e **só uma aba por vez** usa o banco. Feche
  as outras abas deste endereço. Se a tela ficar branca depois de uma
  atualização, recarregue forçado **duas vezes** (`Ctrl+Shift+R`).
- Web e celular têm bancos separados. Para começar do zero: *Clear site data*
  no navegador, ou reinstalar o app.
- Abra o console (F12) e deixe visível. Critério de aceite: **sem erro vermelho
  no console** e sem crash.

## Cenário por cenário

### 1 — Cadastro
**Passos:** criar conta com nome, e-mail válido, senha (mín. 4) e repetir igual.
**Esperado:** entra direto na aba **Hoje**, já com a faixa verde, saudação
conforme o horário, data em português, as três zonas visíveis (Prioridades,
campo de captura, Inbox) e a tab bar com 4 abas. Se já houver ideias ou
prioridades, os três cartões de número aparecem na faixa.

### 2 — Cadastro inválido
**Passos:** cadastrar com senhas diferentes; depois com e-mail sem `@`.
**Esperado:** erro **inline** ("não coincidem" / "incompleto"), nada é criado,
você continua na tela de login.

### 3 — Login
**Passos:** Revisão → *Trocar*; entrar com e-mail + senha certa; depois com
senha errada; depois com e-mail que não existe.
**Esperado:** a conta certa entra; as outras duas mostram "Senha incorreta" e
"Não achei esse e-mail". Nenhum dos três pode ser silencioso (ver cenário 12).

### 4 — Captura
**Passos:** despejar 2 ideias — uma com prazo *Hoje* + categoria *Trabalho*,
outra sem nada.
**Esperado:** as duas aparecem **no topo** do Inbox, em faixas de uma linha só.
A primeira mostra o pill da categoria com o ícone dela (maleta, no azul) e, do
prazo, **só o círculo com o glifo** (relógio, no âmbar) — a palavra fica no
rótulo de acessibilidade, não na linha. A segunda fica só com o texto e o
lápis. **Ideia com nome comprido** deve truncar com reticências, nunca com o
pill em cima do texto.

### 5 — Promover (regressão do bug de 28/09)
**Passos:** na ideia, tocar no **lápis** → *Virar prioridade de hoje*.
**Esperado:** o item **some do Inbox e aparece na zona "Prioridades de
hoje"**, no topo da tela, com o texto e os mesmos pills. **Falha aqui é
bloqueante: é o bug de perda de dado.** O contador de prioridades sobe para
1/3 e o badge da aba mostra quantas ideias ainda esperam.

### 6 — Limite de 3
**Passos:** promover 3 itens; tentar promover um 4º pelo lápis.
**Esperado:** a folha **avisa em texto** que o foco já está cheio (3/3) antes
de você decidir, e ao confirmar aparece o aviso "Limite de foco". O 4º item
**fica no Inbox**, sem sumir.

### 7 — Concluir
**Passos:** marcar o checkbox de uma prioridade.
**Esperado:** risca o texto, o contador vira 1/3, o cartão de concluído mostra
a % e a barra muda de cor (vermelho → âmbar → verde, em 34% e 67%).

### 8 — Editar e excluir
**Passos:** no lápis de uma ideia → *Editar*, mudar texto/prazo/categoria,
salvar. Depois no lápis → *Excluir*.
**Esperado:** a edição persiste e o pill acompanha; a exclusão some o item e,
se o Inbox esvaziar, aparece o empty state em bloco colorido. Os chips de
categoria no sheet de edição já aparecem coloridos.

### 9 — Acessibilidade dos prazos
**Passos:** criar itens com prazo *ontem* (ou esperar), *hoje* e *amanhã*.
**Esperado:** os três pills têm **ícones diferentes** — `alert-circle`
(atrasado, vermelho), `time` (hoje, âmbar) e `calendar-outline` (futuro,
cinza). A informação não pode depender só da cor: quem não distingue
vermelho de verde precisa ler o ícone. Checagem rápida: force a tela e veja se
os três continuam legíveis.

### 10 — Saída: checklist e o único lápis
**Passos:** *Adicionar* → criar item. Depois *Editar tudo* → renomear dois
itens (um apertando "pronto" no teclado, outro só clicando fora do campo) →
excluir um (confirmação) → *Pronto*. Marcar todos e *Confirmar saída*.
**Esperado:**
- na lista **não há lápis nem lixeira por linha** — a linha é só checkbox e
  texto. Existe **um** botão *Editar tudo*;
- renomear no campo grava (ao sair do campo ou no "pronto") e a lista de
  baixo **não sobrescreve** o que está sendo digitado enquanto a folha está
  aberta;
- a confirmação de exclusão **aparece** e o item sai da lista;
- *Pronto* fecha; o botão de confirmar saída só libera com tudo marcado,
  registra a hora, e a revisão conta mais uma saída no dia.

### 11 — Timer: relógio, persistência e fim de bloco
**Passos:** zerar, anotar o relógio, esperar **30 segundos**, ler de novo.
Depois: iniciar, trocar de aba, voltar, pausar, retomar, zerar.
**Esperado:**
- o relógio anda **no ritmo certo** — em 30 s de espera ele perde 30 s, não
  30 min (bug corrigido em 29/09: o timer era quadrático e acelerava);
- *Continuar* **retoma** de onde parou, não volta a 25:00;
- trocar de aba não zera; a pausa congela; *Zerar* limpa;
- **"Zerar" não abre a folha de fim de bloco** — zerar não é terminar;
- a barra do ciclo mostra a % com o rótulo "Progresso do ciclo".

**Como medir sem calendário:** anote o relógio (ex.: 00:24:30), espere 30 s,
leia de novo. Tem que estar perto de 00:24:00. Se perder minutos em segundos,
o relógio voltou a ser quadrático.

### 12 — Aviso de fim de bloco (RF07)
**Passos:** escolher **5 minutos** na engrenagem da aba Timer (ver cenário 22)
e deixar o ciclo terminar.
**Esperado:** abre uma folha com "Bloco de 5 minutos concluído" — o texto
acompanha a duração escolhida —, o progresso do dia no formato `x/3
concluídas — NN%` e as prioridades em aberto para escolher. Se as 3 estiverem
concluídas, a folha pede pausa em vez de oferecer trabalho. O aviso **não**
oferece adicionar uma 4ª prioridade, e **não aparece durante o ciclo** — só
no fim. O aviso de sistema correspondente está no cenário 23.

### 13 — Avisos no navegador (bug de 29/09)
**Passos:** no **navegador**, provocar qualquer aviso: promover com foco cheio,
excluir um item da Saída, ou entrar com senha errada.
**Esperado:** o aviso **aparece**. O `Alert` do react-native-web é no-op
silencioso — se nada aparecer, o shim `src/lib/notify.ts` não está sendo usado.
**Este cenário só vale no web; no celular o diálogo é nativo.**

### 14 — Lembrete de saída
**Passos:** aba Saída → *Programar lembrete*. Mexer nos botões de 15 min.
**Esperado:** o card mostra o horário escolhido e, abaixo, **a hora em que o
celular avisa** (15 min antes). Agendar de novo substitui o agendamento
anterior, e *Desligar lembrete* cancela. No navegador o aviso aparece no app
aberto; **no Android ele chega com o app fechado** — essa parte só dá para
confirmar no aparelho, e é a validação que falta para o CA-PI07.
**Limitação conhecida:** a contagem de pendências vai congelada no momento do
agendamento (notificação local não lê o banco depois). O texto do rodapé da
tela Saída avisa isso.

### 15 — Revisão
**Passos:** ver % do dia e o resumo da semana, salvar um ajuste, trocar de perfil.
**Esperado:** o ajuste aparece em "Ajustes anteriores"; *Trocar* volta ao login;
os números da faixa batem com a tela do dia.

### 16 — Alarme de saída não se acumula (bug de 01/10)
**Passos:** aba Saída → *Programar lembrete* → escolher 15 min. **Repita três
vezes**, mudando o horário. Depois vá na área de notificações do sistema.
**Esperado:** existe **um só** lembrete de saída, no horário escolhido por
último. Antes, cada reagendamento adicionava um alarme porque a notificação
recebia um identificador sorteado pela biblioteca e o cancelamento procurava
outro — "Desligar lembrete" não desligava nada. Depois de *Desligar lembrete*,
**zero** lembretes na área de notificações.

### 17 — Itens da noite não somem do Hoje (bug de 01/10)
**Passos:** entre **21h e meia-noite**, capturar um item pelo campo do Hoje.
Espere alguns minutos e volte para a aba Hoje. Compare com o Inbox.
**Esperado:** o item continua na lista de prioridades **e** não aparece
duplicado no Inbox. Antes, o "hoje" era o dia UTC: num fuso UTC-3 um item
criado às 20h locais (23h UTC) deixava de aparecer no Hoje a partir das 21h,
e o reset diário o devolvia ao Inbox como se fosse de ontem.

### 18 — Toques rápidos na caixa de seleção (bug de 01/10)
**Passos:** toque duas vezes, **muito rápido**, no quadrado de um item do
Hoje. Toque de novo para desfazer.
**Esperado:** o quadrado e a lista **sempre concordam** com o que está salvo, e
cada toque visível produz uma mudança. Antes, dois toques alternavam o mesmo
valor duas vezes e o segundo era engolido, e a tela mantinha um estado
paralelo ao banco.

### 19 — Remover item do Hoje (bug de 01/10)
**Passos:** em um item do Hoje, abrir as ações e escolher remover.
**Esperado:** o item some **e** aparece um aviso se a remoção falhar. Antes, a
função era passada diretamente ao item e a falha virava rejeição sem
tratamento: o item sumia da tela sem nenhum aviso.

### 20 — Revisão não inventa número (bug de 01/10)
**Passos:** aba Revisão. Depois: forçar falha de leitura (com o app aberto,
fechar o servidor de desenvolvimento e recarregar a tela).
**Esperado:** **não** aparece `0/7 dias zerados` nem `0 saídas` antes da
leitura terminar nem quando ela falha — no lugar da faixa surge o painel
"Não consegui ler seu dia" com **Tentar de novo**. Antes, o `catch` zerava os
números e a tela afirmava que nenhum dia tinha sido zerado. Ao voltar para a
aba (ou puxar para baixo), os números recarregam: as abas do React Navigation
ficam montadas e a tela exibia os números de quando o app foi aberto.

### 21 — Timer: ciclo de 3 segundos e "Continuar" em 00:00 (bug de 01/10)
**Passos:** iniciar o bloco; **pausar**; **retomar**; repetir. Deixe o ciclo
terminar e, com o relógio em `00:00`, toque em *Continuar*.
**Esperado:** o relógio avança em **tempo real** e o ciclo não reinicia sozinho.
Antes, dois toques em Iniciar criavam dois laços de animação competindo e o
bloco fechava em segundos; e *Continuar* em `00:00` rodava um ciclo de duração
zero que reabria sozinho a folha de conclusão.

### 22 — Duração do bloco configurável
**Passos:** aba Timer → engrenagem ao lado do texto de ajuda → escolher **5**,
**15**, **45** e **25**.
**Esperado:** o relógio mostra a duração escolhida, a barra de progresso
acompanha, a faixa passa a exibir "termina às HH:MM" e o título da folha de
conclusão acompanha ("Bloco de 5 minutos concluído"). **Reabra o app:** a
duração continua a mesma. Ao trocar a duração com um ciclo em andamento, o
bloco **zera** de propósito — o que é preferível a exibir progresso medido
numa régua que mudou.

### 23 — Aviso de fim de bloco com o app fechado
**Passos:** **no aparelho**, configure um bloco de **5** minutos, toque em
*Começar* e **feche o app** (não minimizes: feche). Espere o bloco terminar.
**Esperado:** chega **uma** notificação do sistema ("Bloco de 5 min concluído").
Com o app aberto, **não** chega notificação — quem informa é a folha de
conclusão dentro do app, que mostra o quanto do dia saiu e oferece a próxima
prioridade. Teste também **pausar**: o aviso agendado é cancelado e nada
dispara no fim. **Esta parte só dá para confirmar no aparelho**; no navegador
não há notificação de sistema e o aviso vale só dentro do app.

## Critério de aceite

## O que estes testes não pegam

Nenhum cenário automático diz se a interface ficou **bonita** ou se o contraste
passa em tela de verdade. A checagem de faixa colorida, altura da faixa em tela
pequena e legibilidade dos números é **humana** — rode o app no aparelho e
olhe. É onde o feedback do professor sobre as "4 cores" veio.
