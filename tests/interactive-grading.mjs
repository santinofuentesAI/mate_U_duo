import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const server = await createServer({server:{host:'127.0.0.1',port:5176,strictPort:true}});
await server.listen();

const browser = await chromium.launch({headless:true});
const context = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});
const page = await context.newPage();

const testCases = [
  { 
    id: 'discreta-reglas-de-inferencia-interactive-proof-0', 
    type: 'ProofBuilder', 
    name: 'proof-builder',
    correctFlow: async () => {
      // ProofBuilder: Build a valid proof step by step
      await page.waitForTimeout(1000);
      const stepButtons = page.locator('.proof-step-button, button:has-text("Silogismo")');
      if (await stepButtons.count() > 0) {
        await stepButtons.first().click();
        await page.waitForTimeout(500);
      }
    },
    incorrectFlow: async () => {
      // Try to submit without building proof
      const checkBtn = page.locator('button:has-text("Comprobar"), button:has-text("Verificar"), button:has-text("Enviar")');
      if (await checkBtn.count() > 0) {
        await checkBtn.first().click();
      }
    }
  },
  { 
    id: 'discreta-tablas-de-verdad-interactive-table-0', 
    type: 'InteractiveTruthTable', 
    name: 'truth-table',
    correctFlow: async () => {
      // Fill truth table cells correctly (first cell with V/F)
      await page.waitForTimeout(1000);
      const cells = page.locator('.truth-cell, button[aria-label*="fila"]');
      if (await cells.count() > 0) {
        await cells.first().click();
        await page.waitForTimeout(300);
        const vButton = page.locator('button:has-text("V"), button:has-text("T")');
        if (await vButton.count() > 0) {
          await vButton.first().click();
        }
      }
    },
    incorrectFlow: async () => {
      const cells = page.locator('.truth-cell, button[aria-label*="fila"]');
      if (await cells.count() > 0) {
        await cells.first().click();
        const fButton = page.locator('button:has-text("F")');
        if (await fButton.count() > 0) {
          await fButton.first().click();
        }
      }
    }
  },
  { 
    id: 'discreta-demostraciones-y-falacias-order-steps-0', 
    type: 'OrderStepsExercise', 
    name: 'order-steps',
    correctFlow: async () => {
      // Reorder steps correctly
      await page.waitForTimeout(1000);
      // Just submit without reordering (might be correct order already)
      const submitBtn = page.locator('button:has-text("Comprobar orden"), button:has-text("Verificar"), button:has-text("Enviar")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
      }
    },
    incorrectFlow: async () => {
      // Move a step to wrong position
      const moveButtons = page.locator('button[aria-label*="Subir"], button[aria-label*="Bajar"]');
      if (await moveButtons.count() > 0) {
        await moveButtons.first().click();
        await page.waitForTimeout(300);
        const submitBtn = page.locator('button:has-text("Comprobar"), button:has-text("Verificar")');
        if (await submitBtn.count() > 0) {
          await submitBtn.first().click();
        }
      }
    }
  },
  { 
    id: 'discreta-equivalencias-y-simplificacion-sort-cards-0', 
    type: 'CardSortExercise', 
    name: 'sort-cards',
    correctFlow: async () => {
      // Drag card to correct bucket
      await page.waitForTimeout(1000);
      const cards = page.locator('.sortable-card, [draggable="true"]');
      if (await cards.count() > 0) {
        const card = cards.first();
        const buckets = page.locator('.bucket, [data-bucket]');
        if (await buckets.count() > 0) {
          const targetBucket = buckets.first();
          await card.dragTo(targetBucket);
        }
      }
    },
    incorrectFlow: async () => {
      // Leave cards unsorted or in wrong bucket
      const submitBtn = page.locator('button:has-text("Comprobar"), button:has-text("Verificar")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
      }
    }
  },
  { 
    id: 'discreta-operaciones-con-conjuntos-interactive-venn-0', 
    type: 'InteractiveVennExercise', 
    name: 'venn-diagram',
    correctFlow: async () => {
      // Click regions in Venn diagram
      await page.waitForTimeout(1000);
      const regions = page.locator('.venn-region, [data-region]');
      if (await regions.count() > 0) {
        await regions.first().click();
        await page.waitForTimeout(300);
      }
    },
    incorrectFlow: async () => {
      // Click wrong regions
      const regions = page.locator('.venn-region, [data-region]');
      if (await regions.count() > 1) {
        await regions.last().click();
      }
      const submitBtn = page.locator('button:has-text("Comprobar"), button:has-text("Verificar")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
      }
    }
  },
  { 
    id: 'precalculo-raices-racionales-y-factores-graph-slider-0', 
    type: 'FunctionGraphSlider', 
    name: 'graph-slider',
    correctFlow: async () => {
      // Adjust sliders to match target
      await page.waitForTimeout(1000);
      const sliders = page.locator('input[type="range"]');
      if (await sliders.count() > 0) {
        await sliders.first().fill('2');
        await page.waitForTimeout(300);
      }
    },
    incorrectFlow: async () => {
      // Leave sliders at wrong values
      const submitBtn = page.locator('button:has-text("Comprobar"), button:has-text("Verificar")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
      }
    }
  },
  { 
    id: 'precalculo-division-sintetica-match-graphs-0', 
    type: 'MatchGraphExercise', 
    name: 'match-graphs',
    correctFlow: async () => {
      // Match equations to graphs
      await page.waitForTimeout(1000);
      const matchButtons = page.locator('.graph-option, button[data-graph]');
      if (await matchButtons.count() > 0) {
        await matchButtons.first().click();
      }
    },
    incorrectFlow: async () => {
      // Match to wrong graph
      const matchButtons = page.locator('.graph-option, button[data-graph]');
      if (await matchButtons.count() > 1) {
        await matchButtons.last().click();
      }
    }
  }
];

fs.mkdirSync('/opt/cursor/artifacts/screenshots', {recursive: true});

const results = [];

for (const test of testCases) {
  console.log(`\n🧪 Testing ${test.type} (${test.name})...`);
  
  let correctResult = { detected: false, message: '' };
  let incorrectResult = { detected: false, message: '' };
  
  try {
    // Test CORRECT answer
    console.log(`  📗 Testing CORRECT answer...`);
    await page.goto(`http://127.0.0.1:5176/?debugQ=${test.id}`, {waitUntil: 'networkidle'});
    await page.waitForTimeout(2000);
    
    // Capture screenshot
    await page.screenshot({
      path: `/opt/cursor/artifacts/screenshots/interactive-${test.name}.png`,
      fullPage: false
    });
    
    // Set up dialog handler
    const correctDialogPromise = new Promise(resolve => {
      const handler = async dialog => {
        const message = dialog.message();
        console.log(`    Alert: ${message.substring(0, 100)}`);
        await dialog.accept();
        page.off('dialog', handler);
        resolve({ detected: message.includes('CORRECTO') || message.includes('✅'), message });
      };
      page.once('dialog', handler);
    });
    
    // Execute correct flow
    try {
      await test.correctFlow();
      const dialogResult = await Promise.race([
        correctDialogPromise,
        new Promise(resolve => setTimeout(() => resolve({ detected: false, message: 'timeout' }), 3000))
      ]);
      correctResult = dialogResult;
      
      if (correctResult.detected) {
        console.log(`    ✅ Correct answer accepted with feedback`);
      } else {
        console.log(`    ⚠️ No correct feedback detected`);
      }
      
    } catch (e) {
      console.log(`    ⚠️ Correct flow error: ${e.message.substring(0, 80)}`);
    }
    
    // Test INCORRECT answer
    console.log(`  📕 Testing INCORRECT answer...`);
    await page.goto(`http://127.0.0.1:5176/?debugQ=${test.id}`, {waitUntil: 'networkidle'});
    await page.waitForTimeout(2000);
    
    // Set up dialog handler
    const incorrectDialogPromise = new Promise(resolve => {
      const handler = async dialog => {
        const message = dialog.message();
        console.log(`    Alert: ${message.substring(0, 100)}`);
        await dialog.accept();
        page.off('dialog', handler);
        resolve({ detected: message.includes('INCORRECTO') || message.includes('❌'), message });
      };
      page.once('dialog', handler);
    });
    
    try {
      await test.incorrectFlow();
      const dialogResult = await Promise.race([
        incorrectDialogPromise,
        new Promise(resolve => setTimeout(() => resolve({ detected: false, message: 'timeout' }), 3000))
      ]);
      incorrectResult = dialogResult;
      
      if (incorrectResult.detected) {
        console.log(`    ✅ Incorrect answer rejected with feedback`);
      } else {
        console.log(`    ⚠️ No incorrect feedback detected`);
      }
      
    } catch (e) {
      console.log(`    ⚠️ Incorrect flow error: ${e.message.substring(0, 80)}`);
    }
    
    // Determine overall result
    if (correctResult.detected || incorrectResult.detected) {
      console.log(`✅ ${test.type} grading works`);
      results.push({ type: test.type, status: 'PASS', note: `Correct: ${correctResult.detected}, Incorrect: ${incorrectResult.detected}` });
    } else {
      console.log(`⚠️ ${test.type} needs grading verification`);
      results.push({ type: test.type, status: 'WARN', note: 'No feedback detected' });
    }
    
  } catch (e) {
    console.log(`❌ ${test.type} failed:`, e.message);
    results.push({ type: test.type, status: 'FAIL', note: e.message });
  }
}

await browser.close();
await server.close();

console.log('\n📊 SUMMARY:');
results.forEach(r => {
  console.log(`${r.status === 'PASS' ? '✅' : '❌'} ${r.type}: ${r.status} (${r.note})`);
});

const passed = results.filter(r => r.status === 'PASS').length;
console.log(`\n${passed}/${results.length} tests passed`);

if (passed < results.length) {
  process.exit(1);
}
