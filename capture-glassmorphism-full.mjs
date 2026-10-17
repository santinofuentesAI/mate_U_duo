import { chromium } from '@playwright/test';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

fs.mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });

console.log('Opening app for Glassmorphism comprehensive screenshots...');
await page.goto('http://localhost:5173');
await page.getByRole('heading', { name: '¡Hola de nuevo!' }).waitFor();

// Go to settings
await page.locator('.mobile-nav button').filter({ hasText: 'Ajustes' }).click();
await page.waitForTimeout(500);

// Select Glassmorphism theme
console.log('Setting theme to glassmorphism...');
const themeSelector = page.locator('label:has-text("Tema visual") select');
await themeSelector.selectOption('glassmorphism');
await page.waitForTimeout(1000);

// 1. Capture settings page itself
console.log('Capturing glassmorphism settings...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-settings.png', 
  fullPage: true 
});

// 2. Go to home
await page.locator('.mobile-nav button').filter({ hasText: 'Inicio' }).click();
await page.waitForTimeout(500);

console.log('Capturing glassmorphism home...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-home.png', 
  fullPage: true 
});

// 3. Navigate to Aprender (learning path)
await page.locator('.mobile-nav button').filter({ hasText: 'Aprender' }).click();
await page.waitForTimeout(500);

console.log('Capturing glassmorphism learning path...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-path.png', 
  fullPage: true 
});

// 4. Click on first lesson and start practice
await page.locator('button.journey-level').first().click();
await page.waitForTimeout(500);

const skipButton = page.locator('button.lesson-story-skip');
const startButton = page.getByRole('button', { name: /Empezar \d+ ejercicios/i });
if (await skipButton.isVisible({ timeout: 2000 })) {
  await skipButton.click();
} else if (await startButton.isVisible({ timeout: 2000 })) {
  await startButton.click();
}

await page.waitForTimeout(1000);

console.log('Capturing glassmorphism practice...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-practice.png', 
  fullPage: true 
});

// 5. Open reference tables
try {
  await page.locator('details.exercise-help summary').click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Consultar tablas' }).click();
  await page.waitForTimeout(500);
  
  console.log('Capturing glassmorphism reference tables...');
  await page.screenshot({ 
    path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-tables.png', 
    fullPage: true 
  });
  
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
} catch (e) {
  console.log('Could not capture reference tables');
}

// 6. Go to Biblioteca (library)
await page.locator('.session-header button').first().click();
await page.waitForTimeout(300);
const confirmButton = page.getByRole('button', { name: /Pausar/i });
if (await confirmButton.isVisible({ timeout: 1000 })) {
  await confirmButton.click();
  await page.waitForTimeout(300);
}

await page.locator('.mobile-nav button').filter({ hasText: 'Biblioteca' }).click();
await page.waitForTimeout(500);

console.log('Capturing glassmorphism library...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-library.png', 
  fullPage: true 
});

// 7. Go to Mi libro (weekly PDFs)
await page.locator('.mobile-nav button').filter({ hasText: 'Mi libro' }).click();
await page.waitForTimeout(500);

console.log('Capturing glassmorphism Mi libro...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-books.png', 
  fullPage: true 
});

// 8. Go to Logros (achievements)
await page.locator('.mobile-nav button').filter({ hasText: 'Logros' }).click();
await page.waitForTimeout(500);

console.log('Capturing glassmorphism achievements...');
await page.screenshot({ 
  path: '/opt/cursor/artifacts/screenshots/theme-glassmorphism-achievements.png', 
  fullPage: true 
});

console.log('\n✅ All comprehensive Glassmorphism screenshots captured!');
await browser.close();
