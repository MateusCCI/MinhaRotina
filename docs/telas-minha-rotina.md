# Telas do Minha Rotina — Desenho em Texto

> **Protótipo da fase M1, antes do código.** Desenhado para validar as telas e
> fazer a EAP; não é o estado final do app.
>
> O que mudou depois: **Inbox e Hoje viraram uma tela só** (as prioridades no
> topo, a captura no meio, o inbox embaixo, em 4 abas no total), e a paleta
> passou a ter uma família de cor por aba. O desenho abaixo ainda mostra as 5
> telas separadas. Para o contrato visual do que foi entregue, ver
> [`DESIGN.md`](DESIGN.md).


## TELA 1 — Inbox (Home / Captura)

```
┌─────────────────────────────────────┐
│  MINHA ROTINA     [Inbox (4)]       │
├─────────────────────────────────────┤
│                                     │
│  + Despejar: _________________ [✓]  │
│                                     │
├─────────────────────────────────────┤
│  📥 INBOX                           │
│                                     │
│  ○ pagar luz amanhã #casa           │
│  ○ levar marmita                    │
│  ○ revisar SQL                      │
│  ○ ligar para João                  │
│                                     │
│  [+] Novo    [→ Hoje]    [🗑]       │
└─────────────────────────────────────┘
```

**Interações:**
- Campo superior = captura em 1 toque (Enter salva)
- Botão `[→ Hoje]` no item = move p/ Hoje em 1 toque
- Botão `[🗑]` = remove sem confirmação
- Inbox com >10 itos = vira 1 tarefa "zerar inbox (10min)"

---

## TELA 2 — Hoje (max 3)

```
┌─────────────────────────────────────┐
│  MINHA ROTINA          🔴 🟡 🟢     │
├─────────────────────────────────────┤
│  07:45  ████████░░░░░░░░░░  33%     │
├─────────────────────────────────────┤
│  □ Sair 7h40                        │
│  □ 1 bloco SQL (6 tarefinhas)       │
│  □ Dormir 23h30                     │
│                                     │
│  [+] Despejar     [📋 Saída]        │
└─────────────────────────────────────┘
```

**Barra de progresso:**
- Cor muda: 🔴 0-33% → 🟡 34-66% → 🟢 67-100%
- Preenche conforme itens são marcados ✓
- Hora atual marcada com | na barra

**Interações:**
- Checkbox grande (≥48dp)
- 1 toque = marcar/desmarcar
- Botão `[📋 Saída]` = vai p/ tela Saída
- Botão `[+]` = volta p/ Inbox

---

## TELA 3 — Saída

```
┌─────────────────────────────────────┐
│  ← SAÍDA     ⏰ 7h25 (em 40min)     │
├─────────────────────────────────────┤
│                                     │
│  □ chave                            │
│  □ ponto                            │
│  □ marmita                          │
│  □ fone                             │
│  □ portão                           │
│                                     │
│  [Editar lista]                     │
│                                     │
│  Saí às: [__:__]  [Confirmar]       │
└─────────────────────────────────────┘
```

**Interações:**
- Checklist ≤5 itens editáveis
- 1 toque por item (✓ grande)
- Alarme local configura hora de sair -15min
- Campo "Saí às" = registro manual de horário
- Botão `[Editar lista]` = abre lista de itens

---

## TELA 4 — Timer Pomodoro

```
┌─────────────────────────────────────┐
│  MINHA ROTINA        [Timer]        │
├─────────────────────────────────────┤
│                                     │
│           25:00                     │
│           ●●●●●                     │
│                                     │
│      [Iniciar]   [Pausar]           │
│                                     │
├─────────────────────────────────────┤
│  Progresso do dia: 2/3 (67%) 🟢     │
│  Próximo: Dormir 23h30              │
└─────────────────────────────────────┘
```

**Interações:**
- Timer 25min start/pause
- Ao encerrar = notificação de transição: "próximo item?"
- Barra de progresso mostra % do dia
- Cor muda conforme progresso

---

## TELA 5 — Revisão Semanal

```
┌─────────────────────────────────────┐
│  MINHA ROTINA        [Revisão]      │
├─────────────────────────────────────┤
│                                     │
│  📊 RESUMO DA SEMANA                │
│                                     │
│  Inbox zerado: 4/7 dias             │
│  Saídas registradas: 5               │
│  Média saída: 8h07                   │
│                                     │
│  Ajuste da semana: _______________  │
│                                     │
│  [Fechar]                           │
└─────────────────────────────────────┘
```

**Navegação:**
```
┌─────────────────────────────────────┐
│  [📥 Inbox]  [📅 Hoje]  [🚪 Saída]  [⏱ Timer]  [📊 Revisão] │
└─────────────────────────────────────┘
```
