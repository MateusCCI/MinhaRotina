#!/bin/bash
# Limpar instalação local do Tailscale
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Cleanup Tailscale ==="
rm -rf "$SCRIPT_DIR/tailscale_1.102.4_amd64"
rm -f "$SCRIPT_DIR/tailscale.tgz"
rm -rf "$HOME/.local/tailscale"
echo "Limpo. Para remoção completa do sistema:"
echo "  sudo systemctl stop tailscaled && sudo systemctl disable tailscaled && sudo rm -rf /usr/local/tailscale"
