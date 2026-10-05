import { useState } from 'react';
import { ArrowRight, BookOpen, Check, Search } from 'lucide-react';
import type { Progress } from './types';
import { latestAttempts, type PracticeItem } from './learning';
import { TopicIcon } from './TopicIcon';
export function BookPractice({items,progress:p,count,onStart}:{items:PracticeItem[];progress:Progress;count:number;onStart:(items:PracticeItem[],title:string,mode:string)=>void}) {
  const [topic,setTopic]=useState('all'),[search,setSearch]=useState(''),[expanded,setExpanded]=useState(false),[allTopics,setAllTopics]=useState(false);
  const units=[...new Set(items.map(i=>i.lesson.unit))],last=latestAttempts(p);
  const normalized=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered=items.filter(i=>(topic==='all'||i.lesson.unit===topic)&&normalized(`${i.lesson.title} ${i.question.prompt} ${i.question.bookSource!.section} ${i.question.bookSource!.exercise} ${i.question.bookSource!.page}`).includes(normalized(search)));
  const topics=[...new Set(filtered.map(i=>i.lesson.id))];
  const visibleTopics=allTopics||search||topic!=='all'?topics:topics.slice(0,4);
  const solved=items.filter(i=>last.get(i.question.id)?.correct).length;
  return <section className="card book-practice" aria-label="Práctica del libro"><header className="book-practice-heading"><span className="book-practice-emblem"><BookOpen size={34} strokeWidth={2.8}/><span>✦</span></span><div><span className="eyebrow">DEL LIBRO A TUS MANOS</span><h2>Práctica del libro</h2><p>{items.length} actividades seleccionadas · {solved} resueltas</p></div><span className="book-count">{items.length}</span></header>
    <p>El inciso original, una forma de resolverlo tocando la pantalla y una explicación para entenderlo. Los recortes aparecen al cargar tu PDF.</p>
    <div className="book-catalog-tools"><label className="route-search"><Search size={18}/><input aria-label="Buscar ejercicios del libro" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tema, inciso o página…"/></label><label>Semana o bloque<select aria-label="Bloque del libro" value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">Todos los bloques</option>{units.map(u=><option key={u}>{u}</option>)}</select></label></div>
    <div className="book-topic-grid">{visibleTopics.map(id=>{const group=filtered.filter(i=>i.lesson.id===id),l=group[0].lesson;return <button className="book-topic" key={id} aria-label={`Practicar libro: ${l.title}`} onClick={()=>onStart(group.slice(0,count),`Libro · ${l.title}`,'book')}><span className="book-topic-icon"><TopicIcon name={l.icon} topic={l.title} size={32}/></span><span><b>{l.title}</b><small>{group.length} actividades · PDF {Math.min(...group.map(i=>i.question.bookSource!.page))}{Math.min(...group.map(i=>i.question.bookSource!.page))!==Math.max(...group.map(i=>i.question.bookSource!.page))?`–${Math.max(...group.map(i=>i.question.bookSource!.page))}`:''}</small></span><ArrowRight size={17}/></button>;})}</div>
    {topics.length>4&&!search&&topic==='all'&&<button className="text-button" aria-expanded={allTopics} onClick={()=>setAllTopics(!allTopics)}>{allTopics?'Mostrar menos temas':`Ver los ${topics.length} temas del libro`}</button>}
    {!filtered.length&&<p className="notice" role="status">No hay ejercicios con ese filtro. Probá otro tema o página.</p>}
    <div className="book-catalog-actions"><button className="primary" disabled={!filtered.length} onClick={()=>onStart(filtered.slice(0,count),'Práctica del libro','book')}>Practicar selección · {Math.min(count,filtered.length)}<ArrowRight size={18}/></button><button className="secondary" aria-expanded={expanded} aria-controls="book-exercise-list" onClick={()=>setExpanded(!expanded)}>{expanded?'Ocultar incisos':'Elegir un inciso'}</button></div>
    {expanded&&<div id="book-exercise-list" className="book-exercise-list">{filtered.map(i=>{const s=i.question.bookSource!,correct=last.get(i.question.id)?.correct;return <button key={i.question.id} aria-label={`Resolver ${s.exercise} · página ${s.page}`} onClick={()=>onStart([i],`Libro · ${s.section} · ${s.exercise.replace('-tabla','')}`,'book')}><span className={`book-item-status ${correct?'done':''}`}>{correct?<Check size={18}/>:<BookOpen size={18}/>}</span><span><b>{i.lesson.title}</b><small>{s.section} · {s.exercise.replace('-tabla','')}{s.adaptation?' · guiado':''} · PDF {s.page}</small></span><ArrowRight size={17}/></button>;})}</div>}
    <small>Selección revisada dentro del temario actual. Los incisos del libro completo se siguen consultando en «Mi libro».</small>
  </section>;
}
