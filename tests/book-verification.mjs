import { chromium } from '@playwright/test';
import { preview } from 'vite';
import assert from 'node:assert/strict';

const server = await preview({ preview: { host: '127.0.0.1', port: 5184, strictPort: true } });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage(); const errors = [];
page.on('pageerror', e => errors.push(e.message));
const button = name => page.getByRole('button', { name, exact: true });
async function select(id) { await page.getByLabel('Semana de Book Exam').selectOption('all'); await page.getByLabel('Problema de Book Exam').selectOption(id); }

try {
  await page.goto('http://127.0.0.1:5184/');
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Practicar' }).click();
  await page.getByRole('button', { name: /Ejercicios del libro/ }).click();
  await page.getByRole('combobox', { name: 'Elegir curso' }).selectOption('precalculo');
  await select('precalculo-18-1b');
  const final = page.getByRole('textbox', { name: 'Verdadero o falso' });
  await final.fill('V'); await button('Comprobar respuesta').click();
  await page.getByText('Todavía no coincide').waitFor();
  assert.equal(await page.locator('.response-state.validated').count(), 0);
  await final.fill('F'); await button('Comprobar respuesta').click();
  await page.getByText('Resultado final correcto · pasos sin revisar').waitFor();
  await page.reload(); await page.getByText('Resultado final correcto · pasos sin revisar').waitFor();
  await final.fill('V');
  assert.equal(await page.locator('.response-state.validated').count(), 0);
  await button('Comprobar respuesta').click(); await page.getByText('Todavía no coincide').waitFor();
  await select('precalculo-42-1e');
  const algebra = page.getByRole('textbox', { name: 'Respuesta final' });
  await algebra.fill('8-y^3'); await button('Comprobar respuesta').click();
  await page.getByText('Todavía no coincide').waitFor();
  await algebra.fill('(2-y)(y^2+2y+4)'); await button('Comprobar respuesta').click();
  await page.getByText('Resultado final correcto · pasos sin revisar').waitFor();
  await select('precalculo-18-3a');
  assert.equal(await button('Comprobar respuesta').count(), 0);
  await page.getByText(/aún no tiene una solución comprobada/).waitFor();
  await page.getByRole('combobox', { name: 'Elegir curso' }).selectOption('discreta');
  await select('discreta-55-2c');
  await page.getByRole('textbox', { name: 'Respuesta final' }).fill('Contingencia');
  await page.getByRole('textbox', { name: 'Columna final de la tabla' }).fill('V,V,V,V');
  await button('Comprobar respuesta').click();
  assert.equal(await page.locator('.response-state.validated').count(), 0);
  await page.getByRole('textbox', { name: 'Columna final de la tabla' }).fill('V,V,F,V');
  await button('Comprobar respuesta').click();
  await page.getByText('Resultado final correcto · pasos sin revisar').waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  await page.setViewportSize({ width: 1024, height: 768 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  assert.deepEqual(errors, []);
  console.log('PASS: Book Exam verifies correct/incorrect final answers, invalidates edits, persists checks, requires all truth-table parts, and remains usable on phone/tablet.');
} finally { await browser.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
