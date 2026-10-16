import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import fs from 'node:fs';

const server = await createServer({server:{host:'127.0.0.1',port:5176,strictPort:true}});
await server.listen();

const browser = await chromium.launch({headless:false});
const context = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3});
const page = await context.newPage();

// Interactive question IDs (from content.ts injection logic)
const testCases = [
  { id: 'd-inf-interactive-proof-0', type: 'ProofBuilder', name: 'proof-builder' },
  { id: 'd-tvbase-interactive-table-0', type: 'InteractiveTruthTable', name: 'truth-table' },
  { id: 'd-inf-interactive-order-0', type: 'OrderStepsExercise', name: 'order-steps' },
  { id: 'd-equiv-interactive-sort-0', type: 'CardSortExercise', name: 'sort-cards' },
  { id: 'd-equiv-interactive-venn-0', type: 'InteractiveVennExercise', name: 'venn-diagram' },
  { id: 'p-funciones-interactive-graph-0', type: 'FunctionGraphSlider', name: 'graph-slider' },
  { id: 'p-funciones-interactive-match-0', type: 'MatchGraphExercise', name: 'match-graphs' }
];

fs.mkdirSync('/opt/cursor/artifacts/screenshots', {recursive: true});

const results = [];

for (const test of testCases) {
  console.log(`\n🧪 Testing ${test.type} (${test.name})...`);
  try {
    await page.goto(`http://127.0.0.1:5176/?debugQ=${test.id}`);
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: `/opt/cursor/artifacts/screenshots/interactive-${test.name}.png`,
      fullPage: false
    });

    // Try to interact (basic click to test correct answer path)
    // For now, just verify the exercise rendered
    const exerciseVisible = await page.locator('.exercise-card, .step-workspace, .truth-table-grid, .card-buckets, .venn-diagram, .graph-canvas, .match-graphs-grid').count();
    
    if (exerciseVisible > 0) {
      console.log(`✅ ${test.type} rendered successfully`);
      results.push({ type: test.type, status: 'PASS', note: 'Rendered' });
    } else {
      console.log(`❌ ${test.type} did not render`);
      results.push({ type: test.type, status: 'FAIL', note: 'Did not render' });
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
