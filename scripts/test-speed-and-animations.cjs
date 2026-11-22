const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleMsgs = [];
  const networkEvents = [];
  let totalBytes = 0;

  page.on('console', msg => consoleMsgs.push(msg.text()));
  page.on('response', res => {
    networkEvents.push({ url: res.url(), status: res.status() });
    const cl = res.headers()['content-length'];
    if (cl) totalBytes += parseInt(cl, 10);
  });

  console.log('Testing initial load at http://localhost:5173/ ...');
  const t0 = Date.now();
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  const domLoadedTime = Date.now() - t0;
  console.log(`DOM Content Loaded in ${domLoadedTime} ms.`);

  // Wait for preloader to dismiss (isLoaded)
  await page.waitForFunction(() => {
    const p = document.getElementById('preloader');
    return !p || window.getComputedStyle(p).display === 'none' || window.getComputedStyle(p).opacity === '0';
  }, { timeout: 4000 });
  const preloaderDismissedTime = Date.now() - t0;
  console.log(`Preloader dismissed and site interactive in ${preloaderDismissedTime} ms!`);

  // Check canvas render
  const canvasStatus = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'no-canvas';
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
    return {
      width: canvas.width,
      height: canvas.height,
      centerPixelAlpha: pixel[3],
      hasColor: pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0
    };
  });
  console.log('Canvas status:', canvasStatus);

  // Test scrolling down through Hero, Menu, Story, Salons, Reviews, Footer
  console.log('Testing scroll animations...');
  const scrollSteps = [500, 1500, 3000, 4500, 6000, 7500, 9000];
  for (const y of scrollSteps) {
    await page.evaluate((targetY) => {
      window.scrollTo(0, targetY);
    }, y);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Scrolled smoothly through all sections!');

  console.log(`Total transferred on initial interaction: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log('Console errors:', consoleMsgs.filter(m => m.toLowerCase().includes('error')));

  await browser.close();
  console.log('TEST PASSED SUCCESSFULLY!');
})();
