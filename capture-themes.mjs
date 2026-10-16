import { chromium } from '@playwright/test';
import fs from 'node:fs';

const themes = [
  { id: 'duolingo', name: 'Duolingo' },
  { id: 'glassmorphism', name: 'Glassmorphism' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'neon', name: 'Neon' },
  { id: 'pastel', name: 'Pastel' }
];

fs.mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });

for (const theme of themes) {
  console.log(`\n=== Capturing ${theme.name} theme ===`);
  
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  
  console.log('Opening app...');
  await page.goto('http://localhost:5173');
  await page.getByRole('heading', { name: '¡Hola de nuevo!' }).waitFor();
  
  // Go to settings
  await page.locator('.mobile-nav button').filter({ hasText: 'Ajustes' }).click();
  await page.waitForTimeout(500);
  
  // Select theme
  console.log(`Setting theme to ${theme.id}...`);
  const themeSelector = page.locator('label:has-text("Tema visual") select');
  await themeSelector.selectOption(theme.id);
  await page.waitForTimeout(1000); // Wait for theme transition
  
  // Go to home
  await page.locator('.mobile-nav button').filter({ hasText: 'Inicio' }).click();
  await page.waitForTimeout(500);
  
  // Capture home
  console.log(`Capturing ${theme.id} home...`);
  await page.screenshot({ 
    path: `/opt/cursor/artifacts/screenshots/theme-${theme.id}-home.png`, 
    fullPage: true 
  });
  
  // Navigate to Aprender
  await page.locator('.mobile-nav button').filter({ hasText: 'Aprender' }).click();
  await page.waitForTimeout(500);
  
  // Click on first lesson
  await page.locator('button.journey-level').first().click();
  await page.waitForTimeout(500);
  
  // Start the lesson
  try {
    const skipButton = page.locator('button.lesson-story-skip');
    const startButton = page.getByRole('button', { name: /Empezar \d+ ejercicios/i });
    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click();
    } else if (await startButton.isVisible({ timeout: 2000 })) {
      await startButton.click();
    }
    
    await page.waitForTimeout(1000);
    
    // Capture practice screen
    console.log(`Capturing ${theme.id} practice...`);
    await page.screenshot({ 
      path: `/opt/cursor/artifacts/screenshots/theme-${theme.id}-practice.png`, 
      fullPage: true 
    });
  } catch (e) {
    console.log(`Warning: Could not capture practice for ${theme.id}: ${e.message}`);
  }
  
  console.log(`✓ ${theme.name} theme captured`);
  await browser.close();
}

console.log('\n✅ All theme screenshots captured!');
