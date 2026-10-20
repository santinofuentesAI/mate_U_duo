import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true}});await server.listen();
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());fs.mkdirSync('tmp/qa',{recursive:true});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>{const mobile=page.getByRole('navigation',{name:'Navegación móvil',exact:true});await (await mobile.isVisible()?mobile:page.getByRole('navigation',{name:'Navegación principal',exact:true})).getByRole('button',{name,exact:true}).click();};
const noOverflow=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label);
async function openProblem(course,week,listing){
  await nav('Practicar');await page.getByRole('combobox',{name:'Elegir curso'}).selectOption(course);
  await page.getByRole('button',{name:/Elegir semana o número/}).click();
  await page.getByLabel('Semana de Book Exam').selectOption(week);
  await page.getByText('Elegir otro ejercicio').click();
  const select=page.getByLabel('Problema de Book Exam');
  const options=await select.locator('option').allTextContents();
  const match=options.find(text=>text.includes(listing));
  assert.ok(match,`missing book item ${listing} in ${options.slice(0,8).join(' | ')}`);
  await select.selectOption({label:match});
  await page.getByRole('heading',{name:/Ejercicio|Ejemplo/}).waitFor();
}
try{
  await page.goto('http://127.0.0.1:5180/');await nav('Practicar');
  await page.getByRole('heading',{name:'Practicar'}).waitFor();
  await noOverflow('practice hub on phone');
  await page.screenshot({path:'tmp/qa/book-catalog-mobile.png',fullPage:true,animations:'disabled'});
  await openProblem('precalculo','B3','3.2.5 · 1e · PDF 42');
  await button('Insertar paréntesis').waitFor();
  assert.equal(await page.getByRole('button',{name:'Teclado numérico'}).count(),0,'factoring must use the algebra pad');
  await button('Insertar paréntesis').tap();await button('2').tap();await button('−').tap();await button('y').tap();
  await button('Mover cursor a la derecha').tap();
  await button('Insertar paréntesis').tap();await button('y').tap();await button('Elevar al cuadrado').tap();await button('+').tap();await button('2').tap();await button('y').tap();await button('+').tap();await button('4').tap();
  await button('Comprobar').click();await page.getByText('¡Correcto!').waitFor();
  await page.screenshot({path:'tmp/qa/book-exercise-tablet.png',fullPage:true,animations:'disabled'});
  await button('Elegir ejercicio').click();
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('discreta');
  await openProblem('discreta','S5','S5.1 · ejemplo 2a · folio 5');
  await page.getByLabel('Teclado numérico').waitFor();
  await button('3').tap();await button('3').tap();
  await button('Comprobar').click();await page.getByText('¡Correcto!').waitFor();
  for(const size of [{width:390,height:844},{width:800,height:1280},{width:1280,height:800}]){
    await page.setViewportSize(size);await nav('Ajustes');await page.getByLabel('Modo oscuro').check();await page.getByLabel('Tamaño de letra').fill('1.3');await nav('Practicar');await noOverflow(`practice dark ${size.width}`);
  }
  await nav('Aprender');assert.ok(await page.locator('.journey-level').count()>0);await noOverflow('illustrated levels');
  await page.screenshot({path:'tmp/qa/illustrated-levels-tablet.png',fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[]);console.log('Book practice passed: algebra pad with parentheses for factoring, number pad only for class counts.');
}catch(e){await page.screenshot({path:'tmp/qa/book-practice-failure.png',fullPage:true});throw e;}finally{await browser.close();await server.close();}
