import { useState } from 'react';
import { emptyThree, emptyTwo, threeSetTotals, twoSetTotals, type ThreeRegions, type TwoRegions } from './vennCount';

type Mode = 'two' | 'three';

function RegionField({id, label, value, onChange}:{id:string;label:string;value:string;onChange:(value:string)=>void}) {
  return <label className="venn-scratch-field" htmlFor={id}><span>{label}</span><input id={id} inputMode="numeric" autoComplete="off" autoCapitalize="off" spellCheck={false} value={value} onChange={e=>onChange(e.target.value.replace(/[^\d]/g, ''))} placeholder="0"/></label>;
}

export function VennScratch({sets=3}:{sets?:2|3}) {
  const [mode,setMode]=useState<Mode>(sets===2?'two':'three');
  const [two,setTwo]=useState<TwoRegions>(emptyTwo);
  const [three,setThree]=useState<ThreeRegions>(emptyThree);
  const twoTotals=twoSetTotals(two);
  const threeTotals=threeSetTotals(three);
  function pick(next: Mode) {
    switch (next) {
      case 'two':
      case 'three':
        setMode(next);
        return;
      default: {
        const never: never = next;
        return never;
      }
    }
  }
  return <details className="venn-scratch">
    <summary>Borrador de regiones</summary>
    <p>Anotá los números de cada luna. La app suma |A|, la unión y el afuera; no califica este borrador.</p>
    <div className="venn-scratch-toggle" role="group" aria-label="Cantidad de conjuntos">
      <button type="button" className={mode==='two'?'selected':''} aria-pressed={mode==='two'} onClick={()=>pick('two')}>2 conjuntos</button>
      <button type="button" className={mode==='three'?'selected':''} aria-pressed={mode==='three'} onClick={()=>pick('three')}>3 conjuntos</button>
    </div>
    {mode==='two'?<div className="venn-scratch-grid two">
      <RegionField id="venn-only-a" label="Solo A" value={two.onlyA} onChange={onlyA=>setTwo(current=>({...current,onlyA}))}/>
      <RegionField id="venn-both" label="A ∩ B" value={two.both} onChange={both=>setTwo(current=>({...current,both}))}/>
      <RegionField id="venn-only-b" label="Solo B" value={two.onlyB} onChange={onlyB=>setTwo(current=>({...current,onlyB}))}/>
      <RegionField id="venn-out" label="Afuera" value={two.out} onChange={out=>setTwo(current=>({...current,out}))}/>
      <dl className="venn-scratch-totals">
        <div><dt>|A|</dt><dd>{twoTotals.a}</dd></div>
        <div><dt>|B|</dt><dd>{twoTotals.b}</dd></div>
        <div><dt>|A ∪ B|</dt><dd>{twoTotals.union}</dd></div>
        <div><dt>Universo</dt><dd>{twoTotals.total}</dd></div>
      </dl>
    </div>:<div className="venn-scratch-grid three">
      <RegionField id="venn3-only-a" label="Solo A" value={three.onlyA} onChange={onlyA=>setThree(current=>({...current,onlyA}))}/>
      <RegionField id="venn3-only-b" label="Solo B" value={three.onlyB} onChange={onlyB=>setThree(current=>({...current,onlyB}))}/>
      <RegionField id="venn3-only-c" label="Solo C" value={three.onlyC} onChange={onlyC=>setThree(current=>({...current,onlyC}))}/>
      <RegionField id="venn3-ab" label="A ∩ B" value={three.ab} onChange={ab=>setThree(current=>({...current,ab}))}/>
      <RegionField id="venn3-ac" label="A ∩ C" value={three.ac} onChange={ac=>setThree(current=>({...current,ac}))}/>
      <RegionField id="venn3-bc" label="B ∩ C" value={three.bc} onChange={bc=>setThree(current=>({...current,bc}))}/>
      <RegionField id="venn3-abc" label="A ∩ B ∩ C" value={three.abc} onChange={abc=>setThree(current=>({...current,abc}))}/>
      <RegionField id="venn3-out" label="Afuera" value={three.out} onChange={out=>setThree(current=>({...current,out}))}/>
      <dl className="venn-scratch-totals">
        <div><dt>|A|</dt><dd>{threeTotals.a}</dd></div>
        <div><dt>|B|</dt><dd>{threeTotals.b}</dd></div>
        <div><dt>|C|</dt><dd>{threeTotals.c}</dd></div>
        <div><dt>|A ∪ B ∪ C|</dt><dd>{threeTotals.union}</dd></div>
        <div><dt>Universo</dt><dd>{threeTotals.total}</dd></div>
      </dl>
    </div>}
    <small>Las lunas son “solo esa intersección”, no el |A ∩ B| del enunciado. Si el folio da el par, restale el triple antes de anotarlo.</small>
  </details>;
}
