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
PORTA_PADRAO=8081

for arg in "$@"; do
  case "$arg" in
    web|android|fone) ALVO="$arg" ;;
    --limpar)        LIMPAR=1 ;;
    --fundo)         FUNDO=1 ;;
    -h|--help)       sed -n '3,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "opção desconhecida: $arg" >&2; sed -n '3,15p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
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
   && ss -ltn 2>/dev/null | awk '{print $4}' | cut -d: -f2 | grep -qxF "${PORTA_PADRAO}"; then
  echo
  echo "ATENÇÃO: a porta ${PORTA_PADRAO} já está em uso."
  echo "Se for uma instância antiga deste projeto, pare com:"
  echo "    pkill -f 'expo start'"
  echo
fi

# --- Comando --------------------------------------------------------------
CMD=(npx expo start)
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
  echo "Servidor iniciado em segundo plano (PID ${PID})."
  echo "Log:      ${LOG}"
  echo "Acompanhe com:  tail -f ${LOG}"
  echo "Web:      http://localhost:${PORTA_PADRAO}"
  echo "Parar:    kill ${PID}   (ou: pkill -f 'expo start')"
  exit 0
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
  echo
fi

exec "${CMD[@]}"