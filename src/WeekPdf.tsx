import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { Course } from './types';
import { saveWeekBook, storedWeekBook } from './bookStorage';

GlobalWorkerOptions.workerSrc = workerUrl;

export function WeekPdf({ course, week, label }: { course: Course; week: string; label: string }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [width, setWidth] = useState(300);
  const canvas = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const generation = useRef(0);
  const lastPage = pdf?.numPages ?? 1;

  useEffect(() => {
    const token = ++generation.current;
    setPdf(null);
    setStatus('');
    setLoading(true);
    setPage(1);
    storedWeekBook(course, week).then(async data => {
      if (token !== generation.current) return;
      if (!data) {
        setStatus('Cargá el PDF de esta semana una vez. Queda en este dispositivo, no en el repo.');
        return;
      }
      const doc = await getDocument({ data: new Uint8Array(data) }).promise;
      if (token !== generation.current) {
        await doc.destroy();
        return;
      }
      documentRef.current = doc;
      setPdf(doc);
      setPage(1);
    }).catch(() => {
      if (token === generation.current) setStatus('No se pudo abrir ese PDF. Cargalo de nuevo.');
    }).finally(() => {
      if (token === generation.current) setLoading(false);
    });
    const changed = (event: Event) => {
      const detail = (event as CustomEvent<{ course: Course; week: string }>).detail;
      if (detail?.course === course && detail?.week === week) setStatus('PDF de la semana actualizado.');
    };
    window.addEventListener('mate-week-book-changed', changed);
    return () => {
      generation.current += 1;
      window.removeEventListener('mate-week-book-changed', changed);
      void documentRef.current?.destroy();
      documentRef.current = null;
    };
  }, [course, week]);

  useEffect(() => {
    if (!viewer.current) return;
    const element = viewer.current;
    const observer = new ResizeObserver(() => setWidth(Math.max(200, element.clientWidth)));
    observer.observe(element);
    setWidth(Math.max(200, element.clientWidth));
    return () => observer.disconnect();
  }, [pdf]);

  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let cancelled = false;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    setBusy(true);
    pdf.getPage(page).then(rendered => {
      if (cancelled || !canvas.current) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const cssWidth = Math.min(1100, width);
      const viewport = rendered.getViewport({ scale: cssWidth / rendered.getViewport({ scale: 1 }).width * ratio });
      const target = canvas.current;
      target.width = Math.round(viewport.width);
      target.height = Math.round(viewport.height);
      target.style.width = `${cssWidth}px`;
      target.style.height = `${viewport.height / ratio}px`;
      task = rendered.render({ canvas: target, viewport });
      return task.promise;
    }).then(() => {
      if (!cancelled) setBusy(false);
    }).catch(() => {
      if (!cancelled) {
        setBusy(false);
        setStatus('No se pudo dibujar esta página.');
      }
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, page, width]);

  async function upload(file: File) {
    const token = ++generation.current;
    setLoading(true);
    setStatus('Cargando…');
    let doc: PDFDocumentProxy | null = null;
    try {
      if (file.size > 32 * 1024 * 1024) throw new Error('El archivo debe ser menor de 32 MB.');
      const data = await file.arrayBuffer();
      doc = await getDocument({ data: new Uint8Array(data.slice(0)) }).promise;
      if (token !== generation.current) {
        await doc.destroy();
        return;
      }
      await saveWeekBook(course, week, data);
      void navigator.storage?.persist?.().catch(() => false);
      if (token !== generation.current) {
        await doc.destroy();
        return;
      }
      const old = documentRef.current;
      documentRef.current = doc;
      setPdf(doc);
      setPage(1);
      if (old) setTimeout(() => void old.destroy(), 0);
      setStatus(`PDF de ${week} guardado en este dispositivo.`);
    } catch (error) {
      if (doc && doc !== documentRef.current) await doc.destroy();
      if (token === generation.current) setStatus(error instanceof Error ? error.message : 'No se pudo cargar el PDF.');
    } finally {
      if (token === generation.current) setLoading(false);
    }
  }

  return (
    <section className="week-pdf">
      <p>Folio de {label}. Cargalo una vez: se lee aquí, en este dispositivo.</p>
      <label className="upload">
        <Upload size={18}/>
        {loading ? 'Cargando…' : pdf ? 'Cambiar folio' : 'Cargar folio de la semana'}
        <input disabled={loading} type="file" accept="application/pdf,.pdf" aria-label={`Importar PDF de ${week}`} onChange={event => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = '';
        }}/>
      </label>
      {status && <small role="status">{status}</small>}
      {pdf ? (
        <section className="card pdf-viewer">
          <nav className="pdf-toolbar" aria-label={`Páginas de ${week}`}>
            <button type="button" aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft/></button>
            <label>Página<input aria-label={`Página PDF de ${week}`} type="number" min={1} max={lastPage} value={page} onChange={event => {
              const next = Number(event.target.value);
              if (Number.isInteger(next) && next >= 1 && next <= lastPage) setPage(next);
            }}/></label>
            <span>de {lastPage}</span>
            <button type="button" aria-label="Página siguiente" disabled={page >= lastPage} onClick={() => setPage(page + 1)}><ChevronRight/></button>
          </nav>
          {busy && <small role="status">Preparando página…</small>}
          <div className="pdf-canvas" ref={viewer}><div className="pdf-sheet"><canvas ref={canvas} aria-label={`Página ${page} de ${week}`}/></div></div>
        </section>
      ) : (
        <section className="card empty"><BookOpen size={36}/><p>Cuando cargues el folio de esta semana, se lee aquí.</p></section>
      )}
    </section>
  );
}
