import { useEffect, useRef, useState } from 'react';
import { BookOpen, ScanLine, Upload, ZoomIn } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { BookSource } from './types';
import { saveBook, storedBook } from './bookStorage';
import { bookEditions, matchesBook } from './bookEditions';
import { Dialog } from './Dialog';
GlobalWorkerOptions.workerSrc=workerUrl;
export function BookOriginal({source:s}:{source:BookSource}) {
  const [revision,setRevision]=useState(0),[image,setImage]=useState(''),[status,setStatus]=useState('Leyendo tu libro…'),[busy,setBusy]=useState(false),[zoom,setZoom]=useState(false);
  const doc=useRef<PDFDocumentProxy|null>(null),upload=useRef<HTMLInputElement>(null);
  const label=`${s.section} · ejercicio ${s.exercise.replace('-tabla','')} · página PDF ${s.page}`;
  useEffect(()=>{
    const changed=(e:Event)=>{if((e as CustomEvent).detail===s.course){const old=doc.current;doc.current=null;void old?.destroy();setRevision(n=>n+1);}};
    window.addEventListener('mate-book-changed',changed);
    return()=>{window.removeEventListener('mate-book-changed',changed);const old=doc.current;doc.current=null;void old?.destroy();};
  },[s.course]);
  useEffect(()=>{
    let canceled=false,render:RenderTask|undefined;setImage('');setStatus('Preparando el recorte original…');setZoom(false);
    async function load() {
      try {
        let pdf=doc.current;
        if(!pdf){
          const data=await storedBook(s.course);if(canceled)return;
          if(!data){setStatus('Cargá el PDF que compartiste para ver este recorte original. Podés resolver con el enunciado de la práctica desde ahora.');return;}
          if(!await matchesBook(data,s.course)){if(!canceled)setStatus('Este archivo no coincide con el PDF original usado para ubicar los recortes. Cargá el mismo archivo que compartiste; tu respuesta y tu progreso se conservan.');return;}
          if(canceled)return;
          pdf=await getDocument({data:new Uint8Array(data)}).promise;
          if(canceled){await pdf.destroy();return;}doc.current=pdf;
        }
        const page=await pdf.getPage(s.page);if(canceled)return;
        const original=page.getViewport({scale:1}),scale=Math.min(4,1200/(original.width*s.crop.width)),viewport=page.getViewport({scale});
        const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*s.crop.width);canvas.height=Math.ceil(viewport.height*s.crop.height);
        render=page.render({canvas,viewport,background:'#ffffff',transform:[1,0,0,1,-s.crop.x*viewport.width,-s.crop.y*viewport.height]});await render.promise;
        if(!canceled){setImage(canvas.toDataURL('image/png'));setStatus('Recorte del PDF original guardado en este dispositivo.');}
      }catch{if(!canceled)setStatus('No se pudo abrir el recorte. Volvé a cargar el PDF original para intentarlo de nuevo.');}
    }
    void load();return()=>{canceled=true;render?.cancel();};
  },[s,revision]);
  async function importBook(file:File) {
    setBusy(true);
    try {
      if(file.size>32*1024*1024)throw new Error('El PDF supera el límite de 32 MB.');
      const data=await file.arrayBuffer();
      if(!await matchesBook(data,s.course))throw new Error('Usá el mismo PDF original que compartiste para que el número de página y el recorte coincidan.');
      await saveBook(s.course,data);
    }catch(e){setStatus(e instanceof Error?e.message:'No se pudo guardar el PDF.');}
    finally{setBusy(false);}
  }
  return <aside className="book-original card" aria-label="Ejercicio original del libro"><div className="original-heading"><span className="illustrated-icon"><BookOpen size={25}/></span><div><span className="eyebrow">DIRECTO DE TU LIBRO</span><h3>Ejercicio {s.exercise.replace('-tabla','')}</h3></div><span className="source-page">PDF {s.page}</span></div>
    <p className="source-reference">{s.section}{s.printedPage!==s.page&&` · impresa ${s.printedPage}`}</p>
    {s.adaptation&&<p className="source-adaptation">{s.adaptation}</p>}
    {image?<><button className="original-preview" onClick={()=>setZoom(true)} aria-label="Ampliar recorte original"><img src={image} alt={label}/><span><ZoomIn size={16}/>Tocá para ampliar</span></button><details className="original-file"><summary>Cambiar PDF</summary><button className="text-button" onClick={()=>upload.current?.click()} disabled={busy}><Upload size={16}/>Cargar el original</button></details></>:<div className="original-empty"><ScanLine size={32}/><p>Del papel a tu práctica</p><button className="secondary wide" disabled={busy} onClick={()=>upload.current?.click()}><Upload size={18}/>{busy?'Verificando PDF…':'Cargar PDF para ver el recorte'}</button></div>}
    <p className="original-status" role="status">{status}</p><small>{bookEditions[s.course].title} · se guarda solo en este dispositivo.</small>
    <input ref={upload} hidden type="file" accept="application/pdf,.pdf" aria-label={`PDF original de ${s.course}`} onChange={e=>{const f=e.target.files?.[0];if(f)void importBook(f);e.target.value='';}}/>
    {zoom&&<Dialog title="Recorte original del libro" onClose={()=>setZoom(false)}><p>{label}</p><img className="original-zoom" src={image} alt={label}/><button className="primary wide" onClick={()=>setZoom(false)}>Volver a resolver</button></Dialog>}
  </aside>;
}
