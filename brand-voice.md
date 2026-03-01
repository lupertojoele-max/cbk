# CBK1 Brand Voice — Analisi e Linee Guida

## Stato Attuale del Copy (Analisi)

### File analizzati
- `src/app/layout.tsx` — metadata globali
- `src/app/page.tsx` — homepage
- `src/app/prodotti/page.tsx` — catalogo prodotti
- `src/app/prodotti/[slug]/page.tsx` — scheda prodotto
- `src/components/hero/mega-hero.tsx` — hero slideshow
- `src/components/home/highlights.tsx` — sezione highlights

---

## Problemi Critici Rilevati

### Identita' di brand incongruente
Il sito e' attualmente configurato come "racing team" (CBK Racing Team), non come e-commerce di ricambi kart. Tutte le metadata descrivono un team che gareggia, non uno shop di componenti professionali.

- **layout.tsx**: description attuale = "Professional go-kart racing team..." — SBAGLIATO per un e-commerce
- **layout.tsx**: locale = "en_US" — il sito e' in italiano
- **layout.tsx**: keywords orientate a "racing team" non a "ricambi" e "accessori"
- **mega-hero.tsx**: CTA verso "/results" e "/drivers" — link inesistenti per un e-commerce
- **highlights.tsx**: cards di news da racing team invece di categorie prodotti

### Tono attuale
Generico, orientato allo sport ma non al commercio. Manca:
- Proposta di valore commerciale chiara (spedizione, disponibilita', prezzo)
- Terminologia tecnica specifica del karting professionale
- Social proof (numeri, brand partner, testimonial)
- CTA commerciali

### Cosa funziona
- Struttura visiva premium con colori racing (rosso/nero/bianco)
- Uso corretto del rosso racing-red come accent
- Animazioni Framer Motion che comunicano dinamismo
- Typography bold e uppercase — coerente col mondo motorsport
- Breadcrumbs nella scheda prodotto — buona UX

---

## Brand Voice CBK1 — Definizione

### Identita'
CBK1 e' il punto di riferimento italiano per ricambi, accessori e attrezzatura da karting professionale. Il partner tecnico dei piloti che fanno sul serio.

### Tono
- Premium: mai cheap, mai generico
- Tecnico: usa terminologia del settore (assetto, telemetria, carburazione, grip)
- Autorevole: parla da esperto, non da rivenditore
- Appassionato: passione per il motorsport
- Diretto: frasi corte, impatto immediato

---

## Vocabolario Chiave

### Termini da usare (DO)
- Ricambi kart / ricambi karting
- Setup / assetto kart
- Telemetria / dati pista
- Carburazione / carburatore
- Grip / aderenza
- Scarico / silenziatore / marmitta
- Telaio / scocca
- Fusello / assale / piantone sterzo
- Cavalleria (potenza motore)
- Componenti OEM / ricambi originali
- Spedizione rapida / consegna 24h
- Brand partner: OTK, TonyKart, CRG, BirelArt, IAME, TM Racing, Rotax, Vega, LeCont

### Termini da evitare (DON'T)
- "Go-kart" generico (preferire "kart" o "karting professionale")
- "Racing team" (siamo un e-commerce, non un team)
- Linguaggio e-commerce generico: "offerta speciale", "miglior prezzo"
- Superlative senza sostanza: "i migliori", "i piu' economici"

---

## Headline Patterns

Formula Hero: [Beneficio tecnico]. [Proposta di valore]. [Urgenza/differenziazione].
- "Il Kart che vuoi. I ricambi che ti servono. Consegna in 24h."
- "6.800+ Componenti OEM. Zero Compromessi. Pronto per la Pista."

Formula Categoria: [Termine tecnico] [Beneficio]
- "Freni ad Alta Prestazione"
- "Telemetrie per Piloti Seri"

---

## CTA Raccomandati
- Hero primario: "Esplora il Catalogo"
- Hero secondario: "Trova il tuo Ricambio"
- Scheda prodotto: "Richiedi Disponibilita'"
- CTA finale: "Contatta il Team Tecnico"

---

## Numeri Chiave (Social Proof)
- Prodotti a catalogo: 6.800+
- Spedizione: 24/48h
- Anni di esperienza: 10+
- Brand in catalogo: 50+
- Categorie: 30

---

## Metadata SEO Raccomandati

### Title globale
CBK1 | Ricambi e Accessori Kart Professionali

### Description globale (159 caratteri)
Ricambi kart originali, accessori karting e attrezzatura professionale. OTK, CRG, BirelArt, IAME, Rotax. Spedizione rapida in tutta Italia. CBK Racing.

### Keywords prioritari
- ricambi kart, accessori karting, kart professionale
- ricambi go kart, accessori kart italia, CBK Racing
- telaio kart, motore kart, pneumatici kart
- telemetria kart, freni kart, abbigliamento karting
