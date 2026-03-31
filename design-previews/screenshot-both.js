import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  // Test neon theme
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page1.goto('http://localhost:3001/');
  await page1.waitForSelector('.theme-switcher', { timeout: 10000 });
  await page1.waitForTimeout(2000);
  
  // Set neon theme explicitly
  await page1.evaluate(() => {
    localStorage.setItem('cardTheme', 'neon');
    document.body.setAttribute('data-card-theme', 'neon');
  });
  await page1.reload();
  await page1.waitForTimeout(2000);
  await page1.screenshot({ path: path.resolve(__dirname, 'theme-neon.png') });
  console.log('✅ Neon theme screenshot saved');
  
  // Set gradient theme
  await page1.evaluate(() => {
    localStorage.setItem('cardTheme', 'gradient');
    document.body.setAttribute('data-card-theme', 'gradient');
  });
  await page1.reload();
  await page1.waitForTimeout(2000);
  await page1.screenshot({ path: path.resolve(__dirname, 'theme-gradient.png') });
  console.log('✅ Gradient theme screenshot saved');
  
  await browser.close();
  console.log('\n✅ Done!');
}

main().catch(console.error);
