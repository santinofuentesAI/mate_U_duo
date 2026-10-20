import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const server=await createServer({server:{host:'127.0.0.1',port:5182,strictPort:true}});
await server.listen();
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
fs.mkdirSync('tmp/qa',{recursive:true});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>{const mobile=page.getByRole('navigation',{name:'Navegación móvil',exact:true});await (await mobile.isVisible()?mobile:page.getByRole('navigation',{name:'Navegación principal',exact:true})).getByRole('button',{name,exact:true}).click();};
try {
  await page.goto('http://127.0.0.1:5182/');
  await nav('Practicar');
  await page.getByRole('heading',{name:'Practicar'}).waitFor();
  await page.getByRole('radio',{name:'Examen'}).waitFor();
  await button('Empezar').waitFor();
  await page.getByRole('button',{name:/Abrir explorador/}).click();
  await page.locator('.logic-output b').waitFor();
  await button('Tablas a mano').click();
  await page.getByRole('heading',{name:'Llená la columna, no la mires hecha.'}).waitFor();
  await page.getByRole('button',{name:'Fila 1: V'}).click();
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo');
  await page.getByRole('button',{name:/Abrir explorador/}).click();
  await page.locator('.equation-solution').waitFor();
  await button('División sintética').click();
  await page.getByRole('heading',{name:'División sintética de verdad.'}).waitFor();
  await page.getByRole('button',{name:'r = 1'}).first().click();
  await nav('Biblioteca');
  await page.getByRole('button',{name:'HTML'}).first().waitFor();
  await page.getByRole('button',{name:/Símbolos del curso/}).click();
  await page.getByRole('heading',{name:'Símbolos',exact:true}).waitFor();
  await page.getByRole('button',{name:'Volver',exact:true}).click();
  await page.getByRole('textbox',{name:'Buscar en la biblioteca'}).fill('cubos');
  await page.getByRole('button',{name:'Suma y diferencia de cubos'}).click();
  await page.getByRole('heading',{name:'Ejemplo paso a paso'}).waitFor();
  await page.getByText('LA IDEA',{exact:true}).waitFor();
  await nav('Practicar');
  await page.getByRole('button',{name:/Estudios de caso/}).click();
  await page.getByRole('heading',{name:'Estudios de caso'}).waitFor();
  await page.getByRole('checkbox',{name:'S4'}).waitFor();
  await page.screenshot({path:'tmp/qa/study-lab.png',fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[],'uncaught browser exceptions');
  console.log('Study lab passed: 20-a-day, truth tables, synthetic roots, week library, case studies.');
} catch(e) {
  await page.screenshot({path:'tmp/qa/study-lab-failure.png',fullPage:true});
  throw e;
} finally {
  await browser.close();
  await server.close();
}
