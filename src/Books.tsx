import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { BookOpen, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import type { Course } from './types';
import { bookRoutes } from './bookIndex';
import { bookScope } from './bookScope';
import { bookCatalog } from './bookCatalog';
import { storedBook, saveBook, storedClips, type BookClip } from './bookStorage';
import { matchesBook } from './bookEditions';
GlobalWorkerOptions.workerSrc = workerUrl;

export function Books({course, initialPage, onPageChange, onProblem}: {course: Course; initialPage?: number; onPageChange:(page:number)=>void; onProblem:(id:string)=>void}) {
  const scope=bookScope[course];
  const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null),[page,setPage]=useState(initialPage||bookRoutes[course][0].page);
  const [fullBook,setFullBook]=useState((initialPage||0)>scope.lastPage),[status,setStatus]=useState(''),[loading,setLoading]=useState(false),[busy,setBusy]=useState(false);
  const [note,setNote]=useState(''),[width,setWidth]=useState(300),[clips,setClips]=useState<BookClip[]>([]);
  const canvas=useRef<HTMLCanvasElement>(null),viewer=useRef<HTMLDivElement>(null),documentRef=useRef<PDFDocumentProxy|null>(null),generation=useRef(0);
  const lastPage=pdf?Math.min(pdf.numPages,fullBook?pdf.numPages:scope.lastPage):scope.lastPage;
  const related=bookCatalog[course].filter(problem=>problem.sourcePages.includes(page));
  useEffect(()=>onPageChange(page),[page,onPageChange]);
  useEffect(()=>{
    const token=++generation.current;setPdf(null);setStatus('');setLoading(true);setFullBook((initialPage||0)>scope.lastPage);setPage(initialPage||bookRoutes[course][0].page);
    storedBook(course).then(async data=>{
      if(token!==generation.current)return;
      if(!data){setStatus('Cargá tu PDF una vez para leerlo aquí, también sin conexión.');return;}
      const exact=await matchesBook(data,course);
      const doc=await getDocument({data:new Uint8Array(data)}).promise;
      if(token!==generation.current){await doc.destroy();return;}
      documentRef.current=doc;setPdf(doc);setPage(Math.min(initialPage||bookRoutes[course][0].page,doc.numPages,(initialPage||0)>scope.lastPage?doc.numPages:scope.lastPage));
      if(!exact)setStatus('Edición diferente: comprobá las páginas en el PDF.');
    }).catch(()=>{if(token===generation.current)setStatus('No se pudo abrir el PDF guardado. Podés cargarlo de nuevo.');}).finally(()=>{if(token===generation.current)setLoading(false);});
    storedClips(course).then(items=>{if(token===generation.current)setClips(items);}).catch(()=>{});
    return ()=>{generation.current++;void documentRef.current?.destroy();documentRef.current=null;};
  },[course]);
  useEffect(()=>{try{setNote(localStorage.getItem(`mate-note-${course}-${page}`)||'');}catch{setNote('');}},[course,page]);
  useEffect(()=>{
    if(!viewer.current)return;
    const element=viewer.current,observer=new ResizeObserver(()=>setWidth(Math.max(200,element.clientWidth)));
    observer.observe(element);setWidth(Math.max(200,element.clientWidth));return ()=>observer.disconnect();
  },[pdf]);
  useEffect(()=>{
    if(!pdf||!canvas.current)return;
    let cancelled=false,task:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
    setBusy(true);
    pdf.getPage(page).then(p=>{
      if(cancelled||!canvas.current)return;
      const ratio=Math.min(2,window.devicePixelRatio||1),cssWidth=Math.min(1100,width);
      const viewport=p.getViewport({scale:cssWidth/p.getViewport({scale:1}).width*ratio}),c=canvas.current;
      c.width=Math.round(viewport.width);c.height=Math.round(viewport.height);c.style.width=`${cssWidth}px`;c.style.height=`${viewport.height/ratio}px`;
      task=p.render({canvas:c,viewport});return task.promise;
    }).then(()=>{if(!cancelled)setBusy(false);}).catch(()=>{if(!cancelled){setBusy(false);setStatus('No se pudo dibujar esta página.');}});
    return ()=>{cancelled=true;task?.cancel();};
  },[pdf,page,width]);
  async function upload(file:File){
    const token=++generation.current;setLoading(true);setStatus('Cargando…');let doc:PDFDocumentProxy|null=null;
    try{
      if(file.size>32*1024*1024)throw new Error('El archivo debe ser menor de 32 MB.');
      const data=await file.arrayBuffer(),exact=await matchesBook(data,course);
      doc=await getDocument({data:new Uint8Array(data.slice(0))}).promise;
      if(token!==generation.current){await doc.destroy();return;}
      await saveBook(course,data);void navigator.storage?.persist?.().catch(()=>false);
      const old=documentRef.current;documentRef.current=doc;setPdf(doc);setFullBook(false);setPage(Math.min(initialPage||bookRoutes[course][0].page,doc.numPages,scope.lastPage));
      if(old)setTimeout(()=>void old.destroy(),0);
      setStatus(exact?'PDF guardado en este dispositivo. Edición verificada.':'PDF guardado. Edición diferente: comprobá las páginas.');
    }catch(e){if(doc&&doc!==documentRef.current)await doc.destroy();if(token===generation.current)setStatus(e instanceof Error?e.message:'No se pudo cargar el PDF.');}
    finally{if(token===generation.current)setLoading(false);}
  }
  return <div className="simple-flow books-simple"><h1>Mi libro</h1><p>Leé la página original y abrí un ejercicio para resolverlo.</p>
    <section className="simple-feature"><div><b>{course==='discreta'?'Matemática Discreta, 4.ª edición':'Precálculo 2024'}</b><p>{pdf?'Tu copia está disponible en este dispositivo.':'Importá tu copia PDF para leer dentro de la app.'}</p></div><label className="upload"><Upload size={18}/>{loading?'Cargando…':pdf?'Cambiar PDF':'Cargar PDF'}<input disabled={loading} type="file" accept="application/pdf,.pdf" onChange={e=>{const f=e.target.files?.[0];if(f)void upload(f);e.target.value='';}}/></label>{status&&<small role="status">{status}</small>}</section>
    <div className="simple-controls"><label>Tema<select aria-label="Ir a un tema del libro" value={bookRoutes[course].findIndex(r=>page>=r.page&&page<=r.end)} onChange={e=>{const route=bookRoutes[course][Number(e.target.value)];if(route)setPage(Math.min(route.page,lastPage));}}><option value={-1}>Elegir tema</option>{bookRoutes[course].map((r,i)=><option key={i} value={i}>{r.title} · PDF {r.page}</option>)}</select></label><label className="scope-toggle"><input type="checkbox" checked={fullBook} onChange={e=>{setFullBook(e.target.checked);if(!e.target.checked)setPage(n=>Math.min(n,scope.lastPage));}}/>Ver páginas fuera del temario</label></div>
    {pdf?<section className="card pdf-viewer"><nav className="pdf-toolbar" aria-label="Páginas del libro"><button aria-label="Página anterior" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft/></button><label>Página PDF<input aria-label="Página PDF" type="number" min={1} max={lastPage} value={page} onChange={e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=lastPage)setPage(n);}}/></label><span>de {lastPage}</span><button aria-label="Página siguiente" disabled={page>=lastPage} onClick={()=>setPage(page+1)}><ChevronRight/></button></nav>{busy&&<small role="status">Preparando página…</small>}<div className="pdf-canvas" ref={viewer}><div className="pdf-sheet"><canvas ref={canvas} aria-label={`Página ${page} del libro`}/></div></div><details className="simple-more"><summary>Nota de esta página</summary><textarea aria-label={`Nota de la página ${page}`} value={note} onChange={e=>{setNote(e.target.value);try{localStorage.setItem(`mate-note-${course}-${page}`,e.target.value);}catch{setStatus('No se pudo guardar la nota.');}}} placeholder="Escribí una duda o idea…"/></details></section>:<section className="card empty"><BookOpen size={36}/><p>Tu libro aparecerá aquí después de cargar el PDF.</p></section>}
    <section className="card book-page-practice"><h2>Ejercicios de esta página</h2>{related.length?<><p>{related.length} incisos identificados · PDF {page}</p><div className="simple-link-list">{related.map(problem=><button key={problem.id} onClick={()=>onProblem(problem.id)}><b>{problem.sectionCode} · ejercicio {problem.number}{problem.part}</b><span>{problem.section}</span></button>)}</div></>:<p>No hay ejercicios identificados aquí. Podés pasar a otra página.</p>}</section>
    {clips.length>0&&<details className="simple-more"><summary>Mis recortes guardados ({clips.length})</summary><div className="clip-list">{clips.map(c=><a key={c.id} href={c.image} download={`ejercicio-${course}-p${c.page}.png`}><img src={c.image} alt={c.title}/><span>{c.title} · PDF {c.page}</span></a>)}</div></details>}
    <small>El catálogo aún no demuestra cobertura completa. Comprobá símbolos y tablas en el PDF original.</small>
  </div>;
}
