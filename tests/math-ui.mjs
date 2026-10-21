import { chromium } from '@playwright/test';
import { skipIntro } from './seenIntro.mjs';
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
const field=()=>page.getByRole('textbox',{name:'Editar línea 1',exact:true});
const value=()=>field().getAttribute('data-value');
const tokens=async input=>{for(const k of input)await button(k==='^'?'Potencia':k==='*'?'Multiplicar':k==='/'?'Dividir':k==='-'?'−':k).tap();};
async function openCubes(){
  await page.getByRole('radio',{name:'Precálculo',exact:true}).click();
  await page.getByRole('button',{name:/Nivel \d+: Suma y diferencia de cubos/}).click();
  await page.getByRole('button',{name:/Ir a los \d+ ejercicios/}).click();
  await page.getByRole('button',{name:'Comprobar',exact:true}).waitFor();
  for(let i=0;i<6 && !(await page.getByRole('button',{name:'Insertar paréntesis'}).count());i++){
    const eight=page.locator('.choices button').filter({hasText:'8'});
    if(await eight.count())await eight.click();
    else {
      const choice=page.locator('.choices button').first();
      if(!(await choice.count()))break;
      await choice.click();
    }
    await button('Comprobar').click();
    const next=button('Continuar');
    if(await next.isVisible())await next.click();
  }
  await button('Insertar paréntesis').waitFor();
}
try {
  await skipIntro(context);await page.goto('http://127.0.0.1:5177/');await openCubes();
  await tokens('x^3+2^3');assert.equal(await value(),'x^3+2^3');assert.equal(await page.locator('.math-field sup').count(),2);assert.equal((await page.locator('.math-field').textContent()).includes('^'),false);
  const base=await page.locator('.math-field [data-math-start="0"]').boundingBox(),power=await page.locator('.math-field sup [data-math-start="2"]').boundingBox();assert.ok(power.y+power.height/2<base.y+base.height/2,'actual superscript sits above the base');
  await page.screenshot({path:'tmp/qa/raised-powers-mobile.png',fullPage:true,animations:'disabled'});
  await page.getByText('Necesito ayuda').click();await button('Ver leyes').click();const dialog=page.getByRole('dialog',{name:'Reglas de Precálculo',exact:true});await dialog.waitFor();assert.equal(await dialog.getByText('De Morgan',{exact:true}).count(),0);await dialog.getByRole('button',{name:'Productos notables',exact:true}).click();await dialog.getByRole('heading',{name:'Cuadrado de una suma',exact:true}).waitFor();
  await dialog.locator('.algebra-rule').first().locator('summary').click();assert.equal(await dialog.locator('.katex-error').count(),0);await page.screenshot({path:'tmp/qa/precalculo-rules-mobile.png',fullPage:true,animations:'disabled'});
  await dialog.getByRole('button',{name:'Factorización',exact:true}).click();await dialog.getByRole('heading',{name:'Diferencia de cubos',exact:true}).waitFor();await button('Volver al ejercicio').click();
  await button('Limpiar').tap();await tokens('x');await button('Elevar al cuadrado').tap();assert.equal(await value(),'x^2');await button('Borrar símbolo').tap();assert.equal(await value(),'x');await button('Deshacer edición').tap();assert.equal(await value(),'x^2');
  const exponent=page.locator('.math-field [data-math-start="2"]');await exponent.tap({position:{x:1,y:4}});await button('Borrar símbolo').tap();await noOverflow('editable exponent');
  await button('Limpiar').tap();await button('Insertar paréntesis').tap();await tokens('x+2');assert.equal(await value(),'(x+2)');await button('Mover cursor a la derecha').tap();await button('Elevar al cubo').tap();assert.equal(await value(),'(x+2)^3');
  await button('Limpiar').tap();await button('Insertar fracción').tap();await tokens('x');assert.equal(await value(),'(x)/()');await button('Limpiar').tap();
  await button('Teclado del teléfono').click();const native=field();await native.fill('(x-1)*(x^2+x+1)');await native.evaluate(el=>{el.focus();el.setSelectionRange(9,10);});await button('3').tap();assert.equal(await native.inputValue(),'(x-1)*(x^3+x+1)');await button('Deshacer edición').tap();assert.equal(await native.inputValue(),'(x-1)*(x^2+x+1)');await button('Volver a símbolos').tap();
  await button('Comprobar').click();await page.getByRole('heading',{name:'¡Bien razonado!',exact:true}).waitFor();await page.getByText('+10 XP',{exact:true}).waitFor();assert.equal(await page.locator('.symbol-keys').count(),0,'hide keys to make room for explanation');assert.equal(await page.locator('.answer-sparks i').count(),12);await page.screenshot({path:'tmp/qa/correct-answer-mobile.png',fullPage:true,animations:'disabled'});
  await button('Salir de la lección').click();
  await page.getByRole('heading',{name:'Aprender'}).waitFor();
  await nav('Biblioteca');await page.getByRole('textbox',{name:'Buscar en la biblioteca'}).fill('cubos');await page.getByRole('button',{name:'Suma y diferencia de cubos'}).click();await page.getByRole('heading',{name:'Ejemplo paso a paso'}).waitFor();
  await nav('Mi libro');await page.locator('input[type=file]').setInputFiles(pdfFixture());await page.getByText(/PDF guardado/).waitFor();
  await page.getByRole('radio',{name:'Matemática Discreta',exact:true}).click();
  await nav('Aprender');await page.getByRole('button',{name:/Nivel \d+: Equivalencias y simplificación/}).click();
  await page.getByRole('button',{name:/Ir a los \d+ ejercicios/}).click();
  await page.getByText('Necesito ayuda').click();await button('Ver leyes').click();await page.getByRole('dialog',{name:'Leyes y reglas',exact:true}).waitFor();await page.getByRole('heading',{name:'Leyes lógicas'}).waitFor();await button('Volver al ejercicio').click();
  await button('Salir de la lección').click();
  await page.getByRole('heading',{name:'Aprender'}).waitFor();
  await page.getByRole('radio',{name:'Precálculo',exact:true}).click();
  for(const size of [{width:390,height:844},{width:800,height:1280},{width:1280,height:800}]){
    await page.setViewportSize(size);await nav('Ajustes');await page.getByLabel('Modo oscuro').check();await page.getByLabel('Tamaño de letra').fill('1.3');await page.getByLabel('Reducir movimiento').check();await nav('Mi libro');await noOverflow(`algebra ${size.width}`);
  }
  await nav('Aprender');await openCubes();await button('Teclado del teléfono').click();await field().fill('(x-1)*(x^2+x+1)');await button('Comprobar').click();await page.getByText('Concepto reforzado',{exact:true}).waitFor();assert.equal(await page.getByText('+10 XP',{exact:true}).count(),0);assert.equal(await page.locator('.feedback-seal').evaluate(el=>getComputedStyle(el).animationName),'none','reduced motion disables celebration');
  assert.deepEqual(errors,[]);console.log('Math UI passed: raised power geometry, touch templates, parentheses, factorization answer, reduced motion.');
} catch(e){await page.screenshot({path:'tmp/qa/math-ui-failure.png',fullPage:true});throw e;} finally {await browser.close();await server.close();}
