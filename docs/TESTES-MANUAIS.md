# Testes manuais — Minha Rotina (base do M3)

Como executar: `npx expo start --web --clear` (web, 1 aba) ou Expo Go (hotspot
invertido ou `--tunnel`). Marque ✅/❌ e anote o observado. Web usa banco OPFS
separado do celular — zere com Clear site data antes de começar.

| # | Fluxo | Passos | Esperado |
|---|---|---|---|
| 1 | Cadastro | Criar conta (nome + e-mail válido + senha 4 + repetir igual) | Entra no Inbox; saudação + data no header |
| 2 | Cadastro inválido | Senhas diferentes; depois e-mail sem @ | Erro inline "não coincidem" / "incompleto"; não cria |
| 3 | Login | Sair (Revisão → Trocar), entrar com e-mail + senha certa; depois senha errada | Entra com a certa; "Senha incorreta" com a errada |
| 4 | Captura | Despejar 2 ideias (uma com prazo Hoje + categoria) | Aparecem no topo, com pills de prazo/categoria |
| 5 | Promover (bug fix) | "Virar prioridade" numa ideia | Some do Inbox **e aparece no Hoje** (regressão do bug 28/09) |
| 6 | Limite 3 | Promover 3, tentar a 4ª | Aviso "Limite de foco"; 4ª continua no Inbox |
| 7 | Hoje | Concluir 1, filtrar por categoria, remover 1 | Barra muda % e cor; filtro isola; some da lista |
| 8 | Saída CRUD | Adicionar item, renomear, excluir (com confirmação), marcar todos, Confirmar | CRUD persiste; botão só libera com tudo marcado; registra hora |
| 9 | Timer | Iniciar, trocar de aba e voltar, pausar, zerar | Tempo persiste (não zera); pausa congela; zerar limpa |
| 10 | Revisão | Ver % e estatísticas, salvar ajuste, trocar de perfil | Ajuste aparece em "anteriores"; troca volta ao login |

Critério de aceite: 10/10 ✅ sem erro no console (F12) e sem crash. Falha em 5
é bloqueante (perda de dado).
