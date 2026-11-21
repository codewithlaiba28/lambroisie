import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'

async function debug() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new'
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 667 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })

  await new Promise(r => setTimeout(r, 2000))

  const overflowing = await page.evaluate(() => {
    const list = []
    const winW = window.innerWidth
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.right > winW + 2) {
        list.push({
          tag: el.tagName,
          id: el.id,
          cls: (el.className || '').toString().slice(0, 70),
          width: Math.round(rect.width),
          right: Math.round(rect.right)
        })
      }
    })
    return list
  })

  console.log('Total overflowing elements:', overflowing.length)
  console.log('Top 15:', overflowing.slice(0, 15))
  await browser.close()
}

debug()
