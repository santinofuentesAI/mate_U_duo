import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pdfFixture } from './pdfFixture.mjs';
const server=await createServer({server:{host:'127.0.0.1',port:5180,strictPort:true}});await server.listen();
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());fs.mkdirSync('tmp/qa',{recursive:true});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>{const mobile=page.getByRole('navigation',{name:'Navegación móvil',exact:true});await (await mobile.isVisible()?mobile:page.getByRole('navigation',{name:'Navegación principal',exact:true})).getByRole('button',{name,exact:true}).click();};
const catalog=page.getByRole('region',{name:'Práctica del libro',exact:true});
const noOverflow=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label);
async function openExercise(course,exercise,pdfPage){
  await nav('Practicar');await page.getByRole('combobox',{name:'Elegir curso'}).selectOption(course);
  await button('Elegir un inciso').click();await button(`Resolver ${exercise} · página ${pdfPage}`).click();
  await page.getByRole('complementary',{name:'Ejercicio original del libro'}).waitFor();
}
async function finish(){await button('Continuar').click();await button('Volver a mi ruta').click();}
try{
  await page.goto('http://127.0.0.1:5180/');await nav('Practicar');await catalog.waitFor();
  assert.equal(await catalog.getByText('29 actividades seleccionadas · 0 resueltas',{exact:true}).count(),1);
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo');
  await page.getByRole('textbox',{name:'Buscar ejercicios del libro'}).fill('63');assert.equal(await catalog.locator('.book-topic').count(),3);
  await page.getByRole('textbox',{name:'Buscar ejercicios del libro'}).fill('');await noOverflow('book catalog on phone');
  await page.screenshot({path:'tmp/qa/book-catalog-mobile.png',fullPage:true,animations:'disabled'});
  await button('Elegir un inciso').click();await button('Resolver 1e · página 18').click();
  await page.getByText(/Cargá el PDF que compartiste/).waitFor();
  // An unrelated PDF must never masquerade as the original scanned problem.
  await page.getByLabel('PDF original de precalculo').setInputFiles(pdfFixture());await page.getByText(/Usá el mismo PDF original/).waitFor();assert.equal(await page.locator('.original-preview').count(),0);
  if(process.env.TEST_PRECALC_BOOK){
    await page.getByLabel('PDF original de precalculo').setInputFiles(process.env.TEST_PRECALC_BOOK);await button('Ampliar recorte original').waitFor();
    assert.ok((await page.locator('.original-preview img').getAttribute('src')).startsWith('data:image/png'));
    await button('Ampliar recorte original').click();await page.getByRole('dialog',{name:'Recorte original del libro'}).waitFor();await page.keyboard.press('Escape');
    assert.equal(await button('Ampliar recorte original').evaluate(el=>el===document.activeElement),true);
  }
  await button(/Verdadero$/).click();await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();await finish();
  await openExercise('precalculo','1e',42);await button('Teclado del teléfono').click();await page.getByRole('textbox',{name:'Tu respuesta',exact:true}).fill('8-y^3');await button('Comprobar').click();await page.getByText(/falta escribirla como producto/).waitFor();
  await page.getByRole('textbox',{name:'Tu respuesta',exact:true}).fill('(2-y)(y^2+2y+4)');
  await button('Salir de la lección').click();await page.reload();await button('Retomar sesión').click();assert.equal(await page.getByRole('textbox',{name:'Tu respuesta',exact:true}).getAttribute('data-value'),'(2-y)(y^2+2y+4)');
  await button('Ver leyes').click();await page.getByRole('dialog',{name:'Reglas de Precálculo'}).waitFor();await button('Volver al ejercicio').click();
  await page.setViewportSize({width:1280,height:800});await noOverflow('book and answer side by side');assert.equal(await page.locator('.book-exercise-layout').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2);
  await page.getByRole('complementary',{name:'Ejercicio original del libro'}).waitFor();
  if(process.env.TEST_PRECALC_BOOK)await button('Ampliar recorte original').waitFor();
  await page.screenshot({path:'tmp/qa/book-exercise-tablet.png',fullPage:true,animations:'disabled'});await button('Comprobar').click();await page.getByText('+5 XP',{exact:true}).waitFor();await finish();
  await openExercise('discreta','2',123);
  if(process.env.TEST_DISCRETA_BOOK){await page.getByLabel('PDF original de discreta').setInputFiles(process.env.TEST_DISCRETA_BOOK);await button('Ampliar recorte original').waitFor();}
  for(const x of ['a','d','e','f'])await button(x).tap();await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();await finish();
  await openExercise('discreta','6b',124);for(const x of ['1','2','3','4','5','6','7'])await button(x).tap();await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();await finish();
  await openExercise('discreta','2c-tabla',56);for(const [i,v] of ['V','V','F','V'].entries())await button(`Fila ${i+1}: ${v}`).tap();await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();await finish();
  await openExercise('discreta','1b',73);
  for(const step of ['¬R · Modus ponens (premisas 1 y 3)','P · Silogismo disyuntivo (premisa 2 y ¬R)','P∧Q · Conjunción (P y premisa 3)'])await button(step).tap();
  await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!'}).waitFor();await finish();
  for(const size of [{width:390,height:844},{width:800,height:1280},{width:1280,height:800}]){
    await page.setViewportSize(size);await nav('Ajustes');await page.getByLabel('Modo oscuro').check();await page.getByLabel('Tamaño de letra').fill('1.3');await page.getByLabel('Reducir movimiento').check();await nav('Practicar');await noOverflow(`book catalog dark ${size.width}`);
    await catalog.getByRole('combobox',{name:'Bloque del libro'}).selectOption('S4 · Conjuntos');assert.ok(await catalog.locator('.book-topic').count()>0);
    await page.screenshot({path:`tmp/qa/book-catalog-dark-${size.width}.png`,fullPage:true,animations:'disabled'});
  }
  await nav('Aprender');assert.ok(await page.locator('.topic-illustration').count()>0);await noOverflow('illustrated levels');
  await page.screenshot({path:'tmp/qa/illustrated-levels-tablet.png',fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[]);console.log('Book practice passed: source search, wrong-edition protection, graded factorization, resume, complement bars, truth tables, guided proof, tablet columns and dark responsive illustrated UI.');
}catch(e){await page.screenshot({path:'tmp/qa/book-practice-failure.png',fullPage:true});throw e;}finally{await browser.close();await server.close();}
