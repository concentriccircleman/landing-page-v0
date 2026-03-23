#!/bin/bash
# Start the Vite dev server. Ensures npm is on PATH for environments that
# don't load your shell profile (e.g. Cursor agent). Run from repo root.

set -e
cd "$(dirname "$0")/.."

# Project-local Node (installed for Cursor agent / CI)
if [ -x ".node/bin/node" ] && [ -x ".node/bin/npm" ]; then
  export PATH="$(pwd)/.node/bin:$PATH"
  exec npm run dev
fi

# Already on PATH (e.g. your terminal)
if command -v npm &>/dev/null; then
  exec npm run dev
fi

# nvm
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -d "$NVM_DIR/versions/node" ]; then
  NODE_VER=$(ls "$NVM_DIR/versions/node" 2>/dev/null | tail -1)
  if [ -n "$NODE_VER" ]; then
    export PATH="$NVM_DIR/versions/node/$NODE_VER/bin:$PATH"
  fi
fi

# fnm
if [ -d "$HOME/.local/share/fnm" ]; then
  export PATH="$HOME/.local/share/fnm/current/bin:$PATH"
fi
if [ -d "$HOME/.fnm/current/bin" ]; then
  export PATH="$HOME/.fnm/current/bin:$PATH"
fi

# Homebrew / system
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

exec npm run dev
