const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a typical desktop viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to luxury-wellness.aura.build...');
    await page.goto('https://luxury-wellness.aura.build', { waitUntil: 'networkidle2' });
    
    // Give it a little extra time to load any dynamic content
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    fs.writeFileSync('luxury-wellness-rendered.html', html);
    
    console.log('Successfully saved rendered HTML to luxury-wellness-rendered.html');
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
