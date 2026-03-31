import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';
const OUTPUT_DIR = './screenshots';

const LESSONS = [
  { num: 1, name: 'Basic Scene' },
  { num: 2, name: 'Geometries' },
  { num: 3, name: 'Materials' },
  { num: 4, name: 'Lighting' },
  { num: 5, name: 'Animation' },
  { num: 6, name: 'Controls' },
  { num: 7, name: 'Particles' },
  { num: 8, name: 'Physics' },
  { num: 9, name: 'Post Processing' },
  { num: 10, name: 'Model Loading' },
  { num: 11, name: 'Audio & Video' },
  { num: 12, name: 'Performance' },
  { num: 13, name: 'Shaders' },
  { num: 14, name: 'VR & AR' },
  { num: 15, name: 'Terrain & Skybox' },
  { num: 16, name: 'WebGPU' },
  { num: 17, name: 'Responsive Design' },
  { num: 18, name: 'Final Project' },
];

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshot(browser, lesson) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  try {
    await page.goto(`${BASE_URL}/#lesson-${String(lesson.num).padStart(2, '0')}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    await page.waitForSelector('#three-canvas', { timeout: 10000 });
    await page.waitForTimeout(5000); // Wait 5 seconds for Three.js to fully render
    
    const filename = `lesson-${String(lesson.num).padStart(2, '0')}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    await page.screenshot({ path: filepath, fullPage: false });
    
    await context.close();
    return { num: lesson.num, name: lesson.name, status: 'OK', filepath };
  } catch (err) {
    await context.close();
    return { num: lesson.num, name: lesson.name, status: 'ERROR', error: err.message };
  }
}

async function main() {
  console.log('📸 Taking screenshots of all 18 lessons...\n');
  
  const browser = await chromium.launch({ headless: true });
  
  for (const lesson of LESSONS) {
    process.stdout.write(`L${String(lesson.num).padStart(2, '0')} ${lesson.name.padEnd(20)} `);
    const result = await takeScreenshot(browser, lesson);
    
    if (result.status === 'OK') {
      console.log(`✅ saved to ${result.filepath}`);
    } else {
      console.log(`❌ ${result.error}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ All screenshots taken!');
}

main().catch(console.error);
