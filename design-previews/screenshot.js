import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = [
  { name: 'option-a', label: 'A-难度渐变' },
  { name: 'option-b', label: 'B-毛玻璃3D' },
  { name: 'option-c', label: 'C-霓虹暗色' },
  { name: 'option-d', label: 'D-学院简洁' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  for (const opt of options) {
    const filePath = path.resolve(__dirname, `${opt.name}.html`);
    const outPath = path.resolve(__dirname, `${opt.name}.png`);
    
    const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
    await page.goto(`file://${filePath.replace(/\\/g, '/')}`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: outPath, fullPage: false });
    await page.close();
    
    console.log(`✅ ${opt.label} -> ${outPath}`);
  }
  
  await browser.close();
  console.log('\n✅ All screenshots taken!');
}

main().catch(console.error);
