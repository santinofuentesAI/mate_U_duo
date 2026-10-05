import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import type { Course } from './types';
import { Workbench } from './Workbench';
import { Proof } from './Proof';
GlobalWorkerOptions.workerSrc=workerUrl;
export const bookRoutes: Record<Course,{week:string;title:string;page:number;end:number;printed:string}[]> = {
  discreta:[
    {week:'S1',title:'Conectivas · ejercicios 1.2',page:55,end:58,printed:'53–56'},
    {week:'S1',title:'Leyes de lógica · ejercicios 1.3',page:63,end:63,printed:'61'},
    {week:'S2',title:'Inferencias · ejercicios 1.4',page:73,end:78,printed:'71–76'},
    {week:'S3',title:'Cuantificadores · ejercicios 1.6',page:93,end:97,printed:'91–95'},
    {week:'S3',title:'Inferencias cuantificadas · 1.7 (ampliación)',page:100,end:100,printed:'98'},
    {week:'S4',title:'Conjuntos · ejercicios 2.1',page:123,end:128,printed:'121–126'},
    {week:'S4',title:'Conjuntos numéricos · 2.2',page:133,end:134,printed:'131–132'},
    {week:'S4',title:'Venn · ejercicios 2.3',page:137,end:138,printed:'135–136'},
    {week:'S4',title:'Leyes de conjuntos · 2.4',page:142,end:142,printed:'140'},
    {week:'S4',title:'Cardinalidad · ejercicios 2.5',page:148,end:152,printed:'146–150'},
  ],
  precalculo:[
    {week:'S4',title:'Práctica 1 · Factorización',page:42,end:43,printed:'42–43'},
    {week:'S4',title:'División sintética · ejemplos',page:43,end:45,printed:'43–45'},
    {week:'S4',title:'Fracciones algebraicas · ejemplos',page:45,end:49,printed:'45–49'},
    {week:'S4',title:'Racionalización · ejemplos',page:49,end:51,printed:'49–51'},
    {week:'S4',title:'Práctica final · ejercicios 1–3',page:52,end:53,printed:'52–53'},
  ],
};
function database(): Promise<IDBDatabase> {return new Promise((resolve,reject)=>{const r=indexedDB.open('mate-u-duo-books',1);r.onupgradeneeded=()=>r.result.createObjectStore('books');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function stored(course:Course):Promise<ArrayBuffer|undefined>{const db=await database();try{return await new Promise((resolve,reject)=>{const r=db.transaction('books').objectStore('books').get(course);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{db.close();}}
async function save(course:Course,data:ArrayBuffer){const db=await database();try{await new Promise<void>((resolve,reject)=>{const t=db.transaction('books','readwrite');t.objectStore('books').put(data,course);t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);});}finally{db.close();}}
export function Books({course,initialPage}:{course:Course;initialPage?:number}) {
  const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null),[page,setPage]=useState(initialPage||bookRoutes[course][0].page),[zoom,setZoom]=useState(1),[status,setStatus]=useState(''),[busy,setBusy]=useState(false),[note,setNote]=useState('');const canvas=useRef<HTMLCanvasElement>(null);const [viewVersion,setViewVersion]=useState(0);
  useEffect(()=>{let cancelled=false;let doc:PDFDocumentProxy|null=null;setPdf(null);setStatus('');setPage(initialPage||bookRoutes[course][0].page);stored(course).then(async data=>{if(data){doc=await getDocument({data:new Uint8Array(data)}).promise;if(!cancelled)setPdf(doc);else doc.destroy();}}).catch(()=>{if(!cancelled)setStatus('No se pudo recuperar el libro guardado. Podés cargarlo otra vez.');});return()=>{cancelled=true;doc?.destroy();};},[course]);
  useEffect(()=>{setNote(localStorage.getItem(`mate-note-${course}-${page}`)||'');},[course,page]);
  useEffect(()=>{if(!pdf||!canvas.current)return;let cancelled=false;let task:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;setBusy(true);pdf.getPage(page).then(p=>{if(cancelled||!canvas.current)return;const width=Math.min(1000,Math.max(300,window.innerWidth-48))*zoom;const viewport=p.getViewport({scale:width/p.getViewport({scale:1}).width});const c=canvas.current;c.width=viewport.width;c.height=viewport.height;task=p.render({canvas:c,viewport});return task.promise;}).then(()=>{if(!cancelled)setBusy(false);}).catch(e=>{if(!cancelled){setBusy(false);setStatus(`No se pudo dibujar la página: ${e.message}`);}});return()=>{cancelled=true;task?.cancel();};},[pdf,page,zoom,viewVersion]);
  async function upload(file:File){setStatus('Cargando tu libro…');try{if(file.size>32*1024*1024)throw new Error('Máximo 32 MB por libro.');const data=await file.arrayBuffer();const doc=await getDocument({data:new Uint8Array(data.slice(0))}).promise;await save(course,data);await pdf?.destroy();setPdf(doc);setPage(Math.min(initialPage||bookRoutes[course][0].page,doc.numPages));setStatus(`Libro guardado en este dispositivo · ${doc.numPages} páginas.`);}catch(e){setStatus(e instanceof Error?e.message:'No se pudo cargar el libro.');}}
  return <div className="books"><span className="eyebrow">PRÁCTICA DEL LIBRO</span><h1>El ejercicio real, en tu celular.</h1><p>Elegí una semana, abrí la página y trabajá abajo con el teclado de símbolos. Tu PDF se guarda únicamente en este dispositivo.</p><div className="card"><label className="upload"><Upload size={20}/> {pdf?'Cambiar mi PDF':'Cargar mi libro PDF'}<input type="file" accept="application/pdf,.pdf" onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f);e.target.value='';}}/></label><p role="status">{status}</p><small>Cargá el libro correspondiente a {course==='discreta'?'Introducción a la Matemática Discreta, 4.ª ed.':'Precálculo 2024'}. Los saltos de página están preparados para esas ediciones.</small></div>
    <div className="book-routes">{bookRoutes[course].map(r=><button key={r.title} className={page>=r.page&&page<=r.end?'selected':''} onClick={()=>{setPage(pdf?Math.min(r.page,pdf.numPages):r.page);setViewVersion(v=>v+1);}}><b>{r.week}</b><span>{r.title}<small>PDF {r.page}–{r.end} · impresa {r.printed}</small></span><ChevronRight size={16}/></button>)}</div>
    {pdf?<section className="card pdf-viewer"><div className="pdf-toolbar"><button aria-label="Página anterior" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft/></button><label>Página PDF<input type="number" min={1} max={pdf.numPages} value={page} onChange={e=>{const n=Number(e.target.value);if(n>=1&&n<=pdf.numPages)setPage(n);}}/></label><span>/ {pdf.numPages}</span><button aria-label="Página siguiente" disabled={page>=pdf.numPages} onClick={()=>setPage(page+1)}><ChevronRight/></button><button aria-label="Reducir página" disabled={zoom<=.6} onClick={()=>setZoom(z=>Math.max(.6,z-.2))}><ZoomOut/></button><button aria-label="Ampliar página" disabled={zoom>=2} onClick={()=>setZoom(z=>Math.min(2,z+.2))}><ZoomIn/></button></div>{busy&&<p role="status">Dibujando página…</p>}<div className="pdf-canvas"><canvas ref={canvas} aria-label={`Página ${page} del libro`}/></div><label>Mis notas · página {page}<textarea value={note} onChange={e=>{setNote(e.target.value);try{localStorage.setItem(`mate-note-${course}-${page}`,e.target.value);}catch{setStatus('No se pudo guardar la nota: almacenamiento lleno.');}}} placeholder="Número de ejercicio, restricciones, dudas…"/></label></section>:<div className="empty card">📖<h3>Traé tu libro una sola vez</h3><p>Después podrás ver cada página real aquí, incluso sin conexión si la app ya está instalada y el navegador conserva tus datos.</p></div>}
    <Workbench compact/>{course==='discreta'&&<Proof/>}<p className="notice">La práctica del libro usa un cuaderno con verificación de pasos. Todavía no hay una clave automática para cada inciso del libro. Las lecciones sí tienen ejercicios con corrección y explicación.</p></div>;
}
