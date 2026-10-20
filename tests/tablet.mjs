import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pdfFixture } from './pdfFixture.mjs';
const server = await createServer({server:{host:'127.0.0.1',port:5175,strictPort:true}});
await server.listen();
const browser = await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context = await browser.newContext({viewport:{width:1280,height:800},hasTouch:true,deviceScaleFactor:2});
const page = await context.newPage(), errors=[];
page.on('pageerror',e=>errors.push(e.message)); page.on('dialog',d=>d.accept());
fs.mkdirSync('tmp/qa',{recursive:true});
const nav = name => page.getByRole('navigation',{name:'Navegación principal',exact:true}).getByRole('button',{name,exact:true});
async function noOverflow(label) { assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label); }
try {
  await page.goto('http://127.0.0.1:5175/');
  await nav('Ajustes').click();
  await page.getByLabel('Modo oscuro').check();
  await noOverflow('dark settings');
  await page.getByLabel('Modo oscuro').uncheck();
  await page.getByLabel('Tamaño de letra').fill('1.3');
  for(const size of [{width:1280,height:800},{width:1024,height:768},{width:800,height:1280},{width:1440,height:900}]) {
    await page.setViewportSize(size);
    for(const tab of ['Aprender','Practicar','Biblioteca','Mi libro','Ajustes']) { await nav(tab).click(); await noOverflow(`${size.width} ${tab} large font`); }
  }
  await page.getByLabel('Tamaño de letra').fill('1'); await page.setViewportSize({width:1280,height:800});
  await nav('Mi libro').click();
  await page.locator('input[type=file]').setInputFiles(process.env.TEST_BOOK || pdfFixture());
  await page.getByText(/PDF guardado/).waitFor({timeout:30000});
  await page.waitForFunction(()=>{const c=document.querySelector('canvas');return c&&c.width>0;});
  await noOverflow('PDF tablet');
  await page.screenshot({path:'tmp/qa/tablet-landscape-workspace.png'});
  await page.setViewportSize({width:800,height:1280});
  await noOverflow('portrait PDF');
  await page.screenshot({path:'tmp/qa/tablet-portrait-workspace.png'});
  assert.deepEqual(errors,[],'tablet browser exceptions');
  console.log('Tablet QA passed: 4 sizes, large fonts, dark mode, PDF fit, no overflow.');
} catch(e) { console.log('Tablet diagnostic:',await page.locator('[role=status]').allTextContents()); await page.screenshot({path:'tmp/qa/tablet-failure.png',fullPage:true}); throw e; }
finally { await browser.close(); await server.close(); }
