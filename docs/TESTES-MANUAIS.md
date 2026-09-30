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

### 10 — Saída
**Passos:** adicionar item, renomear, excluir (com confirmação), marcar todos,
*Confirmar saída*.
**Esperado:** o CRUD persiste; a confirmação de exclusão **aparece**; o botão
de confirmar só libera com tudo marcado e registra a hora; ao sair, a revisão
conta mais uma saída no dia.

### 11 — Timer
**Passos:** iniciar, trocar de aba e voltar, pausar, zerar.
**Esperado:** o tempo **persiste** (não zera ao trocar de aba), a pausa congela,
o zerar limpa, e a barra do ciclo mostra a % com o rótulo "Progresso do ciclo".

### 12 — Avisos no navegador (bug de 29/09)
**Passos:** no **navegador**, provocar qualquer aviso: promover com foco cheio,
excluir um item da Saída, ou entrar com senha errada.
**Esperado:** o aviso **aparece**. O `Alert` do react-native-web é no-op
silencioso — se nada aparecer, o shim `src/lib/notify.ts` não está sendo usado.
**Este cenário só vale no web; no celular o diálogo é nativo.**

### 13 — Revisão
**Passos:** ver % do dia e o resumo da semana, salvar um ajuste, trocar de perfil.
**Esperado:** o ajuste aparece em "Ajustes anteriores"; *Trocar* volta ao login;
os números da faixa batem com a tela do dia.

## Critério de aceite

Todos os cenários com ✅, **sem erro vermelho no console** e sem crash.
Falha no **5** é bloqueante (perda de dado). Falha no **12** significa que a
feedback de erro voltou a ser silencioso — o app *parece* funcionar enquanto
esconde problema, que é o pior tipo de falha.

## O que estes testes não pegam

Nenhum cenário automático diz se a interface ficou **bonita** ou se o contraste
passa em tela de verdade. A checagem de faixa colorida, altura da faixa em tela
pequena e legibilidade dos números é **humana** — rode o app no aparelho e
olhe. É onde o feedback do professor sobre as "4 cores" veio.
