#!/bin/bash
# Agent 4 — Backend Laravel Developer (CBK1)
cd /c/Users/luper/cbk1
unset CLAUDECODE

echo "=== CBK1 Agent 4 - Backend Laravel ==="
echo "Avvio Claude con prompt da .agent4-prompt.txt..."
echo ""

claude --dangerously-skip-permissions "$(cat /c/Users/luper/cbk1/.agent4-prompt.txt)"

echo ""
echo "=== Agent 4 terminato. Premi INVIO per chiudere ==="
read
