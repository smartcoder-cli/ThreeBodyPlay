/**
 * ThreeBodyPlay - Interactive UI Test
 * Tests all sidebar controls across 18 lessons
 * Run with: node test-lessons.js
 * 
 * Design doc controls per lesson:
 * - Color pickers: change object/scene colors
 * - Sliders: adjust speed, count, scale, etc.
 * - Checkboxes: toggle auto-rotate, wireframe, grid, etc.
 * - Select: change layout mode, model type
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001';

const LESSONS = [
  { num: 1, hash: '#lesson-01', controls: ['color', 'checkbox'], desc: 'Basic Scene' },
  { num: 2, hash: '#lesson-02', controls: ['color', 'checkbox'], desc: 'Geometries' },
  { num: 3, hash: '#lesson-03', controls: ['color', 'slider', 'checkbox'], desc: 'Materials' },
  { num: 4, hash: '#lesson-04', controls: ['color', 'slider', 'checkbox'], desc: 'Lighting' },
  { num: 5, hash: '#lesson-05', controls: ['color', 'slider', 'checkbox'], desc: 'Animation' },
  { num: 6, hash: '#lesson-06', controls: ['checkbox', 'slider'], desc: 'Controls' },
  { num: 7, hash: '#lesson-07', controls: ['color', 'slider'], desc: 'Particles' },
  { num: 8, hash: '#lesson-08', controls: ['color', 'slider', 'checkbox'], desc: 'Physics' },
  { num: 9, hash: '#lesson-09', controls: ['slider', 'color'], desc: 'Post Processing' },
  { num: 10, hash: '#lesson-10', controls: ['color', 'slider', 'checkbox'], desc: 'Model Loading' },
  { num: 11, hash: '#lesson-11', controls: ['color', 'slider', 'button'], desc: 'Audio & Video' },
  { num: 12, hash: '#lesson-12', controls: ['slider'], desc: 'Performance' },
  { num: 13, hash: '#lesson-13', controls: ['color', 'checkbox'], desc: 'Shaders' },
  { num: 14, hash: '#lesson-14', controls: ['checkbox'], desc: 'VR & AR' },
  { num: 15, hash: '#lesson-15', controls: ['color', 'checkbox'], desc: 'Terrain & Skybox' },
  { num: 16, hash: '#lesson-16', controls: ['color', 'slider', 'checkbox'], desc: 'WebGPU' },
  { num: 17, hash: '#lesson-17', controls: ['color', 'checkbox', 'select'], desc: 'Responsive Design' },
  { num: 18, hash: '#lesson-18', controls: ['color', 'slider'], desc: 'Final Project' },
];

async function getSidebarControls(page) {
  return page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return null;
    
    const controls = {
      colorInputs: [],
      rangeInputs: [],
      checkboxes: [],
      buttons: [],
      selects: []
    };
    
    // Color inputs
    sidebar.querySelectorAll('input[type="color"]').forEach(el => {
      controls.colorInputs.push({
        id: el.id || `color_${Math.random().toString(36).substr(2, 6)}`,
        value: el.value
      });
    });
    
    // Range inputs (sliders)
    sidebar.querySelectorAll('input[type="range"]').forEach(el => {
      controls.rangeInputs.push({
        id: el.id || `range_${Math.random().toString(36).substr(2, 6)}`,
        value: el.value,
        min: el.min,
        max: el.max
      });
    });
    
    // Checkboxes
    sidebar.querySelectorAll('input[type="checkbox"]').forEach(el => {
      controls.checkboxes.push({
        id: el.id || `checkbox_${Math.random().toString(36).substr(2, 6)}`,
        checked: el.checked
      });
    });
    
    // Buttons (non-submit)
    sidebar.querySelectorAll('button').forEach(el => {
      controls.buttons.push({
        text: el.textContent.trim()
      });
    });
    
    // Select dropdowns
    sidebar.querySelectorAll('select').forEach(el => {
      controls.selects.push({
        id: el.id || `select_${Math.random().toString(36).substr(2, 6)}`,
        value: el.value,
        options: Array.from(el.options).map(o => o.value)
      });
    });
    
    return controls;
  });
}

async function interactWithControls(page, controls) {
  const results = [];
  
  // Test color inputs - change value
  for (const color of controls.colorInputs) {
    try {
      const newColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      await page.evaluate((sel) => {
        const el = document.querySelector(`input[type="color"]${sel.id.startsWith('color_') ? '' : `#${sel.id}`}`);
        if (el) {
          // Fire a synthetic color change
          el.value = sel.newValue;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, { id: color.id, newValue: newColor });
      results.push({ type: 'color', id: color.id, status: 'OK' });
    } catch (e) {
      results.push({ type: 'color', id: color.id, status: 'WARN', note: e.message });
    }
  }
  
  // Test sliders - move to mid and max position
  for (const slider of controls.rangeInputs) {
    try {
      const mid = ((parseFloat(slider.min) + parseFloat(slider.max)) / 2).toString();
      await page.evaluate((sel) => {
        const el = document.querySelector(`input[type="range"]${sel.id.startsWith('range_') ? '' : `#${sel.id}`}`);
        if (el) {
          el.value = sel.mid;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, { id: slider.id, mid });
      results.push({ type: 'slider', id: slider.id, status: 'OK' });
    } catch (e) {
      results.push({ type: 'slider', id: slider.id, status: 'WARN', note: e.message });
    }
  }
  
  // Test checkboxes - toggle
  for (const checkbox of controls.checkboxes) {
    try {
      await page.evaluate((sel) => {
        const el = document.querySelector(`input[type="checkbox"]${sel.id.startsWith('checkbox_') ? '' : `#${sel.id}`}`);
        if (el) {
          el.click();
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, { id: checkbox.id });
      results.push({ type: 'checkbox', id: checkbox.id, status: 'OK' });
    } catch (e) {
      results.push({ type: 'checkbox', id: checkbox.id, status: 'WARN', note: e.message });
    }
  }
  
  // Test select dropdowns
  for (const select of controls.selects) {
    try {
      if (select.options.length > 1) {
        const newVal = select.options[1] || select.options[0];
        await page.selectOption(`select`, newVal);
        results.push({ type: 'select', id: select.id, status: 'OK' });
      }
    } catch (e) {
      results.push({ type: 'select', id: select.id, status: 'WARN', note: e.message });
    }
  }
  
  return results;
}

async function testShowCodeToggle(page) {
  try {
    const codePanel = await page.locator('.panel h3 span').filter({ hasText: 'Code Example' }).first();
    if (await codePanel.isVisible()) {
      await codePanel.click();
      await page.waitForTimeout(300);
      
      const codeVisible = await page.locator('.code-preview').first().isVisible().catch(() => false);
      return { status: 'OK', codeVisibleAfterClick: codeVisible };
    }
    return { status: 'SKIP' };
  } catch (e) {
    return { status: 'WARN', note: 'Show Code toggle not found' };
  }
}

async function testLesson(browser, lesson) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });
  
  try {
    await page.goto(`${BASE_URL}/${lesson.hash}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for Three.js canvas
    await page.waitForSelector('#three-canvas', { timeout: 10000 });
    await page.waitForTimeout(2500); // Let Three.js initialize
    
    // Check for JS errors
    const jsErrors = errors.filter(e => !e.includes('THREE is not defined'));
    
    // Get sidebar controls
    const controls = await getSidebarControls(page);
    
    // Test Show Code toggle
    const codeResult = await testShowCodeToggle(page);
    
    // Interact with all controls
    const interactionResults = await interactWithControls(page, controls);
    
    // Wait a moment for any async errors
    await page.waitForTimeout(500);
    
    // Final error check
    const finalErrors = [...errors];
    
    await context.close();
    
    return {
      num: lesson.num,
      name: lesson.desc,
      status: finalErrors.length === 0 ? 'PASS' : 'FAIL',
      jsErrors: finalErrors,
      controlsFound: controls,
      interactionResults,
      codeToggle: codeResult
    };
    
  } catch (err) {
    await context.close();
    return {
      num: lesson.num,
      name: lesson.desc,
      status: 'ERROR',
      jsErrors: [err.message],
      controlsFound: null,
      interactionResults: [],
      codeToggle: null
    };
  }
}

async function runTests() {
  console.log('🎮 ThreeBodyPlay Interactive UI Tests\n');
  console.log(`Testing ${LESSONS.length} lessons at ${BASE_URL}\n`);
  
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  for (const lesson of LESSONS) {
    process.stdout.write(`L${String(lesson.num).padStart(2, '0')} ${lesson.desc.padEnd(20)} `);
    const result = await testLesson(browser, lesson);
    results.push(result);
    
    if (result.status === 'PASS') {
      const ctrlCount = countControls(result.controlsFound);
      const interactions = result.interactionResults.filter(r => r.status === 'OK').length;
      process.stdout.write(`✅ PASS`);
      process.stdout.write(` | controls:${ctrlCount} interactions:${interactions}`);
      if (result.codeToggle?.status === 'OK') process.stdout.write(` code-toggle:✓`);
      console.log('');
    } else if (result.status === 'FAIL') {
      console.log(`❌ FAIL - ${result.jsErrors[0]}`);
    } else {
      console.log(`💥 ERROR - ${result.jsErrors[0]}`);
    }
  }
  
  await browser.close();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed} | 💥 Errors: ${errors}\n`);
  
  // Control coverage
  console.log('Controls tested per lesson:');
  for (const r of results) {
    if (r.status === 'PASS') {
      const c = r.controlsFound;
      const parts = [];
      if (c?.colorInputs?.length) parts.push(`color×${c.colorInputs.length}`);
      if (c?.rangeInputs?.length) parts.push(`slider×${c.rangeInputs.length}`);
      if (c?.checkboxes?.length) parts.push(`checkbox×${c.checkboxes.length}`);
      if (c?.buttons?.length) parts.push(`button×${c.buttons.length}`);
      if (c?.selects?.length) parts.push(`select×${c.selects.length}`);
      console.log(`  L${String(r.num).padStart(2, '0')} ${r.name.padEnd(18)} | ${parts.join(' | ') || 'no controls'}`);
    }
  }
  
  if (failed > 0 || errors > 0) {
    console.log('\nFailed Lessons:');
    results.filter(r => r.status !== 'PASS').forEach(r => {
      console.log(`  L${String(r.num).padStart(2, '0')} - ${r.name}: ${r.jsErrors[0]}`);
    });
  }
  
  console.log('\n✅ Test run complete.');
}

function countControls(controls) {
  if (!controls) return 0;
  return (controls.colorInputs?.length || 0) +
         (controls.rangeInputs?.length || 0) +
         (controls.checkboxes?.length || 0) +
         (controls.buttons?.length || 0) +
         (controls.selects?.length || 0);
}

runTests().catch(console.error);
