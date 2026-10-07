import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookText, Search, ZoomIn } from 'lucide-react';
import type { Course } from './types';
import { bookScope } from './bookScope';
import { readerPages } from './bookIndex';
import { bookEditions } from './bookEditions';

export function TechnicalBooks({course,onRead,onBack}:{course:Course;onRead:(page:number)=>void;onBack:()=>void}) {
  const [pages,setPages]=useState<string[]>([]),[page,setPage]=useState(1),[query,setQuery]=useState(''),[loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;setLoading(true);setPages([]);setPage(1);
    const promise=course==='precalculo'?import('./bookText-precalculo.json'):import('./bookText-discreta.json');
    void promise.then(module=>{if(active)setPages(module.default);}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[course]);
  const needle=query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const matches=needle?pages.map((text,index)=>({index:index+1,text})).filter(({text})=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(needle)).slice(0,40):[];
  function go(next:number){setPage(Math.max(1,Math.min(next,pages.length)));window.scrollTo({top:0,behavior:'smooth'});}
  return <div className="technical-book"><button className="text-button" onClick={onBack}><ArrowLeft size={17}/> Volver a la biblioteca</button>
    <span className="eyebrow">BIBLIOTECA · TÉCNICA</span><h1>El libro, página por página.</h1><p>{bookEditions[course].title} · temario {bookScope[course].label}. El texto continúa unas páginas más para adelantar temas, separado del recorrido semanal.</p>
    <p className="notice">Algunas fracciones, exponentes, diagramas y tablas pierden su posición al extraerse del PDF. Para resolver una fórmula, comprobá el original con «Ver página visual» antes de escribir tu respuesta.</p>
    <div className="technical-controls"><label className="route-search"><Search size={18}/><input aria-label="Buscar dentro del libro" placeholder="Buscar una palabra o tema…" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Página PDF <input type="number" min={1} max={pages.length||bookScope[course].lastPage} value={page} onChange={e=>{const value=Number(e.target.value);if(Number.isInteger(value)&&value>=1&&value<=(pages.length||bookScope[course].lastPage))setPage(value);}}/></label></div>
    {loading?<p role="status">Preparando las páginas…</p>:<>
      {needle&&<div className="technical-results" aria-label="Resultados de búsqueda">{matches.length?<>{matches.map(hit=><button key={hit.index} onClick={()=>{go(hit.index);setQuery('');}}>PDF {hit.index} · {hit.text.replace(/\s+/g,' ').slice(0,110)}…</button>)}{matches.length===40&&<small>Se muestran los primeros 40 resultados.</small>}</>:<p>No hay páginas con ese término. Probá otra palabra.</p>}</div>}
      <details className="technical-index"><summary>Índice por tema</summary><div>{readerPages[course].map(section=><button key={section.title} onClick={()=>go(section.page)}>{section.title}<small>PDF {section.page}–{section.end}</small></button>)}</div></details>
      <article className="technical-sheet card"><header><span><BookText size={21}/> Página PDF {page} de {pages.length}{page>bookScope[course].lastPage?' · adelanto opcional':''}</span><button className="secondary" onClick={()=>onRead(page)}><ZoomIn size={16}/>Ver página visual</button></header><pre>{pages[page-1]||'Esta página no contiene texto seleccionable. Abrí la imagen original.'}</pre></article>
      <nav className="technical-pagination" aria-label="Páginas del libro"><button className="secondary" disabled={page<=1} onClick={()=>go(page-1)}><ArrowLeft size={16}/>Anterior</button><span>{page} / {pages.length}</span><button className="primary" disabled={page>=pages.length} onClick={()=>go(page+1)}>Siguiente<ArrowRight size={16}/></button></nav>
    </>}
  </div>;
}
