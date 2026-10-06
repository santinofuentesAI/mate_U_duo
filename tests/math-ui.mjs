import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pdfFixture } from './pdfFixture.mjs';
const server=await createServer({server:{host:'127.0.0.1',port:5177,strictPort:true}});await server.listen();
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.TEST_CHROMIUM_PATH?{executablePath:process.env.TEST_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});page.on('dialog',d=>d.accept());fs.mkdirSync('tmp/qa',{recursive:true});
const button=name=>page.getByRole('button',{name,exact:true});
const nav=async name=>{const mobile=page.getByRole('navigation',{name:'Navegación móvil',exact:true});await (await mobile.isVisible()?mobile:page.getByRole('navigation',{name:'Navegación principal',exact:true})).getByRole('button',{name,exact:true}).click();};
const noOverflow=async label=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label);
const value=()=>page.getByRole('textbox',{name:'Tu respuesta',exact:true}).getAttribute('data-value');
const tokens=async input=>{for(const k of input)await button(k==='^'?'Potencia':k==='*'?'Multiplicar':k==='/'?'Dividir':k==='-'?'−':k).tap();};
try {
  await page.goto('http://127.0.0.1:5177/');await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo');await button('Abrir Suma y diferencia de cubos').click();await button('Ahora me toca practicar').click();
  await tokens('x^3+2^3');assert.equal(await value(),'x^3+2^3');assert.equal(await page.locator('.math-field sup').count(),2);assert.equal((await page.locator('.math-field').textContent()).includes('^'),false);
  const base=await page.locator('.math-field [data-math-start="0"]').boundingBox(),power=await page.locator('.math-field sup [data-math-start="2"]').boundingBox();assert.ok(power.y+power.height/2<base.y+base.height/2,'actual superscript sits above the base');
  await page.screenshot({path:'tmp/qa/raised-powers-mobile.png',fullPage:true,animations:'disabled'});
  await button('Ver leyes').click();const dialog=page.getByRole('dialog',{name:'Reglas de Precálculo',exact:true});await dialog.waitFor();assert.equal(await dialog.getByText('De Morgan',{exact:true}).count(),0);await dialog.getByRole('button',{name:'Productos notables',exact:true}).click();await dialog.getByRole('heading',{name:'Cuadrado de una suma',exact:true}).waitFor();
  await dialog.locator('.algebra-rule').first().locator('summary').click();assert.equal(await dialog.locator('.katex-error').count(),0);await page.screenshot({path:'tmp/qa/precalculo-rules-mobile.png',fullPage:true,animations:'disabled'});
  await dialog.getByRole('button',{name:'Factorización',exact:true}).click();await dialog.getByRole('heading',{name:'Diferencia de cubos',exact:true}).waitFor();await button('Volver al ejercicio').click();
  await button('Limpiar').tap();await tokens('x');await button('Elevar al cuadrado').tap();assert.equal(await value(),'x^2');await button('Borrar símbolo').tap();assert.equal(await value(),'x');await button('Deshacer edición').tap();assert.equal(await value(),'x^2');
  // Tap precisely inside the exponent, then replace it without changing the base.
  const exponent=page.locator('.math-field [data-math-start="2"]');await exponent.tap({position:{x:1,y:4}});await button('Borrar símbolo').tap();await noOverflow('editable exponent');
  await button('Limpiar').tap();await button('Insertar paréntesis').tap();await tokens('x+2');assert.equal(await value(),'(x+2)');await button('Mover cursor a la derecha').tap();await button('Elevar al cubo').tap();assert.equal(await value(),'(x+2)^3');
  await button('Limpiar').tap();await button('Insertar fracción').tap();await tokens('x');assert.equal(await value(),'(x)/()');await button('Limpiar').tap();
  await button('Teclado del teléfono').click();const native=page.getByRole('textbox',{name:'Tu respuesta',exact:true});await native.fill('(x-2)*(x^2+2x+4)');await native.evaluate(el=>{el.focus();el.setSelectionRange(9,10);});await button('3').tap();assert.equal(await native.inputValue(),'(x-2)*(x^3+2x+4)');await button('Deshacer edición').tap();assert.equal(await native.inputValue(),'(x-2)*(x^2+2x+4)');await button('Volver a símbolos').tap();
  await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!',exact:true}).waitFor();await page.getByText('+10 XP',{exact:true}).waitFor();assert.equal(await page.getByRole('progressbar',{name:'Avance de esta sesión'}).getAttribute('aria-valuenow'),'33');assert.equal(await page.locator('.symbol-keys').count(),0,'hide keys to make room for explanation');assert.equal(await page.locator('.answer-sparks i').count(),12);await page.screenshot({path:'tmp/qa/correct-answer-mobile.png',fullPage:true,animations:'disabled'});await button('Continuar').click();
  await tokens('(x+3)*(x^2-3x+9)');await button('Consejo gratis').click();await button('Comprobar').click();await page.getByText('+5 XP',{exact:true}).waitFor();await button('Continuar').click();
  await button(/a²\+ab\+b²/).click();await button('Ver leyes').click();await dialog.waitFor();assert.equal(await dialog.getByRole('heading',{name:'Leyes lógicas'}).count(),0);await button('Volver al ejercicio').click();await button('Comprobar').click();await button('Continuar').click();await button('Volver a mi ruta').click();
  // Course-specific references must work in the Library, book workspace and notebook too.
  await nav('Biblioteca');await button('Leyes y reglas').click();await dialog.waitFor();await button('Volver al ejercicio').click();await button('Diccionario de símbolos').click();await page.getByText('Raíz cuadrada',{exact:true}).waitFor();assert.equal(await page.getByText('Disyunción inclusiva',{exact:true}).count(),0);
  await nav('Mi libro');await page.locator('input[type=file]').setInputFiles(pdfFixture());await page.getByText(/Libro guardado en este dispositivo/).waitFor();await button('Ver leyes').click();await dialog.waitFor();await button('Volver al ejercicio').click();
  await nav('Cuaderno');await button('Ver leyes').click();await dialog.waitFor();await button('Volver al ejercicio').click();
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('discreta');await button('Ver leyes').click();await page.getByRole('dialog',{name:'Leyes y reglas',exact:true}).waitFor();await page.getByRole('heading',{name:'Leyes lógicas'}).waitFor();await button('Volver al ejercicio').click();
  await page.getByRole('combobox',{name:'Elegir curso'}).selectOption('precalculo');
  for(const size of [{width:390,height:844},{width:800,height:1280},{width:1280,height:800}]){
    await page.setViewportSize(size);await nav('Ajustes');await page.getByLabel('Modo oscuro').check();await page.getByLabel('Tamaño de letra').fill('1.3');await page.getByLabel('Reducir movimiento').check();await nav('Cuaderno');await noOverflow(`algebra ${size.width}`);await button('Ver leyes').click();await dialog.waitFor();await dialog.getByRole('button',{name:'Productos notables',exact:true}).click();await noOverflow(`rules ${size.width}`);assert.equal(await dialog.locator('.katex-error').count(),0);await page.screenshot({path:`tmp/qa/math-rules-${size.width}.png`,fullPage:true,animations:'disabled'});await button('Volver al ejercicio').click();
  }
  await nav('Aprender');await button('Abrir Suma y diferencia de cubos').click();await button('Ahora me toca practicar').click();await button('Teclado del teléfono').click();await page.getByRole('textbox',{name:'Tu respuesta',exact:true}).fill('(x-2)*(x^2+2x+4)');await button('Comprobar').click();await page.getByText('Concepto reforzado',{exact:true}).waitFor();assert.equal(await page.getByText('+10 XP',{exact:true}).count(),0);assert.equal(await page.locator('.feedback-seal').evaluate(el=>getComputedStyle(el).animationName),'none','reduced motion disables celebration');
  assert.deepEqual(errors,[]);console.log('Math UI passed: raised power geometry, touch templates, editing/undo/native selection, contextual references and glossary, correct/assisted rewards, responsive dark mode and reduced motion.');
} catch(e){await page.screenshot({path:'tmp/qa/math-ui-failure.png',fullPage:true});throw e;} finally {await browser.close();await server.close();}
