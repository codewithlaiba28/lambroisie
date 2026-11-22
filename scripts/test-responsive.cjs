const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'Mobile 375x667', width: 375, height: 667 },
    { name: 'Mobile 414x896', width: 414, height: 896 },
    { name: 'Tablet 768x1024', width: 768, height: 1024 },
    { name: 'Laptop 1024x768', width: 1024, height: 768 },
    { name: 'Desktop 1440x900', width: 1440, height: 900 },
    { name: 'Landscape Phone 844x390', width: 844, height: 390 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
    });

    // Check canvas rendered
    const canvasWorking = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return c && c.width > 0 && c.height > 0;
    });

    console.log(`Viewport ${vp.name}: Overflow=${hasHorizontalOverflow ? 'FAIL' : 'PASS'}, Canvas=${canvasWorking ? 'PASS' : 'FAIL'}`);
    await page.close();
  }

  await browser.close();
  console.log('ALL VIEWPORTS PASSED!');
})();
