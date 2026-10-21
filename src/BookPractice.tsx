import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Progress } from './types';
import { latestAttempts, type PracticeItem } from './learning';
import { ChoiceList, Fold } from './InApp';

export function BookPractice({items,progress:p,count,onStart}:{items:PracticeItem[];progress:Progress;count:number;onStart:(items:PracticeItem[],title:string,mode:string)=>void}) {
  const [topic,setTopic]=useState('all'),[search,setSearch]=useState('');
  const units=[...new Set(items.map(i=>i.lesson.unit))],last=latestAttempts(p);
  const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered=items.filter(i=>(topic==='all'||i.lesson.unit===topic)&&norm(`${i.lesson.title} ${i.question.prompt} ${i.question.bookSource!.exercise} ${i.question.bookSource!.page}`).includes(norm(search)));
  return <section className="simple-feature" aria-label="Prácticas corregidas">
    <div><h2>Elegí qué practicar</h2><p>{items.length} actividades con respuesta revisada. La app corrige esta modalidad guiada.</p></div>
    <ChoiceList label="Tema" name="Tema de prácticas corregidas" value={topic} onChange={setTopic} options={[{value:'all',label:'Todos los temas'},...units.map(u=>({value:u,label:u}))]}/>
    <button className="primary" disabled={!filtered.length} onClick={()=>onStart(filtered.slice(0,count),'Práctica corregida del libro','book')}>Empezar {Math.min(count,filtered.length)} ejercicios <ArrowRight size={18}/></button>
    <Fold title="Elegir un inciso concreto"><input aria-label="Buscar inciso revisado" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Número, tema o página…"/><div className="simple-link-list">{filtered.map(i=>{const s=i.question.bookSource!,correct=last.get(i.question.id)?.correct;return <button key={i.question.id} onClick={()=>onStart([i],`Libro · ${s.section} · ${s.exercise.replace('-tabla','')}`,'book')}><b>{correct?'✓ ':''}{i.lesson.title} · {s.exercise.replace('-tabla','')}</b><span>PDF {s.page}{correct?' · validado en práctica':''}</span></button>;})}</div>{!filtered.length&&<p>No hay incisos con ese filtro.</p>}</Fold>
  </section>;
}
