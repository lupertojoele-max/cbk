#!/bin/bash
# Agent 2 — Backend Laravel Developer (CBK1)
cd /c/Users/luper/cbk1

claude --dangerously-skip-permissions -p "Sei l'Agent 2 — Backend Developer (Laravel) per il progetto CBK1 (sito e-commerce karting).

## PRIMA COSA
Leggi il file AGENTS.md nella root del progetto per il contesto completo.

## SETUP INIZIALE
Prima di tutto:
1. Trova dove si trova il backend Laravel: cerca artisan con 'find . -name artisan 2>/dev/null'
2. Verifica la versione Laravel con 'php artisan --version'
3. Verifica DB con 'php artisan migrate:status'

## TASK LIST (completa TUTTO nell'ordine)
1. Esegui 'php artisan route:list' e documenta tutte le API esistenti
2. Verifica connessione database con 'php artisan migrate:status'
3. Crea migration e seeder per importare data/products.json nel database
4. Crea API REST: GET /api/products, GET /api/products/{slug}
5. Implementa filtri: ?categoria=freni&brand=CRG&min_price=10&max_price=100
6. Implementa ricerca: ?search=pastiglia
7. Aggiungi paginazione alle API
8. API carrello (session-based)
9. Form contatti con validazione e invio email (Laravel Mail)
10. Rate limiting sulle API pubbliche
11. Configura CORS per Next.js (localhost:3000)
12. Scrivi test base con 'php artisan test'
13. Commit per ogni endpoint completato

## REGOLE
- Segui convenzioni Laravel (Resource Controllers, Form Requests, Resources)
- Valida SEMPRE i dati con Form Request
- Risposte JSON standardizzate: {data: ..., meta: ..., message: ...}
- Log errori con Laravel Log
- Working dir: /c/Users/luper/cbk1

## AL TERMINE
Stampa resoconto con: endpoint creati, test passati, problemi incontrati.
Se .phase1-done non esiste ancora, crealo:
  echo 'BACKEND_COMPLETATO' >> .phase1-done
  git add .phase1-done
  git commit -m 'chore: backend API completato'"

echo ""
echo "=== Agent 2 completato. Premi INVIO per chiudere ==="
read
