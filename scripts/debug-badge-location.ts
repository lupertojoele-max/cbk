import puppeteer from 'puppeteer'

async function debugBadgeLocation() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  const url = 'https://www.mondokart.com/it/telaio-accessori/freni-e-accessori-mondokart/pastiglie-freno-mondokart/pastiglia-freno-posteriore-standard-karting.html'

  console.log(`\nChecking: ${url}\n`)
  await page.goto(url, { waitUntil: 'networkidle2' })

  const badgeInfo = await page.evaluate(() => {
    // Find ALL discount badges on the page
    const allBadges = document.querySelectorAll('.discount-badge, .discount-percentage, .discount-amount, .product-flag.discount')

    const badges: any[] = []
    allBadges.forEach((badge, idx) => {
      const parent = badge.parentElement
      const isInProductPrice = badge.closest('.product-prices') !== null
      const isInProductFlags = badge.closest('.product-flags') !== null
      const isInImage = badge.closest('.product-cover') !== null

      badges.push({
        index: idx,
        text: badge.textContent?.trim(),
        className: badge.className,
        parentTag: parent?.tagName,
        parentClass: parent?.className,
        isInProductPrice,
        isInProductFlags,
        isInImage,
        html: badge.outerHTML.substring(0, 200)
      })
    })

    return badges
  })

  console.log(`Found ${badgeInfo.length} discount badge(s):\n`)
  badgeInfo.forEach((badge, idx) => {
    console.log(`Badge ${idx + 1}:`)
    console.log(`  Text: "${badge.text}"`)
    console.log(`  Class: ${badge.className}`)
    console.log(`  Parent: <${badge.parentTag}> (${badge.parentClass})`)
    console.log(`  In product-prices area? ${badge.isInProductPrice}`)
    console.log(`  In product-flags area? ${badge.isInProductFlags}`)
    console.log(`  In product image area? ${badge.isInImage}`)
    console.log(`  HTML: ${badge.html}`)
    console.log()
  })

  await browser.close()
}

debugBadgeLocation().catch(console.error)
