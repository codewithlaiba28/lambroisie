import puppeteer from 'puppeteer-core'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const SITE_URL = 'http://localhost:5173/'

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'landscape-phone-844x390', width: 844, height: 390 }
]

async function verify() {
  console.log('🚀 Launching Chrome for Complete Verification Pass...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  })

  const results = {
    errors: [],
    warnings: [],
    hero: {},
    menu: {},
    story: {},
    privateDining: {},
    reviews: {},
    footer: {},
    responsive: {}
  }

  const page = await browser.newPage()

  page.on('console', msg => {
    if (msg.type() === 'error') results.errors.push(msg.text())
    if (msg.type() === 'warning') results.warnings.push(msg.text())
  })
  page.on('pageerror', err => results.errors.push(err.message))

  await page.setViewport({ width: 1440, height: 900 })
  console.log('🌐 Opening', SITE_URL)
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })

  // Wait for preloader to finish (all frames loaded)
  console.log('⏳ Waiting for preloader and frames to load...')
  await page.waitForFunction(() => {
    const p = document.querySelector('div[class*="z-[10000]"]')
    return !p || p.style.display === 'none' || window.getComputedStyle(p).opacity === '0'
  }, { timeout: 20000 })

  console.log('✅ Preloader complete!')

  // 1. Verify Hero at start
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: 'public/qa-screenshots/01-hero-start.png' })

  // Scroll through Hero: 25%, 50%, 65% (Headline), 85% (Riservato), 98% (Buttons)
  const heroH = await page.evaluate(() => window.innerHeight * 4)
  console.log('Hero pin height ~', heroH)

  await page.evaluate(y => window.scrollTo(0, y), heroH * 0.55)
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: 'public/qa-screenshots/02-hero-headline.png' })

  await page.evaluate(y => window.scrollTo(0, y), heroH * 0.85)
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: 'public/qa-screenshots/03-hero-riservato.png' })

  await page.evaluate(y => window.scrollTo(0, y), heroH)
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: 'public/qa-screenshots/04-hero-end.png' })

  // 2. Verify Menu Section
  console.log('📜 Scrolling into Menu Section...')
  const menuEl = await page.evaluate(() => {
    const el = document.getElementById('menu')
    return { top: el.offsetTop, height: el.offsetHeight }
  })
  await page.evaluate(y => window.scrollTo(0, y + 200), menuEl.top)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'public/qa-screenshots/05-menu-step1.png' })

  // Scroll further down into Menu
  await page.evaluate(y => window.scrollTo(0, y + 800), menuEl.top)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'public/qa-screenshots/06-menu-step2.png' })

  // Check Menu panel color
  const menuBg = await page.evaluate(() => {
    const panel = document.querySelector('#menu .bg-\\[\\#f3ebdd\\]')
    return panel ? window.getComputedStyle(panel).backgroundColor : 'not found'
  })
  results.menu.bgColor = menuBg

  // 3. Verify Story Section
  console.log('📜 Scrolling into Story Section...')
  const storyTop = await page.evaluate(() => document.getElementById('story').offsetTop)
  await page.evaluate(y => window.scrollTo(0, y + 400), storyTop)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'public/qa-screenshots/07-story.png' })

  // 4. Verify Private Dining Section
  console.log('📜 Scrolling into Private Dining Section...')
  const pdTop = await page.evaluate(() => document.getElementById('private-dining').offsetTop)
  await page.evaluate(y => window.scrollTo(0, y + 300), pdTop)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'public/qa-screenshots/08-private-dining-expand.png' })

  await page.evaluate(y => window.scrollTo(0, y + 800), pdTop)
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: 'public/qa-screenshots/09-private-dining-morph.png' })

  // 5. Verify Reviews Section (Infinite Marquee)
  console.log('📜 Scrolling into Reviews Section...')
  const revTop = await page.evaluate(() => document.getElementById('reviews').offsetTop)
  await page.evaluate(y => window.scrollTo(0, y + 100), revTop)
  await new Promise(r => setTimeout(r, 1000))
  await page.screenshot({ path: 'public/qa-screenshots/10-reviews-marquee.png' })

  const reviewsCheck = await page.evaluate(() => {
    const counterText = document.querySelector('#reviews .font-headline-lg')?.innerText || ''
    const cards = Array.from(document.querySelectorAll('#reviews .bg-\\[\\#f3ebdd\\]'))
    const marqueeCols = document.querySelectorAll('#reviews .marquee-col')
    return {
      counterText,
      creamCardsCount: cards.length,
      marqueeColsCount: marqueeCols.length,
      cardBg: cards[0] ? window.getComputedStyle(cards[0]).backgroundColor : ''
    }
  })
  results.reviews = reviewsCheck

  // 6. Verify Footer CTA Section
  console.log('📜 Scrolling into Footer CTA Section...')
  const footTop = await page.evaluate(() => document.getElementById('reservations').offsetTop)
  await page.evaluate(y => window.scrollTo(0, y + 100), footTop)
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: 'public/qa-screenshots/11-footer-cta.png' })

  // 7. Responsive Viewports Check
  console.log('📱 Checking all responsive viewports...')
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await new Promise(r => setTimeout(r, 400))
    const vpCheck = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      winWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    }))
    results.responsive[vp.name] = vpCheck
    await page.screenshot({ path: `public/qa-screenshots/vp-${vp.name}.png` })
  }

  await browser.close()
  console.log('🎉 Verification Pass Completed!')
  console.log(JSON.stringify(results, null, 2))
}

verify().catch(err => {
  console.error('Verification failed:', err)
  process.exit(1)
})
