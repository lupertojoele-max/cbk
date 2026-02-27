#!/bin/bash
# Agent 1 — Product Importer / Scraper (CBK1)
cd /c/Users/luper/cbk1
unset CLAUDECODE

echo "=== CBK1 Agent 1 - Product Importer ==="
echo "Avvio Claude con prompt da .agent1-prompt.txt..."
echo ""

claude --dangerously-skip-permissions "$(cat /c/Users/luper/cbk1/.agent1-prompt.txt)"

echo ""
echo "=== Agent 1 terminato. Premi INVIO per chiudere ==="
read
