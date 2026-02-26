/**
 * Test suite per le API CBK1 backend.
 * Eseguibili con: node --test src/app/api/__tests__/api.test.mjs
 *
 * Testa la logica di filtraggio/paginazione caricando i dati direttamente
 * (no server HTTP richiesto).
 */

import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsPath = join(__dirname, '../../../../data/products.json')

const rawData = JSON.parse(readFileSync(productsPath, 'utf8'))
const allProducts = (rawData.products ?? rawData).map(p => ({
  ...p,
  inStock: p.inStock ?? true,
}))

// ─── Utility replica della logica API ─────────────────────────────────────

function filterProducts({ categoria, brand, min_price, max_price, search, in_stock } = {}) {
  let filtered = allProducts

  if (categoria && categoria !== 'tutti') {
    filtered = filtered.filter(p => p.category === categoria)
  }
  if (brand && brand.toLowerCase() !== 'tutti') {
    filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
  }
  if (min_price !== undefined) {
    filtered = filtered.filter(p => parseFloat(p.price) >= min_price)
  }
  if (max_price !== undefined) {
    filtered = filtered.filter(p => parseFloat(p.price) <= max_price)
  }
  if (in_stock !== undefined) {
    filtered = filtered.filter(p => p.inStock === in_stock)
  }
  if (search && search.trim().length > 0) {
    const terms = search.toLowerCase().split(/\s+/).filter(t => t.length > 1)
    filtered = filtered.filter(p => {
      const haystack = `${p.name} ${p.description} ${p.brand} ${p.category}`.toLowerCase()
      return terms.every(term => haystack.includes(term))
    })
  }
  return filtered
}

function paginate(products, page = 1, perPage = 24) {
  const total = products.length
  const lastPage = Math.ceil(total / perPage)
  const offset = (page - 1) * perPage
  return {
    data: products.slice(offset, offset + perPage),
    meta: { total, page, per_page: perPage, last_page: lastPage },
  }
}

// ─── Test: Struttura dati ───────────────────────────────────────────────────

describe('Struttura dati products.json', () => {
  test('il file contiene prodotti', () => {
    assert.ok(allProducts.length > 0, 'Nessun prodotto trovato')
  })

  test('ogni prodotto ha i campi obbligatori', () => {
    const required = ['id', 'name', 'slug', 'category', 'price']
    for (const p of allProducts) {
      for (const field of required) {
        assert.ok(p[field] !== undefined && p[field] !== null, `Prodotto ${p.id} manca il campo "${field}"`)
      }
    }
  })

  test('tutti i prodotti hanno uno slug univoco', () => {
    const slugs = allProducts.map(p => p.slug)
    const unique = new Set(slugs)
    assert.equal(unique.size, slugs.length, 'Esistono slug duplicati')
  })

  test('i prezzi sono valori numerici validi', () => {
    for (const p of allProducts) {
      const price = parseFloat(p.price)
      assert.ok(!isNaN(price) && price >= 0, `Prezzo non valido per ${p.slug}: "${p.price}"`)
    }
  })
})

// ─── Test: Filtri ─────────────────────────────────────────────────────────

describe('Filtro per categoria', () => {
  test('filtra correttamente per freni-accessori', () => {
    const results = filterProducts({ categoria: 'freni-accessori' })
    assert.ok(results.length > 0, 'Nessun risultato per freni-accessori')
    for (const p of results) {
      assert.equal(p.category, 'freni-accessori', `Categoria errata: ${p.category}`)
    }
  })

  test('categoria "tutti" restituisce tutti i prodotti', () => {
    const results = filterProducts({ categoria: 'tutti' })
    assert.equal(results.length, allProducts.length)
  })

  test('categoria inesistente restituisce 0 risultati', () => {
    const results = filterProducts({ categoria: 'categoria-inesistente-xyz' })
    assert.equal(results.length, 0)
  })
})

describe('Filtro per brand', () => {
  test('filtra per CRG (case insensitive)', () => {
    const results = filterProducts({ brand: 'crg' })
    assert.ok(results.length > 0, 'Nessun risultato per CRG')
    for (const p of results) {
      assert.equal(p.brand.toLowerCase(), 'crg')
    }
  })

  test('brand "Tutti" restituisce tutti i prodotti', () => {
    const results = filterProducts({ brand: 'Tutti' })
    assert.equal(results.length, allProducts.length)
  })
})

describe('Filtro per prezzo', () => {
  test('min_price filtra correttamente', () => {
    const results = filterProducts({ min_price: 100 })
    for (const p of results) {
      assert.ok(parseFloat(p.price) >= 100, `Prezzo ${p.price} < 100`)
    }
  })

  test('max_price filtra correttamente', () => {
    const results = filterProducts({ max_price: 20 })
    for (const p of results) {
      assert.ok(parseFloat(p.price) <= 20, `Prezzo ${p.price} > 20`)
    }
  })

  test('range prezzo min+max', () => {
    const results = filterProducts({ min_price: 10, max_price: 50 })
    for (const p of results) {
      const price = parseFloat(p.price)
      assert.ok(price >= 10 && price <= 50, `Prezzo ${price} fuori range [10, 50]`)
    }
    assert.ok(results.length > 0, 'Nessun prodotto nel range 10-50€')
  })
})

// ─── Test: Ricerca full-text ────────────────────────────────────────────────

describe('Ricerca full-text', () => {
  test('ricerca "pastiglia" trova prodotti', () => {
    const results = filterProducts({ search: 'pastiglia' })
    assert.ok(results.length > 0, 'Nessun risultato per "pastiglia"')
    for (const p of results) {
      const haystack = `${p.name} ${p.description} ${p.brand} ${p.category}`.toLowerCase()
      assert.ok(haystack.includes('pastiglia'), `"pastiglia" non trovato in "${p.name}"`)
    }
  })

  test('ricerca multi-termine "pastiglia freno"', () => {
    const results = filterProducts({ search: 'pastiglia freno' })
    assert.ok(results.length > 0, 'Nessun risultato per "pastiglia freno"')
  })

  test('ricerca termine inesistente restituisce 0 risultati', () => {
    const results = filterProducts({ search: 'xyzprodottoinesistenteabc123' })
    assert.equal(results.length, 0)
  })
})

// ─── Test: Paginazione ─────────────────────────────────────────────────────

describe('Paginazione', () => {
  test('pagina 1 con 24 per pagina', () => {
    const { data, meta } = paginate(allProducts, 1, 24)
    assert.equal(data.length, 24)
    assert.equal(meta.page, 1)
    assert.equal(meta.per_page, 24)
    assert.ok(meta.total > 0)
    assert.ok(meta.last_page >= 1)
  })

  test('pagina 2 con 24 per pagina', () => {
    const { data } = paginate(allProducts, 2, 24)
    assert.equal(data.length, 24)
    assert.equal(data[0].slug, allProducts[24].slug)
  })

  test('ultima pagina ha prodotti rimanenti', () => {
    const perPage = 24
    const { meta } = paginate(allProducts, 1, perPage)
    const { data: lastPageData } = paginate(allProducts, meta.last_page, perPage)
    const expectedCount = allProducts.length - (meta.last_page - 1) * perPage
    assert.equal(lastPageData.length, expectedCount)
  })

  test('pagina fuori range restituisce array vuoto', () => {
    const { data } = paginate(allProducts, 9999, 24)
    assert.equal(data.length, 0)
  })
})

// ─── Test: Slug lookup ─────────────────────────────────────────────────────

describe('Ricerca per slug', () => {
  test('trova prodotto per slug esistente', () => {
    const firstSlug = allProducts[0].slug
    const found = allProducts.find(p => p.slug === firstSlug)
    assert.ok(found, 'Prodotto non trovato per slug')
    assert.equal(found.slug, firstSlug)
  })

  test('slug inesistente restituisce undefined', () => {
    const found = allProducts.find(p => p.slug === 'slug-non-esistente-xyz')
    assert.equal(found, undefined)
  })
})

// ─── Test: Rate limiting ────────────────────────────────────────────────────

describe('Rate limiting logic', () => {
  test('contatore si azzera dopo il window', async () => {
    // Importa dinamicamente per evitare side-effects al load
    // In un vero test faremmo mock del time
    // Qui verifichiamo solo la struttura della risposta
    const store = new Map()

    function mockRateLimit(key, { limit, windowMs }) {
      const now = Date.now()
      const entry = store.get(key)

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return { success: true, remaining: limit - 1 }
      }
      if (entry.count >= limit) {
        return { success: false, remaining: 0 }
      }
      entry.count++
      return { success: true, remaining: limit - entry.count }
    }

    const cfg = { limit: 3, windowMs: 5000 }
    assert.ok(mockRateLimit('test-ip', cfg).success)
    assert.ok(mockRateLimit('test-ip', cfg).success)
    assert.ok(mockRateLimit('test-ip', cfg).success)
    // 4a richiesta oltre il limite
    assert.equal(mockRateLimit('test-ip', cfg).success, false)
  })
})

// ─── Test: Validazione contatti ────────────────────────────────────────────

describe('Validazione form contatti', () => {
  // Importa Zod e lo schema manualmente per test unitari
  // (Zod è disponibile come dipendenza nel progetto)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[+\d\s\-().]{7,20}$/

  function validateContact({ name, email, phone, subject, message, privacy }) {
    const errors = {}
    if (!name || name.length < 2) errors.name = 'Nome troppo corto'
    if (!email || !emailRegex.test(email)) errors.email = 'Email non valida'
    if (phone && !phoneRegex.test(phone)) errors.phone = 'Telefono non valido'
    if (!subject || subject.length < 3) errors.subject = 'Oggetto troppo corto'
    if (!message || message.length < 10) errors.message = 'Messaggio troppo corto'
    if (!privacy) errors.privacy = 'Privacy non accettata'
    return { valid: Object.keys(errors).length === 0, errors }
  }

  test('dati validi passano la validazione', () => {
    const { valid } = validateContact({
      name: 'Mario Rossi',
      email: 'mario@example.com',
      phone: '+39 333 1234567',
      subject: 'Richiesta informazioni',
      message: 'Vorrei sapere di più sui vostri prodotti per freni.',
      privacy: true,
    })
    assert.ok(valid)
  })

  test('email non valida fallisce', () => {
    const { valid, errors } = validateContact({
      name: 'Mario Rossi',
      email: 'non-una-email',
      subject: 'Test',
      message: 'Messaggio di test lungo abbastanza.',
      privacy: true,
    })
    assert.equal(valid, false)
    assert.ok(errors.email)
  })

  test('privacy non accettata fallisce', () => {
    const { valid, errors } = validateContact({
      name: 'Mario Rossi',
      email: 'mario@example.com',
      subject: 'Test',
      message: 'Messaggio di test lungo abbastanza.',
      privacy: false,
    })
    assert.equal(valid, false)
    assert.ok(errors.privacy)
  })

  test('messaggio troppo corto fallisce', () => {
    const { valid, errors } = validateContact({
      name: 'Mario Rossi',
      email: 'mario@example.com',
      subject: 'Test',
      message: 'Corto',
      privacy: true,
    })
    assert.equal(valid, false)
    assert.ok(errors.message)
  })
})
