#!/usr/bin/env tsx
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = '/opt/cursor/artifacts/screenshots';
const BASE_URL = 'http://localhost:5173';

async function captureGlassmorphismScreenshots() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log('Starting Glassmorphism theme screenshot capture...');
  
  const browser = await chromium.launch({ headless: true });
  
  // Mobile viewport
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 }
  });
  
  // Desktop viewport
  const desktopPage = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  
  try {
    // Mobile screenshots
    console.log('Navigating to mobile home...');
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    
    // Set Glassmorphism theme on mobile
    console.log('Setting Glassmorphism theme (mobile)...');
    await mobilePage.click('.mobile-nav button:has-text("Ajustes")');
    await mobilePage.waitForTimeout(500);
    
    const mobileThemeSelect = mobilePage.locator('label:has-text("Tema visual") select');
    await mobileThemeSelect.selectOption('glassmorphism');
    await mobilePage.waitForTimeout(800);
    
    // Back to home
    await mobilePage.click('.mobile-nav button:has-text("Inicio")');
    await mobilePage.waitForTimeout(800);
    
    console.log('Capturing mobile home (Glassmorphism)...');
    await mobilePage.screenshot({
      path: join(OUTPUT_DIR, 'theme-glassmorphism-home.png'),
      fullPage: true
    });
    
    // Navigate to practice/learning
    console.log('Capturing mobile practice (Glassmorphism)...');
    await mobilePage.click('.mobile-nav button:has-text("Aprender")');
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({
      path: join(OUTPUT_DIR, 'theme-glassmorphism-practice.png'),
      fullPage: true
    });
    
    // Desktop screenshots
    console.log('Navigating to desktop home...');
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    
    // Set Glassmorphism theme on desktop
    console.log('Setting Glassmorphism theme (desktop)...');
    await desktopPage.click('.sidebar button:has-text("Ajustes")');
    await desktopPage.waitForTimeout(500);
    
    const desktopThemeSelect = desktopPage.locator('label:has-text("Tema visual") select');
    await desktopThemeSelect.selectOption('glassmorphism');
    await desktopPage.waitForTimeout(800);
    
    // Back to home
    await desktopPage.click('.sidebar button:has-text("Inicio")');
    await desktopPage.waitForTimeout(800);
    
    console.log('Capturing desktop home (Glassmorphism)...');
    await desktopPage.screenshot({
      path: join(OUTPUT_DIR, 'theme-glassmorphism-home-desktop.png'),
      fullPage: true
    });
    
    // Navigate to practice/learning
    console.log('Capturing desktop practice (Glassmorphism)...');
    await desktopPage.click('.sidebar button:has-text("Aprender")');
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: join(OUTPUT_DIR, 'theme-glassmorphism-practice-desktop.png'),
      fullPage: true
    });
    
    console.log('\n✓ Screenshots saved to:', OUTPUT_DIR);
    console.log('  - theme-glassmorphism-home.png (mobile)');
    console.log('  - theme-glassmorphism-practice.png (mobile)');
    console.log('  - theme-glassmorphism-home-desktop.png (desktop)');
    console.log('  - theme-glassmorphism-practice-desktop.png (desktop)');
    
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureGlassmorphismScreenshots().catch(console.error);
