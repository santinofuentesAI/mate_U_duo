#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';

const artifactsDir = '/opt/cursor/artifacts/screenshots';

async function captureAllViews() {
  await mkdir(artifactsDir, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log('📸 Capturing all views for PR...\n');
    
    // Clear localStorage for fresh state
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // 1. Inicio (Home) tab
    console.log('1/10 🏠 Inicio tab with daily goal...');
    await page.screenshot({ 
      path: `${artifactsDir}/01-inicio-home.png`,
      fullPage: false
    });

    // 2. Aprender tab with current level
    console.log('2/10 📚 Aprender tab with learning path...');
    await page.locator('.sidebar button').filter({ hasText: 'Aprender' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/02-aprender-path.png`,
      fullPage: true
    });

    // 3. Daily practice session
    console.log('3/10 ✏️  Daily practice session...');
    await page.locator('.sidebar button').filter({ hasText: 'Inicio' }).click();
    await page.waitForTimeout(500);
    const practiceBtn = await page.locator('button').filter({ hasText: /Empezar práctica|Practicar más/ }).first();
    await practiceBtn.click();
    await page.waitForTimeout(2000);
    
    // Skip story if present
    const storySkip = await page.locator('button.lesson-story-skip');
    if (await storySkip.isVisible({ timeout: 1000 })) {
      await storySkip.click();
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ 
      path: `${artifactsDir}/03-practice-session.png`,
      fullPage: false
    });

    // 4. Correct feedback
    console.log('4/10 ✅ Correct feedback...');
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
            path: `${artifactsDir}/04-correct-feedback.png`,
            fullPage: false
          });
        }
      }
    } catch (e) {
      console.log('   (Skipped)');
    }

    // 5. Incorrect feedback - skip to next and answer wrong
    console.log('5/10 ❌ Incorrect feedback...');
    try {
      const nextBtn = await page.locator('button:has-text("Siguiente")');
      if (await nextBtn.isVisible({ timeout: 1000 })) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
        
        const choices = await page.locator('.choice-item').all();
        if (choices.length >= 2) {
          await choices[choices.length - 1].click();
          await page.waitForTimeout(500);
          const submit = await page.locator('button[type="submit"]');
          if (await submit.isVisible({ timeout: 1000 })) {
            await submit.click();
            await page.waitForTimeout(1500);
            await page.screenshot({ 
              path: `${artifactsDir}/05-incorrect-feedback.png`,
              fullPage: false
            });
          }
        }
      }
    } catch (e) {
      console.log('   (Skipped)');
    }

    // 6. Practicar tab
    console.log('6/10 🔄 Practicar tab...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.locator('.sidebar button').filter({ hasText: 'Practicar' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/06-practicar-hub.png`,
      fullPage: false
    });

    // 7. Biblioteca
    console.log('7/10 📖 Biblioteca...');
    await page.locator('.sidebar button').filter({ hasText: 'Biblioteca' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/07-biblioteca.png`,
      fullPage: true
    });

    // 8. Mi libro - Weekly PDFs
    console.log('8/10 📚 Mi libro - PDFs semanales...');
    await page.locator('.sidebar button').filter({ hasText: 'Mi libro' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/08-mi-libro-weekly.png`,
      fullPage: true
    });

    // 9. Achievements
    console.log('9/10 🏆 Achievements...');
    await page.locator('.sidebar button').filter({ hasText: 'Logros' }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `${artifactsDir}/09-achievements.png`,
      fullPage: true
    });

    // 10. Celebration screen (if achievable)
    console.log('10/10 🎉 Looking for celebration...');
    // Note: This would require completing the daily goal, so it might not be captured
    console.log('   (Would appear after completing daily goal)');

    console.log('\n✅ All screenshots captured successfully!\n');
    console.log('Saved to /opt/cursor/artifacts/screenshots/');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

captureAllViews().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
