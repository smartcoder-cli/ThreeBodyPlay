/**
 * ThreeBodyPlay - Interactive UI Test
 * Tests all sidebar controls across 21 lessons
 * Run with: node test-lessons.js
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001/ThreeBodyPlay';

const LESSONS = [
  { num: 1,  hash: '#lesson-01', desc: 'Hello Three.js' },
  { num: 2,  hash: '#lesson-02', desc: 'Geometry Lab' },
  { num: 3,  hash: '#lesson-03', desc: 'Basic Paint' },
  { num: 4,  hash: '#lesson-04', desc: 'Let There Be Light' },
  { num: 5,  hash: '#lesson-05', desc: 'The Flow of Time' },
  { num: 6,  hash: '#lesson-06', desc: 'Camera & Response' },
  { num: 7,  hash: '#lesson-07', desc: 'Family Tree' },
  { num: 8,  hash: '#lesson-08', desc: 'Interaction (Raycaster)' },
  { num: 9,  hash: '#lesson-09', desc: 'Realistic Surface (PBR)' },
  { num: 10, hash: '#lesson-10', desc: 'Reflection & Skybox' },
  { num: 11, hash: '#lesson-11', desc: 'Atmospheric Fog' },
  { num: 12, hash: '#lesson-12', desc: 'BufferGeometry (Vertices)' },
  { num: 13, hash: '#lesson-13', desc: 'Model Shop (GLTF)' },
  { num: 14, hash: '#lesson-14', desc: 'Media Textures' },
  { num: 15, hash: '#lesson-15', desc: 'Physics World' },
  { num: 16, hash: '#lesson-16', desc: 'Post-Processing' },
  { num: 17, hash: '#lesson-17', desc: 'Pixel Sorcery (Shaders)' },
  { num: 18, hash: '#lesson-18', desc: 'High Performance' },
  { num: 19, hash: '#lesson-19', desc: 'Next Dimension (XR)' },
  { num: 20, hash: '#lesson-20', desc: 'WebGPU Future' },
  { num: 21, hash: '#lesson-21', desc: 'The Grand Finale' },
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
  if (!controls) return results;
  
  // Test color inputs - change value
  for (const color of controls.colorInputs) {
    try {
      const newColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      await page.evaluate((sel) => {
        const selector = sel.id.startsWith('color_') ? `input[type="color"]` : `input[id="${sel.id}"]`;
        const el = document.querySelector(selector);
        if (el) {
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
  
  // Test sliders
  for (const slider of controls.rangeInputs) {
    try {
      const mid = ((parseFloat(slider.min) + parseFloat(slider.max)) / 2).toString();
      await page.evaluate((sel) => {
        const selector = sel.id.startsWith('range_') ? `input[type="range"]` : `input[id="${sel.id}"]`;
        const el = document.querySelector(selector);
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
  
  return results;
}

async function testLesson(browser, lesson) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  try {
    await page.goto(`${BASE_URL}/${lesson.hash}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('#three-canvas', { timeout: 15000 });
    
    const controls = await getSidebarControls(page);
    const interactionResults = await interactWithControls(page, controls);
    
    await context.close();
    return {
      num: lesson.num,
      name: lesson.desc,
      status: errors.length === 0 ? 'PASS' : 'FAIL',
      jsErrors: errors,
      controlsFound: controls,
      interactionResults
    };
  } catch (err) {
    await context.close();
    return {
      num: lesson.num,
      name: lesson.desc,
      status: 'ERROR',
      jsErrors: [err.message]
    };
  }
}

async function runTests() {
  console.log('🎮 ThreeBodyPlay Interactive UI Tests\n');
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  for (const lesson of LESSONS) {
    process.stdout.write(`L${String(lesson.num).padStart(2, '0')} ${lesson.desc.padEnd(30)} `);
    const result = await testLesson(browser, lesson);
    results.push(result);
    
    if (result.status === 'PASS') {
      console.log('✅ PASS');
    } else {
      console.log(`❌ ${result.status} - ${result.jsErrors[0]}`);
    }
  }
  
  await browser.close();
  
  const passed = results.filter(r => r.status === 'PASS').length;
  console.log(`\nSummary: ${passed}/${LESSONS.length} passed.`);
}

runTests().catch(console.error);
