import puppeteer from 'puppeteer-core'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5173/'
const SCREENSHOT_DIR = 'public/qa-screenshots'

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

async function runVerification() {
  console.log('🚀 Launching Puppeteer to test and verify all issues...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  })

  const results = {
    heroLock: {},
    fonts: {},
    menuHeight: {},
    menuImages: {},
    consoleErrors: []
  }

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text())
      console.error('Browser console error:', msg.text())
    }
  })

  page.on('pageerror', err => {
    results.consoleErrors.push(err.toString())
    console.error('Browser uncaught error:', err)
  })

  console.log('🌐 Navigating to:', URL)
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })

  // Wait for preloader to complete
  console.log('⏳ Awaiting preloader...')
  await page.waitForFunction(() => {
    const preloader = document.getElementById('preloader')
    return !preloader || preloader.style.display === 'none'
  }, { timeout: 35000 })
  await new Promise(r => setTimeout(r, 1500))
  console.log('✅ Preloader completed and frames loaded into memory!')

  // ==========================================
  // 1. VERIFY ISSUE 2: FONTS AUDIT
  // ==========================================
  console.log('🔍 Auditing computed fonts across all sections...')
  const fontAudit = await page.evaluate(() => {
    const getFont = (selector) => {
      const el = document.querySelector(selector)
      if (!el) return 'NOT_FOUND'
      return window.getComputedStyle(el).fontFamily
    }

    return {
      navTitle: getFont('header span.text-headline-sm, header .font-headline-sm'),
      navLinks: getFont('header nav a'),
      heroTitle: getFont('#root h1, .font-display-hero'),
      heroItalic: getFont('#root h1 span, .font-headline-lg.italic'),
      heroEyebrow: getFont('#root .font-label-caps'),
      menuEyebrow: getFont('#menu .font-label-caps'),
      menuTitle: getFont('#menu h2'),
      menuTabs: getFont('#menu button'),
      dishName: getFont('#menu h3'),
      dishPrice: getFont('#menu span.font-display'),
      dishDescription: getFont('#menu p.font-body'),
      storyUpper: getFont('#story .font-body-md'),
      storyAccent: getFont('#story span.font-headline-lg.italic'),
      privateDiningTitle: getFont('#private-dining h2, #private-dining h3'),
      reviewCounter: getFont('#reviews span.font-headline-lg'),
      reviewQuote: getFont('#reviews p.font-serif'),
      footerTitle: getFont('#reservations h2'),
      footerCtaBtn: getFont('#reservations a.magnetic-btn, #reservations a')
    }
  })
  results.fonts = fontAudit
  console.log('Font Audit Results:', fontAudit)

  // ==========================================
  // 2. VERIFY ISSUE 4: MENU DISH IMAGES
  // ==========================================
  console.log('🔍 Checking Menu Dish Images and single data array...')
  const menuImagesData = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('#menu .dish-image-layer img')).map(img => ({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    }))
    return images
  })
  results.menuImages = menuImagesData
  console.log('Menu images found:', menuImagesData)

  // ==========================================
  // 3. VERIFY ISSUE 1: HERO LOCK TEST
  // ==========================================
  console.log('🧪 Testing Hero Lock (user cannot leave hero before last frame)...')
  const heroTest = await page.evaluate(async () => {
    const heroSection = document.querySelector('section')
    const heroPinSpacer = heroSection.closest('.pin-spacer') || heroSection
    const heroDistance = heroPinSpacer.offsetHeight - window.innerHeight // 400vh
    const menuSection = document.querySelector('#menu')
    const menuPinSpacer = menuSection.closest('.pin-spacer') || menuSection

    // Initial state
    const initialScrollY = window.scrollY
    const menuInitialTop = menuPinSpacer.getBoundingClientRect().top

    // Test 1: Scroll to 50% through hero
    if (window.lenis) {
      window.lenis.scrollTo(heroDistance * 0.5, { immediate: true })
    } else {
      window.scrollTo(0, heroDistance * 0.5)
    }
    await new Promise(r => setTimeout(r, 400))
    const halfScrollY = window.scrollY
    const menuRectAtHalf = menuPinSpacer.getBoundingClientRect()
    // At 50% hero progress, menu must be below viewport (top >= innerHeight)
    const menuHiddenAtHalf = menuRectAtHalf.top >= window.innerHeight - 10

    // Test 2: Full scroll past hero pin (100% progress)
    if (window.lenis) {
      window.lenis.scrollTo(heroDistance + 50, { immediate: true })
    } else {
      window.scrollTo(0, heroDistance + 50)
    }
    await new Promise(r => setTimeout(r, 400))
    const fullScrollY = window.scrollY
    const menuRectAtFull = menuPinSpacer.getBoundingClientRect()

    // Test 3: Scroll back to top to verify rewind
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    await new Promise(r => setTimeout(r, 400))
    const rewoundY = window.scrollY

    return {
      initialScrollY,
      heroDistance,
      menuInitialTop,
      halfScrollY,
      menuTopAtHalf: menuRectAtHalf.top,
      menuHiddenAtHalf,
      fullScrollY,
      menuTopAtFull: menuRectAtFull.top,
      rewoundY
    }
  })
  results.heroLock = heroTest
  console.log('Hero lock test results:', heroTest)

  // ==========================================
  // 4. VERIFY ISSUE 3 & RESPONSIVE MENU HEIGHT
  // ==========================================
  console.log('📸 Taking Menu screenshots at 1440x900 and 1366x768...')

  // Check at 1440x900
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluate(async () => {
    window.ScrollTrigger.refresh()
    const triggers = window.ScrollTrigger.getAll()
    const menuSt = triggers.find(t => t.trigger && t.trigger.id === 'menu')
    const targetY = menuSt ? menuSt.start + 20 : 4520
    if (window.lenis) {
      window.lenis.scrollTo(targetY, { immediate: true })
    } else {
      window.scrollTo(0, targetY)
    }
    await new Promise(r => setTimeout(r, 600))
  })
  await new Promise(r => setTimeout(r, 600))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/menu-1440x900.png` })

  const menuFit1440 = await page.evaluate(() => {
    const menu = document.querySelector('#menu')
    const panel = menu.querySelector('.bg-\\[\\#f3ebdd\\]')
    const rect = panel.getBoundingClientRect()
    return {
      viewportHeight: window.innerHeight,
      panelTop: Math.round(rect.top),
      panelBottom: Math.round(rect.bottom),
      panelHeight: Math.round(rect.height),
      fitsCompletely: rect.top >= 0 && rect.bottom <= window.innerHeight + 1
    }
  })
  results.menuHeight['1440x900'] = menuFit1440
  console.log('Menu Fit at 1440x900:', menuFit1440)

  // Check at 1366x768 (Short Laptop)
  const page1366 = await browser.newPage()
  await page1366.setViewport({ width: 1366, height: 768 })
  await page1366.goto(URL, { waitUntil: 'domcontentloaded' })
  await page1366.waitForFunction(() => !document.getElementById('preloader') || document.getElementById('preloader').style.display === 'none', { timeout: 35000 })
  await new Promise(r => setTimeout(r, 1000))
  const menuFit1366 = await page1366.evaluate(async () => {
    window.ScrollTrigger.refresh()
    const menuSt = window.ScrollTrigger.getAll().find(t => t.trigger && t.trigger.id === 'menu')
    window.lenis.scrollTo(menuSt.start + 10, { immediate: true })
    await new Promise(r => setTimeout(r, 600))
    const panel = document.querySelector('#menu .bg-\\[\\#f3ebdd\\]')
    const r = panel.getBoundingClientRect()
    return {
      viewportHeight: window.innerHeight,
      panelTop: Math.round(r.top),
      panelBottom: Math.round(r.bottom),
      panelHeight: Math.round(r.height),
      fitsCompletely: r.top >= 0 && r.bottom <= window.innerHeight
    }
  })
  await page1366.screenshot({ path: `${SCREENSHOT_DIR}/menu-1366x768.png` })
  await page1366.close()
  results.menuHeight['1366x768'] = menuFit1366
  console.log('Menu Fit at 1366x768:', menuFit1366)

  // Also check 1280x720, 1024x768, 768x1024, 414x896, 375x667
  const viewports = [
    { name: '1280x720', width: 1280, height: 720 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: 'tablet-768x1024', width: 768, height: 1024 },
    { name: 'mobile-414x896', width: 414, height: 896 },
    { name: 'mobile-375x667', width: 375, height: 667 }
  ]

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height })
    await page.evaluate(() => {
      const menu = document.querySelector('#menu')
      const spacer = menu?.closest('.pin-spacer') || menu
      if (spacer) {
        if (window.lenis) {
          window.lenis.scrollTo(spacer.offsetTop, { immediate: true })
        } else {
          window.scrollTo(0, spacer.offsetTop)
        }
      }
    })
    await new Promise(r => setTimeout(r, 500))
    await page.screenshot({ path: `${SCREENSHOT_DIR}/menu-${vp.name}.png` })
    const overflow = await page.evaluate(() => ({
      hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
      docWidth: document.documentElement.scrollWidth,
      winWidth: window.innerWidth
    }))
    results.menuHeight[vp.name] = overflow
  }

  // Capture full section screenshots at 1440x900
  await page.setViewport({ width: 1440, height: 900 })

  // 1. Hero start
  await page.evaluate(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-hero-top.png` })

  // 2. Hero mid
  await page.evaluate(() => {
    const heroDistance = (window.innerHeight * 4)
    if (window.lenis) window.lenis.scrollTo(heroDistance * 0.5, { immediate: true })
    else window.scrollTo(0, heroDistance * 0.5)
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-hero-mid.png` })

  // 3. Hero end / riservato
  await page.evaluate(() => {
    const heroDistance = (window.innerHeight * 4)
    if (window.lenis) window.lenis.scrollTo(heroDistance * 0.88, { immediate: true })
    else window.scrollTo(0, heroDistance * 0.88)
  })
  await new Promise(r => setTimeout(r, 400))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/03-hero-riservato.png` })

  // 4. Story
  await page.evaluate(() => {
    const el = document.querySelector('#story')
    const spacer = el?.closest('.pin-spacer') || el
    if (window.lenis) window.lenis.scrollTo(spacer.offsetTop, { immediate: true })
    else window.scrollTo(0, spacer.offsetTop)
  })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/04-story.png` })

  // 5. Private Dining
  await page.evaluate(() => {
    const el = document.querySelector('#private-dining')
    const spacer = el?.closest('.pin-spacer') || el
    if (window.lenis) window.lenis.scrollTo(spacer.offsetTop, { immediate: true })
    else window.scrollTo(0, spacer.offsetTop)
  })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/05-private-dining.png` })

  // 6. Reviews Marquee
  await page.evaluate(() => {
    const el = document.querySelector('#reviews')
    if (window.lenis) window.lenis.scrollTo(el.offsetTop, { immediate: true })
    else window.scrollTo(0, el.offsetTop)
  })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/06-reviews-marquee.png` })

  // 7. Footer CTA
  await page.evaluate(() => {
    const el = document.querySelector('#reservations')
    if (window.lenis) window.lenis.scrollTo(el.offsetTop, { immediate: true })
    else window.scrollTo(0, el.offsetTop)
  })
  await new Promise(r => setTimeout(r, 500))
  await page.screenshot({ path: `${SCREENSHOT_DIR}/07-footer-cta.png` })

  await browser.close()

  console.log('🎉 Verification completed successfully!')
  fs.writeFileSync('scripts/verification-report.json', JSON.stringify(results, null, 2))
}

runVerification().catch(err => {
  console.error('Verification failed:', err)
  process.exit(1)
})
