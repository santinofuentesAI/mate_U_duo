import { chromium } from '@playwright/test';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

fs.mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });

console.log('Opening app...');
await page.goto('http://localhost:5173');
await page.getByRole('heading', { name: '¡Hola de nuevo!' }).waitFor();

// Start daily practice
console.log('Starting daily practice...');
await page.getByRole('button', { name: /Empezar práctica diaria/i }).click();
await page.waitForTimeout(1000);

// Answer the first exercise quickly (just click any choice)
try {
  // Try to find and click the first choice button
  const choices = page.locator('.choices button');
  if (await choices.first().isVisible({ timeout: 2000 })) {
    await choices.first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Comprobar' }).click();
    await page.waitForTimeout(1000);
  }
} catch (e) {
  console.log('Could not complete exercise automatically');
}

// Take a screenshot of the celebration (if we got there)
console.log('Capturing celebration screen...');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/04-mateo-celebration.png', fullPage: true });

console.log('Done!');
await browser.close();
