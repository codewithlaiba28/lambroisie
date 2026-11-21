import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

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

async function runQA() {
  console.log('🚀 Launching Chrome for QA audit...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  })

  const results = {
    errors: [],
    warnings: [],
    sections: {},
    animations: {},
    responsive: {},
    scrollBugs: []
  }

  const page = await browser.newPage()

  page.on('console', msg => {
    const text = msg.text()
    if (msg.type() === 'error') {
      results.errors.push(`Console error: ${text}`)
    } else if (msg.type() === 'warning') {
      results.warnings.push(`Console warning: ${text}`)
    }
  })

  page.on('pageerror', err => {
    results.errors.push(`Page error: ${err.message}`)
  })

  // Set desktop viewport initially
  await page.setViewport({ width: 1440, height: 900 })
  console.log('🌐 Navigating to', SITE_URL)
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })

  // Wait for preloader to finish
  console.log('⏳ Waiting for preloader...')
  await page.waitForFunction(() => {
    const preloader = document.querySelector('div[class*="z-[10000]"]')
    return !preloader || preloader.style.display === 'none' || window.getComputedStyle(preloader).opacity === '0'
  }, { timeout: 15000 })

  // PART 1: Section Completeness
  console.log('🔍 Checking Section Completeness...')
  const sectionsCheck = await page.evaluate(() => {
    const nav = !!document.querySelector('header')
    const hero = !!document.querySelector('canvas')
    const menu = !!document.getElementById('menu')
    const story = !!document.getElementById('story')
    const privateDining = !!document.getElementById('private-dining')
    const reviews = !!document.getElementById('reviews')
    const footer = !!document.getElementById('reservations')

    // Check fonts
    const bodyFont = window.getComputedStyle(document.body).fontFamily
    const headline = document.querySelector('h1, h2')
    const headlineFont = headline ? window.getComputedStyle(headline).fontFamily : ''

    // Check colors
    const bgColor = window.getComputedStyle(document.body).backgroundColor

    return {
      nav,
      hero,
      menu,
      story,
      privateDining,
      reviews,
      footer,
      bodyFont,
      headlineFont,
      bgColor
    }
  })
  results.sections = sectionsCheck

  // PART 2 & 3: Test Scrolling & Pinning on Desktop
  console.log('📜 Testing Desktop Scrolling top to bottom...')
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
  console.log('Total document scroll height:', scrollHeight)

  // Test anchor clicks
  console.log('⚓ Testing Anchor Links (Book a Table, Menu)...')
  const anchorTest = await page.evaluate(async () => {
    const initialY = window.scrollY
    const menuLink = document.querySelector('a[href="#menu"]')
    if (menuLink) {
      menuLink.click()
    }
    await new Promise(r => setTimeout(r, 1500))
    const afterMenuY = window.scrollY
    return { initialY, afterMenuY, scrolled: afterMenuY > initialY }
  })
  results.anchorTest = anchorTest

  // Scroll smoothly from top to bottom
  const scrollSteps = 20
  for (let i = 0; i <= scrollSteps; i++) {
    const y = (scrollHeight / scrollSteps) * i
    await page.evaluate(targetY => window.scrollTo(0, targetY), y)
    await new Promise(r => setTimeout(r, 100))
  }
  await page.screenshot({ path: 'public/qa-screenshots/desktop-bottom.png' })

  // Scroll backwards fast
  console.log('📜 Testing Reverse Scroll (bottom to top)...')
  for (let i = scrollSteps; i >= 0; i--) {
    const y = (scrollHeight / scrollSteps) * i
    await page.evaluate(targetY => window.scrollTo(0, targetY), y)
    await new Promise(r => setTimeout(r, 50))
  }
  await page.screenshot({ path: 'public/qa-screenshots/desktop-top.png' })

  // PART 4: Responsive Viewport Tests
  console.log('📱 Testing Responsive Viewports...')
  for (const vp of VIEWPORTS) {
    console.log(`Checking ${vp.name} (${vp.width}x${vp.height})...`)
    await page.setViewport({ width: vp.width, height: vp.height })
    await new Promise(r => setTimeout(r, 500))

    const metrics = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth
      const winWidth = window.innerWidth
      const hasHorizontalScroll = docWidth > winWidth + 1 // +1 for subpixel rounding

      // Check tappable button sizes
      const buttons = Array.from(document.querySelectorAll('a, button'))
        .filter(el => {
          const rect = el.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0 && (el.innerText.trim().length > 0 || el.getAttribute('aria-label'))
        })
        .map(el => {
          const rect = el.getBoundingClientRect()
          return {
            text: el.innerText.trim().substring(0, 20),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            small: rect.height < 36 || rect.width < 36
          }
        })

      // Check if hamburger exists on small screens
      const hamburger = document.querySelector('button[aria-label="Toggle Menu"]')
      const hamburgerVisible = hamburger && window.getComputedStyle(hamburger).display !== 'none'

      return {
        docWidth,
        winWidth,
        hasHorizontalScroll,
        smallButtons: buttons.filter(b => b.small).slice(0, 5),
        hamburgerVisible
      }
    })

    results.responsive[vp.name] = metrics
    await page.screenshot({ path: `public/qa-screenshots/vp-${vp.name}.png` })
  }

  await browser.close()
  console.log('✅ QA script completed.')
  console.log(JSON.stringify(results, null, 2))
}

runQA().catch(err => {
  console.error('QA script failed:', err)
  process.exit(1)
})
