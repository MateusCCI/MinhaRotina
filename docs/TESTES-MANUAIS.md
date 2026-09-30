# Testes manuais — Minha Rotina (base do M3)

**Atualizado em 29/09/2026** para a estrutura de **4 abas** (Hoje = Inbox +
prioridades fundidos, Saída, Timer, Revisão). Os cenários de Inbox e Hoje
foram reescritos; os demais só mudaram de aba.

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
**Esperado:** as duas aparecem **no topo** do Inbox. A primeira mostra dois
pills: o da categoria com o ícone dela (maleta, no azul) e o de prazo
*vence hoje* (relógio, no âmbar). A segunda, sem pills.

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
**Passos:** deixar um ciclo de 25 min terminar. Para não esperar, dá para
esperar de verdade ou Reduce Motion; **não há atalho de teste** — se quiser
acelerar, troque `TOTAL_MS` temporariamente em `app/(tabs)/timer/index.tsx`.
**Esperado:** abre uma folha com "Bloco de 25 minutos concluído", o progresso
do dia no formato `x/3 concluídas — NN%` e as prioridades em aberto para
escolher. Se as 3 estiverem concluídas, a folha pede pausa em vez de oferecer
trabalho. O aviso **não** oferece adicionar uma 4ª prioridade, e **não
aparece durante o ciclo** — só no fim.

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

## Critério de aceite

Todos os cenários com ✅, **sem erro vermelho no console** e sem crash.
Falha no **5** é bloqueante (perda de dado). Falha no **11** significa que o
relógio voltou a correr acelerado. Falha no **13** significa que a feedback de
erro voltou a ser silencioso — o app *parece* funcionar enquanto esconde
problema, que é o pior tipo de falha.

## O que estes testes não pegam

Nenhum cenário automático diz se a interface ficou **bonita** ou se o contraste
passa em tela de verdade. A checagem de faixa colorida, altura da faixa em tela
pequena e legibilidade dos números é **humana** — rode o app no aparelho e
olhe. É onde o feedback do professor sobre as "4 cores" veio.
