/**
 * ThreeBodyPlay - Automated Quality Audit
 * Tests all 21 lessons for UI integrity and interactivity.
 */
import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001';
const LESSONS = Array.from({ length: 21 }, (_, i) => ({
  num: i + 1,
  hash: `#lesson-${(i + 1).toString().padStart(2, '0')}`
}));

async function runAudit() {
  console.log('🚀 Starting Systematic Audit of 21 Lessons...\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const lesson of LESSONS) {
    process.stdout.write(`Testing L${lesson.num.toString().padStart(2, '0')}... `);
    
    try {
      await page.goto(`${BASE_URL}/${lesson.hash}`, { waitUntil: 'networkidle' });
      
      // 1. Check if LessonLayout loaded
      const sidebar = await page.waitForSelector('.sidebar', { timeout: 3000 });
      if (!sidebar) throw new Error('Sidebar not found');

      // 2. Check if Canvas is present
      const canvas = await page.waitForSelector('canvas', { timeout: 3000 });
      if (!canvas) throw new Error('Canvas not found');

      // 3. Test Interactivity: Change first color input if exists
      const colorPicker = await page.$('input[type="color"]');
      if (colorPicker) {
        await colorPicker.fill('#ff0000');
        // Small delay to ensure no crash
        await page.waitForTimeout(100);
      }

      // 4. Test Sliders
      const slider = await page.$('input[type="range"]');
      if (slider) {
        await slider.fill('0.8');
        await page.waitForTimeout(100);
      }

      console.log('✅ PASS');
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\nAudit Completed.');
}

runAudit().catch(err => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
