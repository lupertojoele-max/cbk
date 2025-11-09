import productsData from '../data/products.json' with { type: 'json' }

interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
}

const products = productsData.products as Product[]

const discounted = products.filter(p => p.originalPrice)

console.log(`\n📊 RIEPILOGO IMPORTAZIONE FRENI E ACCESSORI`)
console.log(`============================================\n`)
console.log(`✅ Totale prodotti importati: ${products.length}`)
console.log(`🔥 Prodotti con sconto: ${discounted.length}`)
console.log(`💰 Prodotti senza sconto: ${products.length - discounted.length}\n`)

if (discounted.length > 0) {
  console.log(`\n🎯 PRODOTTI IN SCONTO:\n`)
  discounted.forEach((p, idx) => {
    const discount = Math.round(((parseFloat(p.originalPrice!) - parseFloat(p.price)) / parseFloat(p.originalPrice!)) * 100)
    console.log(`${idx + 1}. ${p.name}`)
    console.log(`   💶 €${parseFloat(p.price).toFixed(2)} (era €${parseFloat(p.originalPrice!).toFixed(2)}) - SCONTO ${discount}%\n`)
  })
}
