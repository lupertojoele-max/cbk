#!/bin/bash
# Agent Scraper Full - Importa TUTTI i prodotti mancanti da mondokart
cd /c/Users/luper/cbk1
unset CLAUDECODE

echo "=== CBK1 - SCRAPER COMPLETO MONDOKART ==="
echo "Obiettivo: importare TUTTE le categorie mancanti"
echo "Avvio Claude..."
echo ""

claude --dangerously-skip-permissions "$(cat /c/Users/luper/cbk1/.agent-scraper-full.txt)"

echo ""
echo "=== Scraper completato. Premi INVIO per chiudere ==="
read
