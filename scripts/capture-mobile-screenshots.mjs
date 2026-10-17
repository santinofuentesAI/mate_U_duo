import { chromium } from 'playwright';

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);

  // Home dashboard with new FSRS and mastery cards
  await page.screenshot({ 
    path: '/opt/cursor/artifacts/screenshots/01-home-dashboard-fsrs-mastery.png',
    fullPage: true 
  });
  console.log('✓ 01: Home dashboard with FSRS & mastery badges');

  // Start a lesson to see exercise view
  const startButton = await page.locator('button:has-text("Empezar")').first();
  if (await startButton.isVisible()) {
    await startButton.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: '/opt/cursor/artifacts/screenshots/02-exercise-in-session.png',
      fullPage: true 
    });
    console.log('✓ 02: Exercise view in session');
  }

  // Navigate to practice hub
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1500);
  
  const navButtons = await page.locator('nav button').all();
  if (navButtons.length >= 2) {
    await navButtons[1].click();
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: '/opt/cursor/artifacts/screenshots/03-practice-hub.png',
      fullPage: true 
    });
    console.log('✓ 03: Practice hub');
  }

  // Library
  if (navButtons.length >= 3) {
    await navButtons[2].click();
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: '/opt/cursor/artifacts/screenshots/04-library-books.png',
      fullPage: true 
    });
    console.log('✓ 04: Library');
  }

  // Profile with settings
  if (navButtons.length >= 4) {
    await navButtons[3].click();
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: '/opt/cursor/artifacts/screenshots/05-profile-settings.png',
      fullPage: true 
    });
    console.log('✓ 05: Profile with settings');
  }

  await browser.close();
  console.log('\n✅ All mobile screenshots captured (390px viewport)');
}

captureScreenshots().catch(console.error);
