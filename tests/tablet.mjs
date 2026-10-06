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
    for(const tab of ['Aprender','Practicar','Biblioteca','Cuaderno','Mi avance','Ajustes']) { await nav(tab).click(); await noOverflow(`${size.width} ${tab} large font`); }
  }
  await page.getByLabel('Tamaño de letra').fill('1'); await page.setViewportSize({width:1280,height:800});
  await nav('Cuaderno').click();
  const input=page.getByRole('textbox',{name:'Siguiente paso'}),editor=input.locator('xpath=../..');
  await input.fill('PQ'); await input.evaluate(el=>{el.focus();el.setSelectionRange(1,1);});
  await editor.getByRole('button',{name:'Conjunción',exact:true}).tap(); assert.equal(await input.inputValue(),'P∧Q');
  await input.evaluate(el=>{el.focus();el.setSelectionRange(1,2);}); await editor.getByRole('button',{name:'Disyunción',exact:true}).tap(); assert.equal(await input.inputValue(),'P∨Q');
  await input.evaluate(el=>{el.focus();el.setSelectionRange(1,2);}); await editor.getByRole('button',{name:'Borrar símbolo',exact:true}).tap();
  await editor.getByRole('button',{name:'Implicación',exact:true}).tap(); assert.equal(await input.inputValue(),'P→Q','selected deletion keeps caret');
  await editor.getByRole('button',{name:'Limpiar',exact:true}).tap(); await editor.getByRole('button',{name:'Negación',exact:true}).tap(); await editor.getByRole('button',{name:'P',exact:true}).tap(); assert.equal(await input.inputValue(),'¬P');
  await input.fill('¬P∨¬Q'); await page.getByRole('button',{name:'Comprobar paso',exact:true}).tap(); await page.getByText('Paso verificado.',{exact:true}).waitFor();
  await nav('Mi libro').click();
  {
    await rendered();assert.equal(await page.getByRole('spinbutton',{name:'Página PDF'}).inputValue(),'1','legacy PDF survives upgrade and page clamps to document length');
    await page.locator('input[type=file]').setInputFiles(process.env.TEST_BOOK || pdfFixture()); await page.getByText(/Libro guardado en este dispositivo/).waitFor({timeout:30000});
    await page.getByRole('spinbutton',{name:'Página PDF'}).fill(process.env.TEST_BOOK?'59':'1'); await rendered();
    const initial=await page.locator('canvas').evaluate(el=>({width:el.getBoundingClientRect().width,parent:el.closest('.pdf-canvas').clientWidth})); assert.ok(Math.abs(initial.width-initial.parent)<2,'PDF fits tablet column');
    await page.setViewportSize({width:800,height:1280}); await rendered(); await page.waitForFunction(()=>{const c=document.querySelector('canvas');return Math.abs(c.getBoundingClientRect().width-c.closest('.pdf-canvas').clientWidth)<2;}); await noOverflow('portrait PDF');
    await page.setViewportSize({width:1280,height:800}); await rendered(); await page.waitForFunction(()=>{const c=document.querySelector('canvas');return Math.abs(c.getBoundingClientRect().width-c.closest('.pdf-canvas').clientWidth)<2;});
    await page.getByRole('button',{name:'Recortar ejercicio',exact:true}).tap(); await page.getByLabel('Nombre del recorte').fill('Leyes · ejercicio real');
    // Dispatch an actual touch sequence, not a mouse-only drag.
    await page.locator('.crop-overlay').scrollIntoViewIfNeeded(); const b=await page.locator('.crop-overlay').boundingBox();
    const cdp=await context.newCDPSession(page);
    const start={x:Math.round(b.x+b.width*.10),y:Math.round(Math.max(50,b.y)+80)};
    const end={x:Math.round(b.x+b.width*.90),y:Math.round(start.y+180)};
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[end]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    assert.ok(await page.locator('.crop-selection').count(),'touch drag selection');
    await page.waitForFunction(()=>{const r=document.querySelector('.crop-selection')?.getBoundingClientRect();return r&&r.width>20&&r.height>20;});
    await page.getByRole('button',{name:'Guardar recorte',exact:true}).tap(); await page.getByText('Recorte guardado. Ya lo tenés junto al cuaderno.',{exact:true}).waitFor();
    await page.locator('.book-workspace').scrollIntoViewIfNeeded();
    const clip=await page.locator('.pinned-clip').boundingBox(),work=await page.locator('.book-working').boundingBox(); assert.ok(clip.x+clip.width<work.x+2,'exercise beside keyboard in landscape');
    assert.ok(await page.locator('.pinned-clip img').evaluate(img=>img.complete&&img.naturalWidth>100),'original exercise crop renders');
    await noOverflow('landscape cropped workspace'); await page.screenshot({path:'tmp/qa/tablet-landscape-workspace.png'});
    await page.getByRole('button',{name:'Demostraciones',exact:true}).tap(); await page.getByRole('heading',{name:'De las premisas a la conclusión.'}).waitFor();
    await page.reload(); await nav('Mi libro').click(); await page.getByRole('heading',{name:'Leyes · ejercicio real',exact:true}).waitFor(); await rendered();
    await page.setViewportSize({width:1024,height:768}); await page.locator('.book-workspace').scrollIntoViewIfNeeded(); await noOverflow('1024 cropped workspace'); await page.screenshot({path:'tmp/qa/tablet-1024-workspace.png'});
    await page.setViewportSize({width:800,height:1280}); await page.locator('.book-workspace').scrollIntoViewIfNeeded(); await noOverflow('portrait crop'); await page.screenshot({path:'tmp/qa/tablet-portrait-workspace.png'});
    await page.setViewportSize({width:1280,height:800}); await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo'); assert.equal(await page.locator('.pinned-clip').count(),0,'course clips separated');
    await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('discreta'); await page.getByRole('heading',{name:'Leyes · ejercicio real',exact:true}).waitFor();
    await page.getByRole('button',{name:'Borrar recorte Leyes · ejercicio real',exact:true}).tap();await page.getByRole('dialog',{name:'¿Borrar este recorte?'}).getByRole('button',{name:'Borrar recorte'}).click(); await page.waitForFunction(()=>!document.querySelector('.pinned-clip'));
  }
  assert.deepEqual(errors,[],'tablet browser exceptions');
  console.log('Tablet QA passed: 4 sizes, large fonts, 4 palettes, dark mode, touch symbols/caret, PDF rotation, touch crop, side-by-side work, persistence, course separation and delete.');
} catch(e) { console.log('Tablet diagnostic:',await page.locator('[role=status]').allTextContents()); await page.screenshot({path:'tmp/qa/tablet-failure.png',fullPage:true}); throw e; }
finally { await browser.close(); await server.close(); }
