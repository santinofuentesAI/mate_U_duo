#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../screenshots');

async function captureScreenshots() {
  await mkdir(screenshotsDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log('📸 Starting screenshot capture...');
    
    // 1. Home with daily goal
    console.log('1️⃣ Capturing home page with daily goal...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: join(screenshotsDir, '01-home-daily-goal.png'),
      fullPage: false
    });

    // 2. Start daily practice
    console.log('2️⃣ Starting daily practice session...');
    const practiceButton = await page.locator('button').filter({ hasText: /Empezar práctica|Practicar más/ }).first();
    await practiceButton.click();
    await page.waitForTimeout(2000);
    
    // Check if we're in a lesson story first
    const storyStart = await page.locator('button:has-text("Comenzar")');
    if (await storyStart.isVisible()) {
      await storyStart.click();
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ 
      path: join(screenshotsDir, '02-practice-session.png'),
      fullPage: false
    });

    // 3. Try to answer correctly - look for any clickable choice
    console.log('3️⃣ Attempting to capture correct feedback...');
    try {
      const choices = await page.locator('.choice-item').all();
      if (choices.length > 0) {
        // Click first choice
        await choices[0].click();
        await page.waitForTimeout(500);
        
        const submitBtn = await page.locator('button[type="submit"]');
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1500);
          
          // Check if feedback is shown
          const feedback = await page.locator('.feedback');
          if (await feedback.isVisible()) {
            await page.screenshot({ 
              path: join(screenshotsDir, '03-feedback.png'),
              fullPage: false
            });
            console.log('   ✓ Feedback captured');
          }
        }
      }
    } catch (e) {
      console.log('   ⚠ Could not capture feedback:', e.message);
    }

    // 5. Navigate to achievements
    console.log('4️⃣ Capturing achievements view...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const achievementsNav = await page.locator('.sidebar button').filter({ hasText: 'Logros' });
    await achievementsNav.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: join(screenshotsDir, '04-achievements.png'),
      fullPage: true
    });

    // 6. Try to capture celebration if available
    console.log('5️⃣ Looking for celebration screen...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);
    
    const celebrationModal = await page.locator('.celebration-modal');
    if (await celebrationModal.isVisible()) {
      await page.screenshot({ 
        path: join(screenshotsDir, '05-celebration.png'),
        fullPage: false
      });
      console.log('   ✓ Celebration captured');
    } else {
      console.log('   ℹ️ No celebration modal visible (appears after completing daily goal)');
    }

    console.log('\n✅ Screenshots captured successfully!\n');
    console.log('Files created in screenshots/:');
    console.log('  - 01-home-daily-goal.png');
    console.log('  - 02-practice-session.png');
    console.log('  - 03-feedback.png (if exercise was available)');
    console.log('  - 04-achievements.png');
    console.log('  - 05-celebration.png (if daily goal was completed)');

  } catch (error) {
    console.error('\n❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
