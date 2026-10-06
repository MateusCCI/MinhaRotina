#!/usr/bin/env bash
#
# Inicia o servidor de desenvolvimento do Minha Rotina.
#
# Uso:
#   ./iniciar.sh                 web (padrão)
#   ./iniciar.sh fone            QR para o Expo Go
#   ./iniciar.sh android         emulador ou aparelho Android conectado
#   ./iniciar.sh --limpar        limpa o cache antes (use quando a tela
#                                ficar branca no navegador)
#   ./iniciar.sh --fundo         roda em segundo plano, log em /tmp
#   ./iniciar.sh --porta 8090    usa outra porta (pode ja haver algo na 8081)
#
# Para parar:
#   Ctrl+C                       (modo normal)
#   pkill -f 'expo start'        (modo --fundo)

set -euo pipefail

# Resolve a pasta do projeto a partir da localização deste arquivo, para o
# script funcionar de qualquer diretório e não depender do caminho fixo de
# uma máquina só.
cd "$(dirname "$(readlink -f "$0")")"

ALVO="web"
LIMPAR=0
FUNDO=0
PORTA_PADRAO="${EXPO_PORT:-8081}"
PORTA_ALVO="$PORTA_PADRAO"

# while + shift, e não `for arg in "$@"`: num for, o shift mexe nos posicionais
# mas o for já capturou a lista, e o "${2}" pega o argumento errado.
uso() { sed -n '3,16p' "$0" | sed 's/^# \{0,1\}//'; }
while [ $# -gt 0 ]; do
  case "$1" in
    web|android|fone) ALVO="$1"; shift ;;
    --limpar)        LIMPAR=1; shift ;;
    --fundo)         FUNDO=1; shift ;;
    --porta)
      if [ -z "${2:-}" ]; then echo "--porta precisa de um número" >&2; uso; exit 1; fi
      PORTA_ALVO="$2"; shift 2 ;;
    -h|--help)       uso; exit 0 ;;
    *) echo "opção desconhecida: $1" >&2; uso; exit 1 ;;
  esac
done

echo "Minha Rotina — servidor de desenvolvimento"
echo "-------------------------------------------"

# --- Pré-requisitos -------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "ERRO: node não encontrado no PATH." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "ERRO: node_modules ausente. Rode 'npm install' primeiro." >&2
  exit 1
fi

# Porta já ocupada: quase sempre é uma instância antiga deste mesmo servidor,
# e subir uma segunda dá symptomas confusas (o navegador abre a aba velha).
# Só shell de um lado: em 'awk -v p=...', o p pertence ao awk, e um
# '"$p"' aqui seria expansão do shell — que com 'set -u' aborta o script e,
# sem ele, vira string vazia, que casa com qualquer linha.
if command -v ss >/dev/null 2>&1 \
   && ss -ltn 2>/dev/null | awk '{print $4}' | cut -d: -f2 | grep -qxF "${PORTA_ALVO}"; then
  echo
  echo "ATENÇÃO: a porta ${PORTA_ALVO} já está em uso por outro processo."
  echo "Isso NÃO é o Minha Rotina. Escolha uma das duas saídas:"
  echo "  a) usar outra porta:   ./iniciar.sh ${ALVO} --porta 8090"
  echo "  b) liberar a ${PORTA_PADRAO} (só se for deste projeto):"
  echo "     pkill -f 'expo start'"
  echo
fi

# --- Comando --------------------------------------------------------------
CMD=(npx expo start --port "$PORTA_ALVO")
[ "$LIMPAR" -eq 1 ] && CMD+=(--clear)
case "$ALVO" in
  web)     CMD+=(--web) ;;
  android) CMD+=(--android) ;;
  fone)    : ;;   # sem flag: mostra o QR para ler no Expo Go
esac

# ${LIMPAR:+...} expande para qualquer valor nao nulo, inclusive "0" — por
# isso o rotulo era calculado a mao em vez de usar o parametro bash.
if [ "$LIMPAR" -eq 1 ]; then
  echo "modo:      ${ALVO}, com cache limpo"
else
  echo "modo:      ${ALVO}"
fi
echo "node:      $(node --version)"
echo

# --- Modo segundo plano ---------------------------------------------------
if [ "$FUNDO" -eq 1 ]; then
  LOG=/tmp/minharotina-dev.log
  # setsid, e não apenas nohup: nohup só ignora SIGHUP, e o servidor ainda
  # morre junto se o grupo de processos receber SIGTERM (é o que acontece ao
  # fechar o terminal que o iniciou). setsid abre uma sessão nova.
  if command -v setsid >/dev/null 2>&1; then
    setsid nohup "${CMD[@]}" > "$LOG" 2>&1 &
  else
    nohup "${CMD[@]}" > "$LOG" 2>&1 &
  fi
  PID=$!
  # Sem TTY o Expo não pergunta nada: se a porta estiver ocupada, ele imprime
  # "Skipping dev server" e sai — e o processoExists mas não serve nada.
  # Confiar no PID é exatamente o que fez este script anunciar sucesso com o
  # servidor desligado.
  echo "aguardando o Metro subir..."
  for i in $(seq 1 30); do
    if grep -q "Waiting on http" "$LOG" 2>/dev/null; then
      echo "Servidor no ar (PID ${PID})."
      echo "Log:      ${LOG}"
      echo "Acompanhe com:  tail -f ${LOG}"
      echo "Web:      http://localhost:${PORTA_ALVO}"
      echo "Parar:    kill ${PID}   (ou: pkill -f 'expo start')"
      exit 0
    fi
    if ! kill -0 "$PID" 2>/dev/null; then
      echo ""
      echo "ERRO: o servidor não subiu. O que ele disse:"
      echo "-----------------------------------------"
      cat "$LOG"
      echo "-----------------------------------------"
      echo ""
      echo "Causa provável: porta ${PORTA_ALVO} ocupada. Tente:"
      echo "    ./iniciar.sh ${ALVO} --porta 8090"
      exit 1
    fi
    sleep 1
  done
  echo ""
  echo "ERRO: 30s sem resposta do Metro. Log em ${LOG}"
  tail -5 "$LOG"
  exit 1
fi

# --- Modo normal (foreground) --------------------------------------------
# O modo foreground é o padrão de propósito: erro de compilação do Metro
# aparece na hora. Em segundo plano ele passa BATIDO, e o sintoma chega
# minutos depois como "a tela ficou branca".
echo "Para parar: Ctrl+C"
echo "Log da sessão: Ctrl+C e depois  npx expo start"
echo

if [ "$ALVO" = "fone" ]; then
  echo "Leia o QR com o app Expo Go (Android) ou o app Expo Go (iOS)."
  echo "O celular precisa estar NO MESMO Wi-Fi deste computador."
  echo
  # URL que o QR codifica, calculada aqui: sem TTY o Expo não desenha o QR,
  # e o único endereço que ele imprime é "localhost" — que, no celular,
  # aponta para o próprio celular e nunca funciona. Era essa a origem de
  # "tentei várias vezes e não deu".
  IP=$(ip -4 addr show scope global 2>/dev/null | awk '/inet /{split($2,a,"/"); print a[1]; exit}')
  if [ -n "$IP" ]; then
    echo "Sem QR no terminal, digite no Expo Go:"
    echo "    exp://${IP}:${PORTA_ALVO}"
    echo "Celular e computador precisam estar na mesma rede."
  fi
  echo
fi

exec "${CMD[@]}"