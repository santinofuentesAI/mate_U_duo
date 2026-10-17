import { chromium } from '@playwright/test';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

fs.mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });

console.log('Opening app...');
await page.goto('http://localhost:5173');
await page.getByRole('heading', { name: '¡Hola de nuevo!' }).waitFor();

// Capture home screen with Mateo mascot
console.log('Capturing home with Mateo...');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/01-mateo-home.png', fullPage: true });

// Navigate to Aprender tab
await page.locator('.mobile-nav button').filter({ hasText: 'Aprender' }).click();
await page.waitForTimeout(500);

// Click on first lesson
await page.locator('button.journey-level').first().click();
await page.waitForTimeout(500);

// Start the lesson (either skip story or start exercises)
const skipButton = page.locator('button.lesson-story-skip');
const startButton = page.getByRole('button', { name: /Empezar \d+ ejercicios/i });
if (await skipButton.isVisible({ timeout: 2000 })) {
  await skipButton.click();
} else if (await startButton.isVisible({ timeout: 2000 })) {
  await startButton.click();
}

await page.waitForTimeout(1000);

// Expand help section to show "Consultar tablas" button
console.log('Opening help section...');
await page.locator('details.exercise-help summary').click();
await page.waitForTimeout(300);

// Click on "Consultar tablas" button
console.log('Opening reference tables...');
await page.getByRole('button', { name: 'Consultar tablas' }).click();
await page.waitForTimeout(500);

// Capture the reference tables dialog
console.log('Capturing reference tables...');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/02-reference-tables-discreta.png', fullPage: true });

// Close the dialog
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// Go back to home
console.log('Going back to home...');
await page.locator('.session-header button').first().click(); // Exit button
await page.waitForTimeout(500);

// Confirm leaving if prompted
const confirmButton = page.getByRole('button', { name: /Pausar/i });
if (await confirmButton.isVisible({ timeout: 1000 })) {
  await confirmButton.click();
  await page.waitForTimeout(300);
}

// Change to Precálculo course
console.log('Switching to Precálculo...');
await page.getByRole('combobox', { name: 'Elegir curso' }).selectOption('precalculo');
await page.waitForTimeout(500);

// Navigate back to Aprender tab
await page.locator('.mobile-nav button').filter({ hasText: 'Aprender' }).click();
await page.waitForTimeout(500);

// Click on first lesson
await page.locator('button.journey-level').first().click();
await page.waitForTimeout(500);

// Start the lesson
if (await skipButton.isVisible({ timeout: 2000 })) {
  await skipButton.click();
} else if (await startButton.isVisible({ timeout: 2000 })) {
  await startButton.click();
}

await page.waitForTimeout(1000);

// Open help and reference tables again
await page.locator('details.exercise-help summary').click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Consultar tablas' }).click();
await page.waitForTimeout(500);

// Capture Precálculo reference tables
console.log('Capturing Precálculo reference tables...');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/03-reference-tables-precalculo.png', fullPage: true });

// Go back home to capture different mascot moods
console.log('Going home to test mascot moods...');
await page.keyboard.press('Escape');
await page.locator('.mobile-nav button').filter({ hasText: 'Inicio' }).click();
await page.waitForTimeout(500);

// Capture home again (might show different mood based on streak)
console.log('Capturing home again...');
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/04-mateo-home-final.png', fullPage: true });

console.log('All screenshots captured!');
await browser.close();
