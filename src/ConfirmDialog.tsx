import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface Confirmation {
  title:string;
  message:string;
  confirmLabel:string;
  destructive?:boolean;
  onConfirm:()=>void;
}

export function ConfirmDialog({value,onClose}:{value:Confirmation|null;onClose:()=>void}) {
  const cancel=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(!value)return;const previous=document.activeElement as HTMLElement|null;cancel.current?.focus();function key(e:KeyboardEvent){if(e.key==='Escape'){e.preventDefault();onClose();}if(e.key==='Tab'){const buttons=[...document.querySelectorAll<HTMLButtonElement>('.confirm-dialog button')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);previous?.focus();};},[value,onClose]);
  if(!value)return null;
  return <div className="confirm-overlay" onPointerDown={e=>{if(e.target===e.currentTarget)onClose();}}><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message"><button className="confirm-close" aria-label="Cerrar" onClick={onClose}><X size={20}/></button><span className="confirm-icon"><AlertTriangle size={26}/></span><h2 id="confirm-title">{value.title}</h2><p id="confirm-message">{value.message}</p><div className="confirm-actions"><button ref={cancel} className="secondary" onClick={onClose}>Seguir aquí</button><button className={value.destructive?'danger':'primary'} onClick={()=>{onClose();value.onConfirm();}}>{value.confirmLabel}</button></div></section></div>;
}
