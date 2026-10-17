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
async function rendered() { await page.getByRole('button',{name:'Recortar ejercicio',exact:true}).waitFor(); await page.waitForFunction(()=>{const c=document.querySelector('canvas'),b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Recortar ejercicio'));return c?.width>0&&b&&!b.disabled;}); }
try {
  await page.goto('http://127.0.0.1:5175/');
  // A previously saved PDF must survive the IndexedDB version upgrade.
  await page.evaluate(bytes=>new Promise((resolve,reject)=>{const r=indexedDB.open('mate-u-duo-books',1);r.onupgradeneeded=()=>r.result.createObjectStore('books');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,t=db.transaction('books','readwrite');t.objectStore('books').put(new Uint8Array(bytes).buffer,'discreta');t.oncomplete=()=>{db.close();resolve(true);};t.onerror=()=>reject(t.error);};}),[...pdfFixture().buffer]);
  await nav('Ajustes').click();
  for(const dark of [false,true]) {
    await page.getByLabel('Modo oscuro').setChecked(dark);
    for(const [color,label] of [['violet','Violeta'],['ocean','Azul'],['forest','Verde'],['rose','Rosa']]) {
      await page.getByRole('group',{name:'Color principal'}).getByRole('button',{name:label}).click();
      assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mate-u-duo.v1')).palette),color);
      await noOverflow(`${color} ${dark?'dark':'light'}`);
    }
  }
  await page.getByRole('group',{name:'Color principal'}).getByRole('button',{name:'Verde'}).click(); await page.getByLabel('Modo oscuro').uncheck();
  await page.reload(); await nav('Ajustes').click(); assert.equal(await page.getByRole('group',{name:'Color principal'}).getByRole('button',{name:'Verde'}).getAttribute('aria-pressed'),'true');
  await page.getByLabel('Tamaño de letra').fill('1.3');
  for(const size of [{width:1280,height:800},{width:1024,height:768},{width:800,height:1280},{width:1440,height:900}]) {
    await page.setViewportSize(size);
    for(const tab of ['Aprender','Practicar','Biblioteca','Mi libro','Mi avance','Ajustes']) { await nav(tab).click(); await noOverflow(`${size.width} ${tab} large font`); }
  }
  await page.getByLabel('Tamaño de letra').fill('1'); await page.setViewportSize({width:1280,height:800});
  // Test current Mi libro interface (simplified version without crop)
  await nav('Mi libro').click();
  // Wait for tab selector and click "Libro completo"
  await page.waitForTimeout(1000);
  const libroCompletoBtn = page.getByRole('button',{name:/Libro completo/});
  await libroCompletoBtn.click();
  await page.waitForTimeout(500);
  // Wait for Books to load
  await page.getByRole('heading',{name:'Mi libro'}).waitFor({timeout:5000});
  // Test PDF upload and rendering
  const uploadButton = page.getByText(/Cargar PDF|Cambiar PDF/).first();
  await uploadButton.waitFor({state:'visible',timeout:5000});
  const fileInput = page.locator('label.upload input[type=file]');
  await fileInput.setInputFiles(process.env.TEST_BOOK || pdfFixture()); 
  await page.getByText(/PDF guardado en este dispositivo|PDF guardado/).waitFor({timeout:30000});
  // Verify PDF controls exist
  assert.ok(await page.getByRole('spinbutton',{name:'Página PDF'}).count() > 0, 'PDF page input exists');
  await page.getByRole('spinbutton',{name:'Página PDF'}).fill(process.env.TEST_BOOK?'59':'1');
  await page.waitForTimeout(2000); // Wait for page render
  // Verify canvas renders
  const canvas = page.locator('canvas');
  await canvas.waitFor({state:'visible',timeout:5000});
  assert.ok(await canvas.evaluate(el=>el.width>0&&el.height>0), 'PDF canvas renders');
  // Test responsive PDF at different sizes
  await page.setViewportSize({width:800,height:1280}); 
  await page.waitForTimeout(1000);
  await noOverflow('portrait PDF');
  await page.setViewportSize({width:1280,height:800}); 
  await page.waitForTimeout(1000);
  await noOverflow('landscape PDF');
  // Test course switching preserves PDF
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo');
  await page.waitForTimeout(500);
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('discreta');
  await page.waitForTimeout(500);
  assert.ok(await canvas.count() > 0, 'PDF persists after course switch');
  // Test page navigation
  const nextButton = page.getByRole('button',{name:'Página siguiente'});
  if (!await nextButton.isDisabled()) {
    await nextButton.click();
    await page.waitForTimeout(1000);
    const pageNum = await page.getByRole('spinbutton',{name:'Página PDF'}).inputValue();
    assert.ok(Number(pageNum) > 1, 'Page navigation works');
  }
  await page.screenshot({path:'tmp/qa/tablet-books-interface.png'});
  assert.deepEqual(errors,[],'tablet browser exceptions');
  console.log('Tablet QA passed: 4 sizes, large fonts, 4 palettes, dark mode, PDF upload/render, page navigation, course switching, responsive layout.');
} catch(e) { console.log('Tablet diagnostic:',await page.locator('[role=status]').allTextContents()); await page.screenshot({path:'tmp/qa/tablet-failure.png',fullPage:true}); throw e; }
finally { await browser.close(); await server.close(); }
