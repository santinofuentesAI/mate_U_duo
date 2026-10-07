import { useEffect, useRef, useState } from 'react';
import { BookOpen, Upload, ZoomIn } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { BookSource } from './types';
import { saveBook, storedBook } from './bookStorage';
import { bookEditions, matchesBook } from './bookEditions';
import { Dialog } from './Dialog';
GlobalWorkerOptions.workerSrc=workerUrl;
export function BookOriginal({source:s}:{source:BookSource}) {
  const [revision,setRevision]=useState(0),[image,setImage]=useState(''),[status,setStatus]=useState('Buscando tu copia…'),[busy,setBusy]=useState(false),[zoom,setZoom]=useState(false),[fullPage,setFullPage]=useState(false),[exact,setExact]=useState(false);
  const upload=useRef<HTMLInputElement>(null);
  const {course,page,crop:{x,y,width,height}}=s;
  const entire=x===0&&y===0&&width===1&&height===1;
  const label=`${s.section} · ${s.exercise} · página PDF ${page}`;
  useEffect(()=>{const changed=(e:Event)=>{if((e as CustomEvent).detail===course)setRevision(n=>n+1);};window.addEventListener('mate-book-changed',changed);return()=>window.removeEventListener('mate-book-changed',changed);},[course]);
  useEffect(()=>{
    let canceled=false,render:RenderTask|undefined,pdf:PDFDocumentProxy|undefined;
    setImage('');setZoom(false);setStatus('Preparando la página de tu PDF…');
    async function load(){
      try {
        const data=await storedBook(course);if(canceled)return;
        if(!data){setStatus('Importá tu copia una vez para consultar esta página dentro de la app.');return;}
        const match=await matchesBook(data,course);if(canceled)return;setExact(match);
        pdf=await getDocument({data:new Uint8Array(data)}).promise;
        if(canceled){await pdf.destroy();return;}
        if(page>pdf.numPages)throw new Error(`Esta copia tiene ${pdf.numPages} páginas; necesitás PDF ${page}.`);
        const original=await pdf.getPage(page);if(canceled)return;
        const cropped=match&&!fullPage&&!entire,rect=cropped?{x,y,width,height}:{x:0,y:0,width:1,height:1};
        const viewport=original.getViewport({scale:Math.min(4,1400/(original.getViewport({scale:1}).width*rect.width))});
        const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*rect.width);canvas.height=Math.ceil(viewport.height*rect.height);
        render=original.render({canvas,viewport,background:'#ffffff',transform:[1,0,0,1,-rect.x*viewport.width,-rect.y*viewport.height]});await render.promise;
        if(!canceled){setImage(canvas.toDataURL('image/png'));setStatus(match?(cropped?'Recorte del original. También podés consultar la página completa.':'Página completa de la edición verificada.'):'Edición diferente: página completa; la referencia y el contenido no están verificados.');}
      } catch(e){if(!canceled)setStatus(e instanceof Error?e.message:'No se pudo abrir esta copia.');}
      finally{if(pdf)await pdf.destroy();}
    }
    void load();return()=>{canceled=true;render?.cancel();};
  },[course,page,x,y,width,height,revision,fullPage,entire]);
  async function importBook(file:File){setBusy(true);try{
    if(file.size>32*1024*1024)throw new Error('El PDF supera el límite de 32 MB.');
    const data=await file.arrayBuffer(),preview=await getDocument({data:new Uint8Array(data.slice(0))}).promise;
    try{if(preview.numPages<page)throw new Error(`Esta copia tiene ${preview.numPages} páginas; necesitás al menos ${page}.`);}finally{await preview.destroy();}
    await saveBook(course,data);void navigator.storage?.persist?.().catch(()=>false);
  }catch(e){setStatus(e instanceof Error?e.message:'No se pudo guardar el PDF.');}finally{setBusy(false);}}
  return <aside className="book-original card" aria-label="Original del libro"><div className="original-heading"><BookOpen size={22}/><div><span className="eyebrow">TU COPIA PRIVADA</span><h4>PDF {page} · impresa {s.printedPage}</h4></div></div>
    {s.adaptation&&<p className="source-adaptation">{s.adaptation}</p>}
    {image?<><button className="original-preview" onClick={()=>setZoom(true)} aria-label="Ampliar original"><img src={image} alt={label}/><span><ZoomIn size={16}/>Tocá para ampliar</span></button>{exact&&!entire&&<button className="text-button page-toggle" onClick={()=>setFullPage(v=>!v)}>{fullPage?'Ver recorte':'Ver página completa'}</button>}<details className="original-file"><summary>Cambiar mi copia</summary><button className="secondary" onClick={()=>upload.current?.click()} disabled={busy}><Upload size={16}/>Importar PDF</button></details></>:<div className="original-empty"><p>La página se abre aquí, sin salir de la app.</p><button className="secondary wide" disabled={busy} onClick={()=>upload.current?.click()}><Upload size={18}/>{busy?'Guardando…':'Importar mi PDF una vez'}</button></div>}
    <p className="original-status" role="status">{status}</p><small>{bookEditions[course].title}. El PDF queda en este navegador; borrar sus datos elimina la copia.</small>
    <input ref={upload} hidden type="file" accept="application/pdf,.pdf" aria-label={`Importar PDF de ${course}`} onChange={e=>{const f=e.target.files?.[0];if(f)void importBook(f);e.target.value='';}}/>
    {zoom&&<Dialog title="Página de tu copia" onClose={()=>setZoom(false)}><p>{label}</p><img className="original-zoom" src={image} alt={label}/><button className="primary wide" onClick={()=>setZoom(false)}>Volver a resolver</button></Dialog>}
  </aside>;
}
