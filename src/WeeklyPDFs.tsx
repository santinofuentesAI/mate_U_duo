import { useState } from 'react';
import { FileText, Upload, BookOpen, ArrowRight } from 'lucide-react';
import type { Course } from './types';

interface WeekPDF {
  week: number;
  title: string;
  filename: string;
  loaded: boolean;
}

interface Props {
  course: Course;
  onOpenPDF: (week: number) => void;
}

export function WeeklyPDFs({ course, onOpenPDF }: Props) {
  const [customPDFs, setCustomPDFs] = useState<Record<number, File>>({});
  
  // Define available weeks per course
  const weeks: WeekPDF[] = course === 'discreta' ? [
    { week: 0, title: 'Introducción', filename: 'discreta-intro.pdf', loaded: false },
    { week: 1, title: 'Semana 1: Lógica proposicional', filename: 'discreta-s1.pdf', loaded: false },
    { week: 2, title: 'Semana 2: Circuitos e inferencia', filename: 'discreta-s2.pdf', loaded: false },
    { week: 3, title: 'Semana 3: Predicados', filename: 'discreta-s3.pdf', loaded: false },
    { week: 4, title: 'Semana 4: Conjuntos', filename: 'discreta-s4.pdf', loaded: false },
    { week: 5, title: 'Semana 5: Próximamente', filename: '', loaded: false },
    { week: 6, title: 'Semana 6: Próximamente', filename: '', loaded: false },
  ] : [
    { week: 1, title: 'Bloque 1: Números reales', filename: 'precalculo-b1.pdf', loaded: false },
    { week: 2, title: 'Bloque 2: Expresiones algebraicas', filename: 'precalculo-b2.pdf', loaded: false },
    { week: 3, title: 'Bloque 3: Factorización', filename: 'precalculo-b3.pdf', loaded: false },
    { week: 4, title: 'Bloque 4: Fracciones algebraicas', filename: 'precalculo-b4.pdf', loaded: false },
    { week: 5, title: 'Bloque 5: Ecuaciones', filename: 'precalculo-b5.pdf', loaded: false },
    { week: 6, title: 'Bloque 6: Próximamente', filename: '', loaded: false },
  ];

  const handleFileUpload = (week: number, file: File) => {
    if (file.type === 'application/pdf') {
      setCustomPDFs({ ...customPDFs, [week]: file });
      // Save to localStorage for persistence
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem(`weekly-pdf-${course}-week${week}`, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openWeekPDF = async (week: number) => {
    // Check if custom PDF exists in localStorage
    const stored = localStorage.getItem(`weekly-pdf-${course}-week${week}`);
    if (stored) {
      const blob = await (await fetch(stored)).blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      return;
    }
    
    // Try to load from public/semanas/ folder
    const weekInfo = weeks.find(w => w.week === week);
    if (weekInfo?.filename) {
      try {
        const response = await fetch(`/semanas/${weekInfo.filename}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          return;
        }
      } catch (e) {
        console.log('PDF not found in public folder');
      }
    }
    
    onOpenPDF(week);
  };

  return (
    <div className="weekly-pdfs">
      <div className="weekly-pdfs-header">
        <BookOpen size={24}/>
        <div>
          <h2>Material por semana</h2>
          <p>PDFs organizados por semana del curso</p>
        </div>
      </div>

      <div className="weekly-pdfs-grid">
        {weeks.map(week => (
          <div 
            key={week.week} 
            className={`weekly-pdf-card ${!week.filename && !customPDFs[week.week] ? 'coming-soon' : ''}`}
          >
            <div className="weekly-pdf-icon">
              <FileText size={32}/>
            </div>
            <div className="weekly-pdf-info">
              <h3>{week.title}</h3>
              {customPDFs[week.week] && (
                <small className="custom-badge">PDF personalizado</small>
              )}
            </div>
            
            {!week.filename && !customPDFs[week.week] ? (
              <div className="weekly-pdf-actions">
                <label className="upload-btn">
                  <Upload size={16}/>
                  Subir PDF
                  <input 
                    type="file" 
                    accept="application/pdf"
                    hidden
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(week.week, file);
                    }}
                  />
                </label>
                {week.week > 4 && <span className="coming-soon-badge">Próximamente</span>}
              </div>
            ) : (
              <div className="weekly-pdf-actions">
                <button 
                  className="primary compact"
                  onClick={() => openWeekPDF(week.week)}
                >
                  Abrir PDF
                  <ArrowRight size={16}/>
                </button>
                {!customPDFs[week.week] && (
                  <label className="upload-btn secondary">
                    <Upload size={14}/>
                    Reemplazar
                    <input 
                      type="file" 
                      accept="application/pdf"
                      hidden
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(week.week, file);
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <details className="weekly-pdfs-help">
        <summary>ℹ️ Cómo agregar tus propios PDFs</summary>
        <div>
          <p><b>Para instructores:</b> Hay dos formas de agregar PDFs por semana:</p>
          <ol>
            <li><b>Desde la app (recomendado para uso personal):</b> Hacé clic en "Subir PDF" en cualquier semana. El archivo se guarda localmente en tu navegador.</li>
            <li><b>Desde el servidor (para todos los usuarios):</b> Colocá los archivos PDF en la carpeta <code>public/semanas/</code> con los nombres:
              <ul>
                <li><code>discreta-intro.pdf</code>, <code>discreta-s1.pdf</code>, <code>discreta-s2.pdf</code>, etc.</li>
                <li><code>precalculo-b1.pdf</code>, <code>precalculo-b2.pdf</code>, etc.</li>
              </ul>
              Los PDFs en <code>public/semanas/</code> están disponibles para todos automáticamente.
            </li>
          </ol>
          <p><b>Para estudiantes:</b> Si tu instructor no subió los PDFs al servidor, podés subir tus propias copias usando el botón "Subir PDF".</p>
        </div>
      </details>
    </div>
  );
}
