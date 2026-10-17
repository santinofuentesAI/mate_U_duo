#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';

const artifactsDir = '/opt/cursor/artifacts/screenshots';

async function captureAllScreenshots() {
  await mkdir(artifactsDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log('📸 Capturing comprehensive screenshots for PR...\n');
    
    // 1. Home with daily goal
    console.log('1/6 📱 Home page with daily goal ring...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: `${artifactsDir}/01-home-daily-goal.png`,
      fullPage: false
    });

    // 2. Practice session - click to start
    console.log('2/6 ✏️  Practice session...');
    const practiceBtn = await page.locator('button').filter({ hasText: /Empezar práctica|Practicar más/ }).first();
    if (await practiceBtn.isVisible({ timeout: 2000 })) {
      await practiceBtn.click();
      await page.waitForTimeout(2000);
      
      // Skip story if present
      const storyBtn = await page.locator('button:has-text("Comenzar")');
      if (await storyBtn.isVisible({ timeout: 1000 })) {
        await storyBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.screenshot({ 
      path: `${artifactsDir}/02-practice-session.png`,
      fullPage: false
    });

    // 3. Correct feedback - try to answer
    console.log('3/6 ✅ Capturing feedback...');
    try {
      const choices = await page.locator('.choice-item').all();
      if (choices.length > 0) {
        await choices[0].click();
        await page.waitForTimeout(500);
        
        const submit = await page.locator('button[type="submit"]');
        if (await submit.isVisible({ timeout: 1000 })) {
          await submit.click();
          await page.waitForTimeout(1500);
          await page.screenshot({ 
            path: `${artifactsDir}/03-feedback.png`,
            fullPage: false
          });
        }
      }
    } catch (e) {
      console.log('   (Skipped - exercise not available)');
    }

    // 4. Achievements view
    console.log('4/6 🏆 Achievements page...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const achievementsBtn = await page.locator('.sidebar button').filter({ hasText: 'Logros' });
    await achievementsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/04-achievements-full.png`,
      fullPage: true
    });

    // 5. Mobile view - home
    console.log('5/6 📱 Mobile home view...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/05-mobile-home.png`,
      fullPage: false
    });

    // 6. Settings with sound toggle
    console.log('6/6 ⚙️  Settings page...');
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    const settingsBtn = await page.locator('.sidebar button').filter({ hasText: 'Ajustes' });
    await settingsBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ 
      path: `${artifactsDir}/06-settings.png`,
      fullPage: false
    });

    console.log('\n✅ All screenshots captured successfully!\n');
    console.log('Saved to /opt/cursor/artifacts/screenshots/:');
    console.log('  - 01-home-daily-goal.png');
    console.log('  - 02-practice-session.png');
    console.log('  - 03-feedback.png');
    console.log('  - 04-achievements-full.png');
    console.log('  - 05-mobile-home.png');
    console.log('  - 06-settings.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureAllScreenshots().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
