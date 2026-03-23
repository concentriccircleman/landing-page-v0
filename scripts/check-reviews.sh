#!/usr/bin/env bash
# Reads review-state.json and outputs all denied components with their notes.
# Usage: bash scripts/check-reviews.sh

STATE_FILE="$(dirname "$0")/../review-state.json"

if [ ! -f "$STATE_FILE" ]; then
  echo "No review-state.json found."
  exit 0
fi

DENIED=$(python3 -c "
import json, sys
with open('$STATE_FILE') as f:
    state = json.load(f)
found = False
for cid, entry in state.items():
    if entry.get('status') == 'denied':
        found = True
        notes = entry.get('notes', '(no notes)')
        version = entry.get('version', 1)
        fixes_count = len(entry.get('fixes', []))
        print(f'  [{cid}] v{version} — {notes} (prior fixes: {fixes_count})')
if not found:
    print('  No denied components.')
" 2>/dev/null)

echo "=== Denied Components ==="
echo "$DENIED"
echo ""
echo "To log a fix after editing, POST to http://localhost:5173/__review-fix:"
echo '  curl -X POST http://localhost:5173/__review-fix -H "Content-Type: application/json" -d '"'"'{"componentId":"<id>","version":<new_version>,"description":"<what you changed>","filesChanged":["<file>..."]}'"'"
