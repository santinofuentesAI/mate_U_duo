import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Dialog({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
  const id=useId(),panel=useRef<HTMLElement>(null),close=useRef(onClose);close.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keyboard=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();close.current();}
      if(e.key==='Tab'){
        const controls=panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]');
        if(!controls?.length)return;const first=controls[0],last=controls[controls.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',keyboard);
    return()=>{document.removeEventListener('keydown',keyboard);document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return <div className="modal-backdrop" onClick={()=>onClose()}><section className="modal" ref={panel} role="dialog" aria-modal="true" aria-labelledby={id} onClick={e=>e.stopPropagation()}><div className="row"><h2 id={id}>{title}</h2><button onClick={()=>onClose()} aria-label="Cerrar recorte"><X size={21}/></button></div>{children}</section></div>;
}
