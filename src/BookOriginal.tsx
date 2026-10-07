import { useEffect, useRef, useState } from 'react';
import { BookOpen, ScanLine, Upload, ZoomIn } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { BookSource } from './types';
import { saveBook, storedBook } from './bookStorage';
import { bookEditions, matchesBook } from './bookEditions';
import { Dialog } from './Dialog';
import { bundledBook } from './bundledBook';
GlobalWorkerOptions.workerSrc=workerUrl;
export function BookOriginal({source:s}:{source:BookSource}) {
  const [revision,setRevision]=useState(0),[image,setImage]=useState(''),[status,setStatus]=useState('Leyendo tu libro…'),[busy,setBusy]=useState(false),[zoom,setZoom]=useState(false),[fullPage,setFullPage]=useState(false),[verified,setVerified]=useState(false);
  const doc=useRef<PDFDocumentProxy|null>(null),upload=useRef<HTMLInputElement>(null);
  const label=`${s.section} · ejercicio ${s.exercise.replace('-tabla','')} · página PDF ${s.page}`;
  useEffect(()=>{
    const changed=(e:Event)=>{if((e as CustomEvent).detail===s.course){const old=doc.current;doc.current=null;void old?.destroy();setRevision(n=>n+1);}};
    window.addEventListener('mate-book-changed',changed);
    return()=>{window.removeEventListener('mate-book-changed',changed);const old=doc.current;doc.current=null;void old?.destroy();};
  },[s.course]);
  useEffect(()=>{
    let canceled=false,render:RenderTask|undefined;setImage('');setStatus('Preparando la página de tu PDF…');setZoom(false);
    async function load() {
      try {
        let pdf=doc.current,exactMatch=verified;
        if(!pdf){
          const data=await storedBook(s.course)||await bundledBook(s.course);if(canceled)return;
          if(!data){setStatus('No se encontró el libro incluido. Podés cargar tu propia copia para ver el inciso.');return;}
          exactMatch=await matchesBook(data,s.course);if(canceled)return;
          setVerified(exactMatch);
          if(canceled)return;
          pdf=await getDocument({data:new Uint8Array(data)}).promise;
          if(canceled){await pdf.destroy();return;}doc.current=pdf;
        }
        if(s.page>pdf.numPages)throw new Error(`Este PDF tiene ${pdf.numPages} páginas y no llega a la página ${s.page} de este ejercicio.`);
        const page=await pdf.getPage(s.page);if(canceled)return;
        const useCrop=exactMatch&&!fullPage,rect=useCrop?s.crop:{x:0,y:0,width:1,height:1};
        const original=page.getViewport({scale:1}),scale=Math.min(4,1200/(original.width*rect.width)),viewport=page.getViewport({scale});
        const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*rect.width);canvas.height=Math.ceil(viewport.height*rect.height);
        render=page.render({canvas,viewport,background:'#ffffff',transform:[1,0,0,1,-rect.x*viewport.width,-rect.y*viewport.height]});await render.promise;
        if(!canceled){setImage(canvas.toDataURL('image/png'));setStatus(useCrop?'Recorte automático del inciso original.':'Esta edición no es la referencia exacta: mostramos la página completa para que no tengas que recortar nada.');}
      }catch(e){if(!canceled)setStatus(e instanceof Error?e.message:'No se pudo abrir este PDF. Intentá cargarlo de nuevo.');}
    }
    void load();return()=>{canceled=true;render?.cancel();};
  },[s,revision,fullPage,verified]);
  async function importBook(file:File) {
    setBusy(true);
    try {
      if(file.size>32*1024*1024)throw new Error('El PDF supera el límite de 32 MB.');
      const data=await file.arrayBuffer();
      const preview=await getDocument({data:new Uint8Array(data.slice(0))}).promise;
      try { if(preview.numPages<s.page)throw new Error(`Este PDF tiene ${preview.numPages} páginas; para este ejercicio necesitás al menos la página ${s.page}.`); }
      finally { await preview.destroy(); }
      await saveBook(s.course,data);
    }catch(e){setStatus(e instanceof Error?e.message:'No se pudo guardar el PDF.');}
    finally{setBusy(false);}
  }
  return <aside className="book-original card" aria-label="Ejercicio original del libro"><div className="original-heading"><span className="illustrated-icon"><BookOpen size={25}/></span><div><span className="eyebrow">DIRECTO DE TU LIBRO</span><h3>Ejercicio {s.exercise.replace('-tabla','')}</h3></div><span className="source-page">PDF {s.page}</span></div>
    <p className="source-reference">{s.section}{s.printedPage!==s.page&&` · impresa ${s.printedPage}`}</p>
    {s.adaptation&&<p className="source-adaptation">{s.adaptation}</p>}
    {image?<><button className="original-preview" onClick={()=>setZoom(true)} aria-label={!verified||fullPage?'Ampliar página completa':'Ampliar ejercicio original'}><img src={image} alt={label}/><span><ZoomIn size={16}/>Tocá para ampliar</span></button>{verified&&<button className="text-button page-toggle" onClick={()=>setFullPage(v=>!v)}>{fullPage?'Ver solo el inciso recortado':'Ver página completa'}</button>}<details className="original-file"><summary>Cambiar PDF</summary><button className="text-button" onClick={()=>upload.current?.click()} disabled={busy}><Upload size={16}/>Cargar mi PDF</button></details></>:<div className="original-empty"><ScanLine size={32}/><p>Del PDF a tu práctica</p><small>Tu copia alternativa se guarda en este dispositivo.</small><button className="secondary wide" disabled={busy} onClick={()=>upload.current?.click()}><Upload size={18}/>{busy?'Abriendo PDF…':'Cargar mi PDF'}</button></div>}
    <p className="original-status" role="status">{status}</p><small>{bookEditions[s.course].title} · edición incluida; las copias alternativas quedan en este dispositivo.</small>
    <input ref={upload} hidden type="file" accept="application/pdf,.pdf" aria-label={`PDF original de ${s.course}`} onChange={e=>{const f=e.target.files?.[0];if(f)void importBook(f);e.target.value='';}}/>
    {zoom&&<Dialog title={!verified||fullPage?'Página de tu libro':'Ejercicio de tu libro'} onClose={()=>setZoom(false)}><p>{label}</p><img className="original-zoom" src={image} alt={label}/><button className="primary wide" onClick={()=>setZoom(false)}>Volver a resolver</button></Dialog>}
  </aside>;
}
