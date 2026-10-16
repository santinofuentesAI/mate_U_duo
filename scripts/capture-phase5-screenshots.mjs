import { chromium } from 'playwright';

async function captureInteractiveExercises() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  // Go to home
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2500);
  
  console.log('Capturing new Phase 5 screenshots...');

  // Capture home with FSRS and mastery (already done, but ensure it's good)
  await page.screenshot({ 
    path: '/opt/cursor/artifacts/screenshots/phase5b-home-fsrs-mastery.png',
    fullPage: true 
  });
  console.log('✓ Phase 5b: Home with FSRS reviews & mastery badges');

  // Try to click settings button (gear icon)
  try {
    await page.click('button[aria-label*="Configuración"]', { timeout: 3000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: '/opt/cursor/artifacts/screenshots/phase5a-settings-freeze-themes.png',
      fullPage: true 
    });
    console.log('✓ Phase 5a: Settings with streak freeze & themes');
    await page.click('button:has-text("Cerrar")');
  } catch (e) {
    console.log('⚠ Could not capture settings page');
  }

  await browser.close();
  console.log('\n✅ Phase 5 screenshots complete');
}

captureInteractiveExercises().catch(console.error);
