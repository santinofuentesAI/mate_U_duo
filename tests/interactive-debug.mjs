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
  { id: 'discreta-reglas-de-inferencia-interactive-proof-0', type: 'ProofBuilder', name: 'proof-builder' },
  { id: 'discreta-tablas-de-verdad-interactive-table-0', type: 'InteractiveTruthTable', name: 'truth-table' },
  { id: 'discreta-demostraciones-y-falacias-order-steps-0', type: 'OrderStepsExercise', name: 'order-steps' },
  { id: 'discreta-equivalencias-y-simplificacion-sort-cards-0', type: 'CardSortExercise', name: 'sort-cards' },
  { id: 'discreta-operaciones-con-conjuntos-interactive-venn-0', type: 'InteractiveVennExercise', name: 'venn-diagram' },
  { id: 'precalculo-raices-racionales-y-factores-graph-slider-0', type: 'FunctionGraphSlider', name: 'graph-slider' },
  { id: 'precalculo-division-sintetica-match-graphs-0', type: 'MatchGraphExercise', name: 'match-graphs' }
];

fs.mkdirSync('/opt/cursor/artifacts/screenshots', {recursive: true});

const results = [];

for (const test of testCases) {
  console.log(`\n🧪 Testing ${test.type} (${test.name})...`);
  try {
    await page.goto(`http://127.0.0.1:5176/?debugQ=${test.id}`);
    await page.waitForTimeout(3000);

    // Check if debug mode header shows
    const debugHeader = await page.locator('.session-count').textContent().catch(() => '');
    console.log(`  Debug header: ${debugHeader}`);

    // Take screenshot
    await page.screenshot({
      path: `/opt/cursor/artifacts/screenshots/interactive-${test.name}.png`,
      fullPage: false
    });

    // Try to interact (basic check that SOMETHING rendered)
    const bodyText = await page.locator('body').textContent();
    const hasDebugMode = bodyText.includes('DEBUG:') || bodyText.includes('🐞');
    const hasExercise = bodyText.length > 100; // Some content loaded
    
    if (hasDebugMode && hasExercise) {
      console.log(`✅ ${test.type} rendered in debug mode`);
      results.push({ type: test.type, status: 'PASS', note: 'Rendered in debug mode' });
    } else {
      console.log(`❌ ${test.type} did not render (debugMode: ${hasDebugMode}, hasExercise: ${hasExercise})`);
      results.push({ type: test.type, status: 'FAIL', note: `No debug mode or content` });
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
