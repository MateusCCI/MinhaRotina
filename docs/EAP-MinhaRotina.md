# EAP — Minha Rotina (Estrutura Analítica do Projeto)

Decomposição orientada a entregas. Base: `TAP-PI-Minha-Rotina.md` §6 (objetivos), §11 (equipe), §12 (cronograma) e §13 (aceite).

## Visão hierárquica

```
1. Gerenciamento do PI
2. Requisitos e modelagem
3. Aplicativo mobile
4. Testes e qualidade
5. Entrega e banca
```

## Dicionário da EAP

### 1. Gerenciamento do PI
| Pacote | Entrega | Responsável | Sprint |
|---|---|---|---|
| 1.1 TAP | Termo de abertura aprovado | Equipe | S1 |
| 1.2 EAP | Este documento | Helian | S1 |
| 1.3 Slide | Apresentação de 10 min | Equipe | S3 |
| 1.4 Banca | Demo viva via QR + arguição | Equipe | Banca |

### 2. Requisitos e modelagem
| Pacote | Entrega | Responsável | Sprint |
|---|---|---|---|
| 2.1 Requisitos | Lista de RFs + regras por tela | Equipe | S1 |
| 2.2 DER | Diagrama com 5 tabelas (SQLite) | Mateus | S3 |
| 2.3 Protótipo de telas | `telas-minha-rotina.md` + `.html` navegável | Equipe | S1 |

### 3. Aplicativo mobile (Expo + TypeScript + SQLite, 100% offline)
| Pacote | Entrega | Responsável | Sprint | Aceite |
|---|---|---|---|---|
| 3.1 Setup | Projeto Expo, navegação por abas, banco local (Singleton) | Equipe | S1 | CA-PI07 |
| 3.2 Inbox | Add/list/del <10s offline, 50 itens sem travar | Helian | S1 | CA-PI01 |
| 3.3 Hoje | Até 3 prioridades (recomendado, sem trava) + barra de progresso + botão [HOJE] | Helian | S1 | CA-PI02 |
| 3.4 Saída | Checklist editável sem teto + hora salva + 1 alarme local | Mateus | S2 | CA-PI03, CA-PI06 |
| 3.5 Timer | Pomodoro de duração configurável (padrão 25:00) start/pause + notificação ao encerrar bloco | Mateus | S2 | CA-PI04 |
| 3.6 Revisão/Noite | Humor/sono offline + conta de inbox zerado da semana | Helian | S3 | CA-PI05 |

### 4. Testes e qualidade
| Pacote | Entrega | Responsável | Sprint |
|---|---|---|---|
| 4.1 Casos de teste | 10 casos manuais aprovados | Helian | S3 |
| 4.2 Validação de aceite | Checklist CA-PI01 a CA-PI07 executado na demo | Equipe | Banca |

### 5. Entrega e banca
| Pacote | Entrega | Responsável | Quando |
|---|---|---|---|
| 5.1 Instalável | APK instalado + QR testado em 1 Android | Mateus | S3 |
| 5.2 Backup | Vídeo de 60s da demo (contingência sem rede) | Equipe | S3 |
| 5.3 Congelamento | Código congelado 3 dias antes da banca | Equipe | -3 dias |

## Marcos

| Marco | Critério de saída |
|---|---|
| M1 (fim S1-S2) | Inbox + Hoje rodando via QR em 1 Android (demo viva) |
| M2 (fim S3-S4) | Saída + Pomodoro com fluxo da manhã testado |
| M3 (fim S5-S6) | Revisão + DER + slide + 10 testes aprovados |
| Banca | Demo de 10 min sem crash + arguição |
