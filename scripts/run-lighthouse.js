import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5173/'

async function runAudit() {
  console.log('🚀 Launching Chrome for Lighthouse...')
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  })

  // 1. Desktop Audit
  console.log('🖥️ Running Desktop Lighthouse audit...')
  const desktopResult = await lighthouse(URL, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error'
  }, {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1
      }
    }
  })

  const dScores = {
    performance: Math.round(desktopResult.lhr.categories.performance.score * 100),
    accessibility: Math.round(desktopResult.lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(desktopResult.lhr.categories['best-practices'].score * 100),
    seo: Math.round(desktopResult.lhr.categories.seo.score * 100)
  }
  console.log('Desktop Scores:', dScores)
  fs.writeFileSync('lighthouse-desktop.json', JSON.stringify(dScores, null, 2))

  // 2. Mobile Audit
  console.log('📱 Running Mobile Lighthouse audit...')
  const mobileResult = await lighthouse(URL, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error'
  }, {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 1.75,
        disabled: false
      }
    }
  })

  const mScores = {
    performance: Math.round(mobileResult.lhr.categories.performance.score * 100),
    accessibility: Math.round(mobileResult.lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(mobileResult.lhr.categories['best-practices'].score * 100),
    seo: Math.round(mobileResult.lhr.categories.seo.score * 100)
  }
  console.log('Mobile Scores:', mScores)
  fs.writeFileSync('lighthouse-mobile.json', JSON.stringify(mScores, null, 2))

  await chrome.kill()
  console.log('✅ Lighthouse audits finished.')
}

runAudit().catch(err => {
  console.error('Lighthouse failed:', err)
  process.exit(1)
})
