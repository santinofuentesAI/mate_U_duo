import { chromium } from 'playwright';

async function captureOne(lessonTitle, expectedType, filename) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2500);

  try {
    // Click "Explorar lecciones" disclosure
    const disclosure = await page.locator('summary:has-text("Explorar lecciones")').first();
    await disclosure.click();
    await page.waitForTimeout(1000);

    // Find and click the specific lesson
    const lessonButton = await page.locator(`button:has-text("${lessonTitle}")`).first();
    await lessonButton.click();
    await page.waitForTimeout(2000);

    // Navigate through exercises to find the interactive type
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1500);
      
      // Check if we found the interactive type
      const hasType = await page.locator(`.${expectedType}`).count() > 0;
      
      if (hasType) {
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: `/opt/cursor/artifacts/screenshots/${filename}`,
          fullPage: true 
        });
        console.log(`✓ Captured ${filename} from "${lessonTitle}"`);
        await browser.close();
        return true;
      }
      
      // Try to skip to next
      const continueBtn = await page.locator('button:has-text("Continuar")').first();
      if (await continueBtn.isVisible({ timeout: 500 })) {
        await continueBtn.click();
        await page.waitForTimeout(500);
      }
    }
    
    console.log(`⚠ Did not find ${expectedType} in "${lessonTitle}"`);
  } catch (error) {
    console.log(`⚠ Error: ${error.message}`);
  }
  
  await browser.close();
  return false;
}

async function captureAll() {
  console.log('Capturing interactive exercise screenshots...\n');
  
  await captureOne('Reglas de inferencia', 'proof-builder', 'interactive-01-proofbuilder.png');
  await captureOne('Tablas de verdad', 'interactive-truth-table', 'interactive-02-truth-table.png');
  await captureOne('Demostraciones y falacias', 'order-steps-exercise', 'interactive-03-order-steps.png');
  await captureOne('Equivalencias y simplificación', 'card-sort-exercise', 'interactive-04-card-sort.png');
  await captureOne('Venn y leyes de conjuntos', 'interactive-venn-exercise', 'interactive-05-venn.png');
  await captureOne('Raíces racionales y factores', 'function-graph-slider', 'interactive-06-graph-slider.png');
  await captureOne('División sintética', 'match-graph-exercise', 'interactive-07-match-graphs.png');
  
  console.log('\n✅ Screenshot capture complete');
}

captureAll().catch(console.error);
