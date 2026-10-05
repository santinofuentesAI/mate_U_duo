import { chromium } from '@playwright/test';
import { preview } from 'vite';
import assert from 'node:assert/strict';
const server=await preview({preview:{host:'127.0.0.1',port:5174,strictPort:true}});
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));page.on('requestfailed',r=>console.log('REQUEST FAILED',r.url(),r.failure()?.errorText));
await page.goto('http://127.0.0.1:5174/');await page.getByRole('button',{name:'Continuar mi ruta'}).waitFor();
await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
assert.equal(await page.evaluate(()=>!!navigator.serviceWorker.controller),true);
await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Continuar mi ruta'}).waitFor();
await page.getByRole('navigation',{name:'Navegación móvil',exact:true}).getByRole('button',{name:'Mi libro',exact:true}).click();await page.getByText('El ejercicio real, en tu celular.').waitFor({timeout:10000});
if(process.env.TEST_BOOK){await page.locator('input[type=file]').setInputFiles(process.env.TEST_BOOK);await page.getByText(/Libro guardado en este dispositivo/).waitFor({timeout:30000});await page.waitForFunction(()=>{const c=document.querySelector('canvas');return c&&c.width>0;});}
await page.getByRole('navigation',{name:'Navegación móvil',exact:true}).getByRole('button',{name:'Biblioteca',exact:true}).click();await page.getByRole('textbox',{name:'Buscar en la biblioteca'}).fill('conectores');await page.locator('.library-topic').first().click();await page.getByRole('heading',{name:'Ejemplo resuelto',exact:true}).waitFor();assert.equal(await page.locator('.katex-error').count(),0);
await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));console.log('Offline QA passed: reload, lazy book viewer, local PDF render, library and math fonts.');
