import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { BookOpen, ChevronLeft, ChevronRight, Crop, Pin, Trash2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import type { Course } from './types';
import { Workbench } from './Workbench';
import { Proof } from './Proof';
import { bookRoutes } from './bookIndex';
import { bookScope } from './bookScope';
import { bookCatalog } from './bookCatalog';
import { storedBook, saveBook, storedClips, saveClip, deleteClip, type BookClip } from './bookStorage';
import { ConfirmDialog } from './ConfirmDialog';
import { matchesBook } from './bookEditions';
GlobalWorkerOptions.workerSrc = workerUrl;
type Point = { x: number; y: number };
type Selection = { start: Point; end: Point };
export function Books({course, initialPage, onPageChange, onProblem}: {course: Course; initialPage?: number; onPageChange:(page:number)=>void; onProblem:(id:string)=>void}) {
  const scope = bookScope[course];
  const [fullBook, setFullBook] = useState((initialPage||0)>scope.lastPage), [pdf, setPdf] = useState<PDFDocumentProxy|null>(null);
  const [page, setPage] = useState(initialPage || bookRoutes[course][0].page), [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [note, setNote] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null), viewer = useRef<HTMLDivElement>(null), documentRef = useRef<PDFDocumentProxy|null>(null), generation = useRef(0);
  const [width, setWidth] = useState(300), [cropMode, setCropMode] = useState(false), [selection, setSelection] = useState<Selection|null>(null);
  const dragging = useRef(false), [clips, setClips] = useState<BookClip[]>([]), [pinned, setPinned] = useState(''), [clipTitle, setClipTitle] = useState('');
  const [workspace, setWorkspace] = useState<'steps'|'proof'>('steps'), [saving, setSaving] = useState(false);
  const [clipToDelete,setClipToDelete]=useState<BookClip|null>(null);
  const lastSaveTouch = useRef(-Infinity), saveInFlight = useRef(false);
  const lastPage = pdf ? Math.min(pdf.numPages, fullBook ? pdf.numPages : scope.lastPage) : scope.lastPage;
  const selectedClip = clips.find(c => c.id === pinned);
  const related = bookCatalog[course].filter(problem=>problem.page===page);
  useEffect(()=>onPageChange(page),[page,onPageChange]);
  useEffect(() => {
    const token = ++generation.current; setPdf(null); setStatus(''); setLoading(true); setFullBook((initialPage||0)>scope.lastPage); setPage(initialPage || bookRoutes[course][0].page);
    storedBook(course).then(async data => {
      if (token !== generation.current) return;
      if(!data){setStatus('Importá tu copia una vez. Después podés abrirla sin conexión en este navegador.');return;}
      const exact=await matchesBook(data,course);
      if(!exact)setStatus('Edición diferente: los números de página no están verificados para esta copia.');
      const doc = await getDocument({data: new Uint8Array(data)}).promise;
      if (token !== generation.current) { await doc.destroy(); return; }
      documentRef.current = doc; setPdf(doc); setPage(Math.min(initialPage || bookRoutes[course][0].page, doc.numPages, (initialPage||0)>scope.lastPage?doc.numPages:scope.lastPage));
    }).catch(() => { if (token === generation.current) setStatus('No se pudo abrir el libro. Podés cargar tu PDF manualmente.'); })
      .finally(() => { if (token === generation.current) setLoading(false); });
    storedClips(course).then(items => { if (token === generation.current) { setClips(items); setPinned(items[0]?.id || ''); } })
      .catch(() => { if (token === generation.current) setStatus('No se pudieron recuperar los recortes.'); });
    return () => { generation.current++; void documentRef.current?.destroy(); documentRef.current = null; };
  }, [course]);
  useEffect(() => { try { setNote(localStorage.getItem(`mate-note-${course}-${page}`) || ''); } catch { setNote(''); } setSelection(null); setCropMode(false); }, [course, page]);
  useEffect(() => {
    if (!viewer.current) return;
    const el = viewer.current, observer = new ResizeObserver(() => setWidth(Math.max(200, el.clientWidth)));
    observer.observe(el); setWidth(Math.max(200, el.clientWidth)); return () => observer.disconnect();
  }, [pdf]);
  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let cancelled = false; let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
    setBusy(true); setSelection(null);
    pdf.getPage(page).then(p => {
      if (cancelled || !canvas.current) return;
      const cssWidth = Math.min(1200, width) * zoom, ratio = Math.min(2, window.devicePixelRatio || 1);
      const viewport = p.getViewport({scale: cssWidth / p.getViewport({scale: 1}).width * ratio}), c = canvas.current;
      c.width = Math.round(viewport.width); c.height = Math.round(viewport.height); c.style.width = `${cssWidth}px`; c.style.height = `${viewport.height / ratio}px`;
      task = p.render({canvas: c, viewport}); return task.promise;
    }).then(() => { if (!cancelled) setBusy(false); }).catch(e => { if (!cancelled) { setBusy(false); setStatus(`No se pudo dibujar la página: ${e.message}`); } });
    return () => { cancelled = true; task?.cancel(); };
  }, [pdf, page, zoom, width]);
  async function upload(file: File) {
    const token = ++generation.current; setLoading(true); setStatus('Cargando tu libro…'); let doc: PDFDocumentProxy|null = null;
    try {
      if (file.size > 32*1024*1024) throw new Error('Máximo 32 MB por libro.');
      const data = await file.arrayBuffer(), exact=await matchesBook(data,course); doc = await getDocument({data: new Uint8Array(data.slice(0))}).promise;
      if (token !== generation.current) { await doc.destroy(); return; }
      await saveBook(course, data); void navigator.storage?.persist?.().catch(()=>false);
      if (token !== generation.current) { await doc.destroy(); return; }
      const old = documentRef.current; documentRef.current = doc; setPdf(doc); setFullBook(false); setPage(Math.min(initialPage || bookRoutes[course][0].page, doc.numPages, scope.lastPage));
      if (old) setTimeout(() => void old.destroy(), 0);
      setStatus(`Libro guardado en este dispositivo · ${doc.numPages} páginas.${exact?' Edición verificada.':' Edición diferente: referencias sin verificar.'}`);
    } catch(e) { if (doc && doc !== documentRef.current) await doc.destroy(); if (token === generation.current) setStatus(e instanceof Error ? e.message : 'No se pudo cargar el libro.'); }
    finally { if (token === generation.current) setLoading(false); }
  }
  function point(e: PointerEvent<HTMLDivElement>): Point {
    const b = e.currentTarget.getBoundingClientRect(); return {x: Math.max(0, Math.min(1, (e.clientX-b.left)/b.width)), y: Math.max(0, Math.min(1, (e.clientY-b.top)/b.height))};
  }
  async function capture() {
    if (!canvas.current || !selection || busy || saveInFlight.current) return;
    const c = canvas.current, x = Math.min(selection.start.x, selection.end.x), y = Math.min(selection.start.y, selection.end.y);
    const w = Math.abs(selection.start.x-selection.end.x)*c.width, h = Math.abs(selection.start.y-selection.end.y)*c.height;
    if (w < 20 || h < 20) { setStatus('Elegí un área un poco más grande para que se pueda leer.'); return; }
    if (clips.length >= 60) { setStatus('Tenés 60 recortes en este curso. Borrá uno para guardar otro.'); return; }
    const image = document.createElement('canvas'), scale = Math.min(1, 1600/w, 1600/h); image.width = Math.round(w*scale); image.height = Math.round(h*scale);
    image.getContext('2d')!.drawImage(c, x*c.width, y*c.height, w, h, 0, 0, image.width, image.height);
    const clip: BookClip = {id: crypto.randomUUID(), course, page, title: clipTitle.trim().slice(0,120) || `Ejercicio · página ${page}`, image: image.toDataURL('image/png'), created: Date.now()}; saveInFlight.current=true;setSaving(true);
    try { await saveClip(clip); setClips(items => [clip, ...items]); setPinned(clip.id); setSelection(null); setCropMode(false); setClipTitle(''); setStatus('Recorte guardado. Ya lo tenés junto al cuaderno.'); }
    catch { setStatus('No se pudo guardar el recorte. Revisá el espacio disponible en el dispositivo.'); } finally { saveInFlight.current=false;setSaving(false); }
  }
  async function removeClip(clip: BookClip) {
    try { await deleteClip(clip.id); setClips(items => items.filter(c => c.id !== clip.id)); if (pinned === clip.id) setPinned(clips.find(c => c.id !== clip.id)?.id || ''); } catch { setStatus('No se pudo borrar el recorte.'); }
  }
  return <div className="books"><span className="eyebrow">MI LIBRO</span><h1>Leé y resolvé con tu libro.</h1>
    <p>Elegí una página, leé el original y abrí el ejercicio correspondiente en Book Exam. Tus notas, recortes y pasos se guardan en este dispositivo.</p>
    <div className="card"><label className={`upload ${loading?'loading':''}`}><Upload size={20}/>{loading?'Cargando…':pdf?'Cambiar edición PDF':'Cargar mi libro PDF'}<input disabled={loading} type="file" accept="application/pdf,.pdf" onChange={e => {const f=e.target.files?.[0]; if(f) void upload(f); e.target.value='';}}/></label><p role="status">{status}</p><small>Cargá el libro correspondiente a {course==='discreta'?'Introducción a la Matemática Discreta, 4.ª ed.':'Precálculo 2024'}. Los saltos de página están preparados para esas ediciones.</small></div>
    <section className="card scope-card"><span className="eyebrow">TEMARIO ACTUAL</span><h2>{scope.label}</h2><p>{scope.explanation}</p><button className="secondary" onClick={()=>setPage(1)}>Leer desde la página 1</button><label className="scope-toggle"><input type="checkbox" checked={fullBook} onChange={e=>{setFullBook(e.target.checked);if(!e.target.checked)setPage(n=>Math.min(n,lastPage,scope.lastPage));}}/>Explorar el libro completo fuera del temario</label></section>
    <div className="book-routes">{bookRoutes[course].map(r=><button key={r.title} className={page>=r.page&&page<=r.end?'selected':''} onClick={()=>setPage(Math.min(r.page,lastPage))}><b>{r.week}</b><span>{r.title}<small>PDF {r.page}–{r.end} · impresa {r.printed}</small></span><ChevronRight size={16}/></button>)}</div>
    {pdf?<section className="card pdf-viewer"><div className="pdf-toolbar"><button aria-label="Página anterior" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft/></button><label>Página PDF<input type="number" min={1} max={lastPage} value={page} onChange={e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=lastPage)setPage(n);}}/></label><span>/ {lastPage}{fullBook?'':' del temario'}</span><button aria-label="Página siguiente" disabled={page>=lastPage} onClick={()=>setPage(page+1)}><ChevronRight/></button><button aria-label="Reducir página" disabled={zoom<=.6} onClick={()=>setZoom(z=>Math.max(.6,z-.2))}><ZoomOut/></button><button aria-label="Ampliar página" disabled={zoom>=2} onClick={()=>setZoom(z=>Math.min(2,z+.2))}><ZoomIn/></button><button className="secondary" disabled={busy} aria-pressed={cropMode} onClick={()=>{setCropMode(!cropMode);setSelection(null);}}><Crop size={18}/>{cropMode?'Cancelar recorte':'Recortar ejercicio'}</button></div>{busy&&<p role="status">Dibujando página…</p>}
    {cropMode&&<div className="crop-instructions"><p>Arrastrá con un dedo sobre la página para marcar el ejercicio. Fuera de la página podés seguir desplazándote.</p><label>Nombre del recorte<input value={clipTitle} maxLength={120} onChange={e=>setClipTitle(e.target.value)} placeholder="Ej. 12 · De Morgan"/></label><div className="row wrap"><button onClick={()=>setSelection({start:{x:0,y:0},end:{x:1,y:.5}})}>Mitad superior</button><button onClick={()=>setSelection({start:{x:0,y:.5},end:{x:1,y:1}})}>Mitad inferior</button><button className="primary" disabled={!selection||busy||saving} onPointerUp={e=>{if(e.pointerType==='touch'){lastSaveTouch.current=performance.now();void capture();}}} onClick={e=>{if(e.detail===0||performance.now()-lastSaveTouch.current>1000)void capture();}}>{saving?'Guardando…':'Guardar recorte'}</button></div></div>}
    <div className="pdf-canvas" ref={viewer}><div className="pdf-sheet"><canvas ref={canvas} aria-label={`Página ${page} del libro`}/>{cropMode&&!busy&&<div className="crop-overlay" aria-label="Área para recortar el ejercicio" onPointerDown={e=>{if(!e.isPrimary)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);dragging.current=true;const p=point(e);setSelection({start:p,end:p});}} onPointerMove={e=>{if(dragging.current){const end=point(e);setSelection(s=>s?{...s,end}:null);}}} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;setSelection(null);}}>{selection&&<div className="crop-selection" style={{left:`${Math.min(selection.start.x,selection.end.x)*100}%`,top:`${Math.min(selection.start.y,selection.end.y)*100}%`,width:`${Math.abs(selection.start.x-selection.end.x)*100}%`,height:`${Math.abs(selection.start.y-selection.end.y)*100}%`}}/>}</div>}</div></div>
    <label>Mis notas · página {page}<textarea value={note} onChange={e=>{setNote(e.target.value);try{localStorage.setItem(`mate-note-${course}-${page}`,e.target.value);}catch{setStatus('No se pudo guardar la nota: almacenamiento lleno.');}}} placeholder="Número de ejercicio, restricciones, dudas…"/></label></section>:<div className="empty card"><BookOpen size={42}/><h3>Abrí el libro aquí mismo</h3><p>Importá tu PDF con el botón de arriba. Se conserva en este navegador para estudiar sin conexión.</p></div>}
    <section className="card book-page-practice" aria-label="Ejercicios de la página"><div className="row wrap"><div><span className="eyebrow">DE LA LECTURA A LA PRÁCTICA</span><h2>Ejercicios de la página PDF {page}</h2></div>{related.length>0&&<button className="primary" onClick={()=>onProblem(related[0].id)}>Abrir el primero<ChevronRight size={17}/></button>}</div>{related.length?<><p>{related.length} {related.length===1?'inciso identificado':'incisos identificados'} en esta página. Abrí uno para escribir tu solución y ver las correcciones disponibles.</p><details><summary>Elegir un problema o inciso</summary><div className="book-page-problems">{related.map(problem=><button key={problem.id} onClick={()=>onProblem(problem.id)}><b>{problem.sectionCode} · {problem.number}{problem.part}</b><small>{problem.section} · impresa {problem.printedPage}{problem.review==='auxiliary'?' · transcripción auxiliar':''}</small><ChevronRight size={16}/></button>)}</div></details></>:<p>El catálogo no tiene incisos identificados en esta página. Podés seguir leyendo, tomar notas o elegir otra página.</p>}</section>
    {clips.length>0&&<section className="card clip-gallery"><h2>Mis recortes · {clips.length}</h2><p>Elegí uno para tener el enunciado al lado mientras resolvés.</p><div className="clip-list">{clips.map(c=><div key={c.id}><button className={c.id===pinned?'selected':''} aria-label={`Usar recorte ${c.title}`} onClick={()=>setPinned(c.id)}><img src={c.image} alt=""/><span>{c.title}<small>Tu PDF · página {c.page}</small></span><Pin size={16}/></button><button aria-label={`Borrar recorte ${c.title}`} onClick={()=>setClipToDelete(c)}><Trash2 size={18}/></button></div>)}</div></section>}
    <div className="book-solve-heading"><h2>Herramientas para pensar</h2><p>Si querés probar una transformación o inferencia, usá estas herramientas junto al libro. Para guardar la respuesta de un inciso, abrilo en Book Exam.</p></div>
    <div className={`book-workspace ${selectedClip?'with-clip':''}`}>
      {selectedClip&&<aside className="card pinned-clip"><span className="eyebrow">MI EJERCICIO REAL</span><h2>{selectedClip.title}</h2><small>Recorte de tu PDF · página {selectedClip.page}</small><a href={selectedClip.image} download={`ejercicio-${course}-p${selectedClip.page}.png`} className="clip-image" aria-label="Descargar imagen del ejercicio"><img src={selectedClip.image} alt={`${selectedClip.title}, enunciado original del libro`}/></a><div className="row wrap"><button className="secondary" onClick={()=>{setPage(Math.min(selectedClip.page,lastPage));viewer.current?.closest('section')?.scrollIntoView({behavior:'smooth'});}}>Ver página original</button><button onClick={()=>setPinned('')}>Desfijar</button></div></aside>}
      <div className="book-working"><div className="segments" role="group" aria-label="Tipo de herramienta"><button className={workspace==='steps'?'active':''} onClick={()=>setWorkspace('steps')}>Transformaciones</button>{course==='discreta'&&<button className={workspace==='proof'?'active':''} onClick={()=>setWorkspace('proof')}>Inferencias</button>}</div>{workspace==='steps'?<Workbench compact draftPrefix={`mate-book-${course}`} initialMode={course==='precalculo'?'algebra':'logic'}/>:<Proof/>}</div>
    </div><p className="notice">Un paso comprobado en estas herramientas no valida la solución completa. Book Exam guarda cada desarrollo; las prácticas revisadas ofrecen corrección y pistas.</p>
    <ConfirmDialog value={clipToDelete?{title:'¿Borrar este recorte?',message:`«${clipToDelete.title}» se quitará de tus recortes guardados.`,confirmLabel:'Borrar recorte',destructive:true,onConfirm:()=>void removeClip(clipToDelete)}:null} onClose={()=>setClipToDelete(null)}/>
  </div>;
}
