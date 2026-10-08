import { useState } from 'react';
import { ArrowRight, Check, Search, Sparkles } from 'lucide-react';
import type { Lesson, Progress } from './types';
import { lessonWeekLabel } from './bookScope';
import { TopicIcon } from './TopicIcon';

export function LearningPath({path,progress:p,onStart}:{path:Lesson[];progress:Progress;onStart:(l:Lesson)=>void;onFavorite:(id:string)=>void}) {
  const [exploring,setExploring]=useState(false),[search,setSearch]=useState('');
  const next=path.find(l=>!p.completed.includes(l.id))||path[0];
  if(!next)return null;
  const units=[...new Set(path.map(l=>l.unit))];
  const currentUnit=path.filter(l=>l.unit===next.unit);
  const remaining=currentUnit.filter(l=>l.id!==next.id);
  const normalized=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const results=path.filter(l=>normalized(`${l.title} ${l.unit} ${l.description}`).includes(normalized(search)));
  const complete=p.completed.includes(next.id);
  const done=path.filter(l=>p.completed.includes(l.id)).length;
  return <section className="learning-route learning-simple">
    <header className="learning-simple-heading"><div><span className="eyebrow">TU CAMINO</span><h1>Aprender</h1></div><span>{done} de {path.length} lecciones</span></header>
    <div className="learning-simple-unit"><span>{next.unit.split(' · ')[0]}</span><b>{next.unit.split(' · ')[1]||next.unit}</b></div>
    <article className="learning-next"><span className="learning-next-icon"><TopicIcon name={next.icon} topic={next.title} size={38}/></span><span className="learning-next-tag"><Sparkles size={15}/> {complete?'Para repasar':'Siguiente lección'}</span><h2>{next.title}</h2><p>{next.description}</p><button className="primary wide" onClick={()=>onStart(next)}>{complete?'Repasar lección':'Empezar lección'}<ArrowRight size={19}/></button><small>{lessonWeekLabel(next)} · {next.minutes} min</small></article>
    {remaining.length>0&&<div className="learning-simple-list"><h3>Esta unidad</h3>{remaining.map(l=><button key={l.id} onClick={()=>onStart(l)}><span className={p.completed.includes(l.id)?'done':''}>{p.completed.includes(l.id)?<Check size={18}/>:<TopicIcon name={l.icon} topic={l.title} size={20}/>}</span><b>{l.title}</b><small>{p.completed.includes(l.id)?'Visto':'Abrir'}</small><ArrowRight size={17}/></button>)}</div>}
    <button className="learning-explore-button" aria-expanded={exploring} onClick={()=>setExploring(v=>!v)}>{exploring?'Cerrar temas':'Ver todos los temas'}<ArrowRight size={17}/></button>
    {exploring&&<div className="learning-explorer"><label className="simple-search"><Search size={18}/><input aria-label="Buscar un nivel" placeholder="Buscar un tema…" value={search} onChange={e=>setSearch(e.target.value)}/></label>{units.filter(u=>results.some(l=>l.unit===u)).map(u=><section key={u}><h3>{u}</h3>{results.filter(l=>l.unit===u).map(l=><button key={l.id} onClick={()=>onStart(l)}><span>{p.completed.includes(l.id)?<Check size={18}/>:<TopicIcon name={l.icon} topic={l.title} size={20}/>}</span><b>{l.title}</b><ArrowRight size={17}/></button>)}</section>)}{!results.length&&<p>No encontré ese tema. Probá otra palabra.</p>}</div>}
  </section>;
}
