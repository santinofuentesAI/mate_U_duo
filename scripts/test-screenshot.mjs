import { chromium } from 'playwright';

async function manualCapture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  console.log('Page loaded. Waiting for content...');
  await page.waitForTimeout(3000);
  
  // Take a screenshot of home to confirm it works
  await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/test-home.png', fullPage: true });
  console.log('✓ Home screenshot saved');
  
  // Try to start a practice session
  try {
    const startBtn = page.locator('button').filter({ hasText: /Empezar|Practicar/ }).first();
    await startBtn.click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/test-exercise.png', fullPage: true });
    console.log('✓ Exercise screenshot saved');
    
    // Get page content to debug
    const content = await page.content();
    console.log('\nPage title:', await page.title());
    console.log('Interactive classes found:', content.match(/class="[^"]*(?:proof-builder|interactive-truth-table|order-steps|card-sort|venn-exercise|graph-slider|match-graph)[^"]*"/g) || 'None');
    
  } catch (e) {
    console.log('Error during interaction:', e.message);
  }
  
  await browser.close();
}

manualCapture().catch(console.error);
