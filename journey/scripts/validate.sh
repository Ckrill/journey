#!/usr/bin/env bash
set -euo pipefail

on_exit() {
  if [[ $? -ne 0 ]]; then
    echo "❌ Validation failed"
  fi
}
trap on_exit EXIT

step() {
  local name=$1
  shift
  local start=$SECONDS
  echo "🔍 $name..."
  "$@"
  echo "✅ $name ($((SECONDS - start))s)"
  echo
}

echo '🚀 Running validation...'
echo

step Oxfmt yarn format
step Stylelint yarn lint:css
step ESLint yarn lint:js
step TypeScript yarn typecheck

echo "🎉 All checks passed! (${SECONDS}s)"
