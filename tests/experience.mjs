import { chromium } from '@playwright/test';
import { skipIntro } from './seenIntro.mjs';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const server=await createServer({server:{host:'127.0.0.1',port:5176,strictPort:true}});
await server.listen();
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR:',e.message);});page.on('dialog',d=>d.accept());
fs.mkdirSync('tmp/qa',{recursive:true});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>{const mobile=page.getByRole('navigation',{name:'Navegación móvil',exact:true});await (await mobile.isVisible()?mobile:page.getByRole('navigation',{name:'Navegación principal',exact:true})).getByRole('button',{name,exact:true}).click();};
const noOverflow=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,label);
try {
  await skipIntro(context);await page.goto('http://127.0.0.1:5176/');await page.getByRole('heading',{name:'Aprender'}).waitFor();
  const route=page.locator('.learning-route');assert.ok(await route.locator('.journey-level').count()>6,'lesson path is visible');
  await page.getByRole('button',{name:/Nivel \d+: Equivalencias y simplificación/}).click();
  await page.getByRole('button',{name:/Ir a los \d+ ejercicios/}).click();
  await page.getByText('Necesito ayuda').click();await button('Ver leyes').click();await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  await button('P').click();await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();
  await page.screenshot({path:'tmp/qa/resumed-answer.png',fullPage:true});
  await button('Continuar').click();
  await button('Salir de la lección').click();
  await page.getByRole('heading',{name:'Aprender'}).waitFor();
  await nav('Biblioteca');await page.getByRole('button',{name:/Abrir explorador/}).click();
  await page.locator('.logic-output b').waitFor();assert.equal(await page.locator('.logic-output b').textContent(),'F');
  await button('Cambiar Q').tap();assert.equal(await page.locator('.logic-output b').textContent(),'V');assert.equal(await page.locator('.current-truth-row').count(),1);
  await button('Explorar De Morgan').click();assert.equal(await page.locator('.logic-output b').textContent(),'F');
  await page.locator('.custom-expression summary').click();await page.getByRole('textbox',{name:'Expresión para explorar'}).fill('P∧');assert.equal(await page.locator('.logic-output b').textContent(),'?');
  await button('Explorar Implicación').click();await noOverflow('logic mobile');
  await button('Conjuntos en vivo').click();await button('A ∩ B').click();assert.equal(await page.locator('.set-result b').textContent(),'{3}');
  await button('A contiene 3').tap();assert.equal(await page.locator('.set-result b').textContent(),'{∅}');await button('Aᶜ').click();assert.equal(await page.locator('.set-result b').textContent(),'{3, 4, 5, 6}');
  await page.getByRole('radio',{name:'Precálculo',exact:true}).click();await page.getByRole('button',{name:/Abrir explorador/}).click();await page.locator('.equation-solution').waitFor();
  assert.equal(await page.locator('.root-chips').textContent(),'x = -1x = 3');await button('Una raíz').click();assert.equal(await page.locator('.root-chips').textContent(),'x = 2');
  await button('Sin raíces').click();await page.getByRole('heading',{name:'No hay soluciones reales',exact:true}).waitFor();
  await page.getByRole('slider',{name:'Coeficiente a'}).fill('0');await page.getByRole('slider',{name:'Coeficiente b'}).fill('0');await page.getByRole('slider',{name:'Coeficiente c'}).fill('0');await page.getByRole('heading',{name:'Infinitas soluciones reales',exact:true}).waitFor();
  await page.getByRole('checkbox',{name:'Mostrar raíces y solución'}).uncheck();assert.equal(await page.locator('.equation-solution').count(),0);await button('Dos raíces').click();await page.getByRole('checkbox',{name:'Mostrar raíces y solución'}).check();await noOverflow('equation mobile');
  await page.screenshot({path:'tmp/qa/mobile-explorer.png',fullPage:true});
  for(const size of [{width:800,height:1280},{width:1024,height:768},{width:1280,height:800}]) {
    await page.setViewportSize(size);await nav('Ajustes');await page.getByLabel('Modo oscuro').check();await page.getByLabel('Tamaño de letra').fill('1.3');
    await nav('Biblioteca');await page.getByRole('button',{name:/Abrir explorador/}).click();await page.locator('.equation-graph').waitFor();await noOverflow(`equation ${size.width}`);
    await page.screenshot({path:`tmp/qa/explorer-${size.width}.png`,fullPage:true});
    await nav('Aprender');assert.ok((await page.locator('.journey-level').count())>3);await noOverflow(`levels ${size.width}`);
  }
  assert.deepEqual(errors,[],'uncaught browser exceptions');
  console.log('Experience QA passed: lesson path, tactile logic, leave without pause, live logic/sets/equations, responsive tablet and large type.');
} catch(e) {await page.screenshot({path:'tmp/qa/experience-failure.png',fullPage:true});throw e;} finally {await browser.close();await server.close();}
