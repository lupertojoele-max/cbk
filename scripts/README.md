# 🚀 Script Import Prodotti da MondoKart

Questo script ti permette di importare automaticamente prodotti da MondoKart nel tuo sito.

## ⚡ Installazione

Le dipendenze sono già installate! (`cheerio`, `axios`)

## 📝 Come Usare lo Script

### Passo 1: Trova l'URL della categoria

Vai su MondoKart e copia l'URL della categoria che vuoi importare:

Esempi:
- `https://www.mondokart.com/it/pneumatici-lecont`
- `https://www.mondokart.com/it/telemetrie-aim`
- `https://www.mondokart.com/it/motori-iame`

### Passo 2: Modifica lo script

Apri `scripts/scrape-mondokart.ts` e cerca la sezione:

```typescript
const categories = [
  {
    url: 'https://www.mondokart.com/it/pneumatici',  // ← Metti qui l'URL
    name: 'pneumatici'                                 // ← Nome categoria
  },
]
```

Aggiungi le categorie che vuoi importare.

### Passo 3: Esegui lo script

```bash
npx ts-node scripts/scrape-mondokart.ts
```

### Passo 4: Rivedi i risultati

I prodotti vengono salvati in:
- **JSON**: `data/products-[categoria].json`
- **Immagini**: `public/images/products/`

### Passo 5: Pubblica

Copia i prodotti dal JSON generato in `data/products.json` (il file principale).

## 🔧 Personalizzazione Selettori CSS

Lo script usa selettori CSS generici. Se non funziona:

1. Apri MondoKart nel browser
2. Premi F12 (DevTools)
3. Ispeziona un prodotto nella lista
4. Trova i selettori CSS corretti
5. Aggiorna questi selettori nel file `scrape-mondokart.ts`:

```typescript
// Riga 51 circa
$('.product-item, .product-card, .item-product').each((index, element) => {
   // ↑ Aggiorna questo selettore

  const name = $el.find('.product-name, .title, h3, h4')
                 // ↑ Aggiorna questo

  const priceText = $el.find('.price, .product-price')
                      // ↑ E questo
```

## 📊 Opzioni

### Scaricare immagini automaticamente

```typescript
await scraper.run(
  categoryUrl,
  categoryName,
  true  // ← true = scarica immagini, false = solo URL
)
```

### Limitare numero prodotti

Modifica riga 176 circa:

```typescript
for (let i = 0; i < Math.min(products.length, 10); i++) {
                                           // ↑ Cambia qui
```

## 🎯 Workflow Consigliato

1. **Test iniziale**: Importa 10-20 prodotti di una categoria
2. **Verifica**: Controlla che i dati siano corretti
3. **Adatta selettori**: Se serve, aggiorna i selettori CSS
4. **Import completo**: Importa tutte le categorie

## ⚠️ Note Importanti

- **Rate limiting**: Lo script fa pause tra le richieste (500ms)
- **Rispetta ToS**: Usa lo script in modo responsabile
- **Revisione**: Controlla sempre i dati prima di pubblicare
- **Backup**: Fai backup di `data/products.json` prima di sovrascrivere

## 🐛 Troubleshooting

**"Nessun prodotto trovato"**
→ I selettori CSS non corrispondono. Ispeziona la pagina e aggiornali.

**"Errore download immagini"**
→ Controlla URL immagini o disabilita download (false nel run())

**"Prezzi errati"**
→ Aggiorna la funzione `cleanPrice()` per il formato di MondoKart

## 📞 Bisogno di aiuto?

Chiedi a me! Posso aiutarti a:
- Trovare i selettori CSS corretti
- Personalizzare lo script
- Risolvere problemi

Buon import! 🏁
