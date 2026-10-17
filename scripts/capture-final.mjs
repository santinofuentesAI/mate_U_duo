#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';

const artifactsDir = '/opt/cursor/artifacts/screenshots';

async function captureUpdatedScreenshots() {
  await mkdir(artifactsDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log('📸 Capturing updated screenshots with 10+ exercise daily practice...\n');
    
    // Clear localStorage to get fresh state
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    
    // 1. Home with daily goal (fresh state)
    console.log('1/5 📱 Fresh home page with daily goal...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await page.screenshot({ 
      path: `${artifactsDir}/01-home-daily-goal.png`,
      fullPage: false
    });

    // 2. Start daily practice - should have 10+ exercises
    console.log('2/5 ✏️  Daily practice session (10+ exercises)...');
    const practiceBtn = await page.locator('button').filter({ hasText: /Empezar práctica|Practicar más/ }).first();
    if (await practiceBtn.isVisible({ timeout: 2000 })) {
      await practiceBtn.click();
      await page.waitForTimeout(2000);
      
      // Skip story if present
      const storySkip = await page.locator('button.lesson-story-skip');
      if (await storySkip.isVisible({ timeout: 1000 })) {
        await storySkip.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.screenshot({ 
      path: `${artifactsDir}/02-practice-session.png`,
      fullPage: false
    });

    // 3. Answer correctly
    console.log('3/5 ✅ Correct feedback...');
    try {
      const choices = await page.locator('.choice-item').all();
      if (choices.length > 0) {
        // Try first choice
        await choices[0].click();
        await page.waitForTimeout(500);
        
        const submit = await page.locator('button[type="submit"]');
        if (await submit.isVisible({ timeout: 1000 })) {
          await submit.click();
          await page.waitForTimeout(1500);
          await page.screenshot({ 
            path: `${artifactsDir}/03-correct-feedback.png`,
            fullPage: false
          });
          
          // Move to next exercise
          const nextBtn = await page.locator('button:has-text("Siguiente")');
          if (await nextBtn.isVisible({ timeout: 1000 })) {
            await nextBtn.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    } catch (e) {
      console.log('   (Correct feedback capture skipped)');
    }

    // 4. Try to get incorrect feedback
    console.log('4/5 ❌ Incorrect feedback...');
    try {
      const choices = await page.locator('.choice-item').all();
      if (choices.length >= 3) {
        // Try the last choice (more likely to be wrong)
        await choices[choices.length - 1].click();
        await page.waitForTimeout(500);
        
        const submit = await page.locator('button[type="submit"]');
        if (await submit.isVisible({ timeout: 1000 })) {
          await submit.click();
          await page.waitForTimeout(1500);
          await page.screenshot({ 
            path: `${artifactsDir}/04-incorrect-feedback.png`,
            fullPage: false
          });
        }
      }
    } catch (e) {
      console.log('   (Incorrect feedback capture skipped)');
    }

    // 5. Achievements view
    console.log('5/5 🏆 Achievements page...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const achievementsBtn = await page.locator('.sidebar button').filter({ hasText: 'Logros' });
    await achievementsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/05-achievements.png`,
      fullPage: true
    });

    console.log('\n✅ All screenshots updated successfully!\n');
    console.log('Saved to /opt/cursor/artifacts/screenshots/');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureUpdatedScreenshots().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
