import { useEffect,useState } from 'react';
export function useDraft<T>(key:string,initial:T,valid:(v:unknown)=>boolean) {
  const [value,setValue]=useState<T>(()=>{try{const raw=localStorage.getItem(key);if(raw){const data=JSON.parse(raw);if(valid(data))return data as T;}}catch{}return initial;});
  const [error,setError]=useState('');
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));setError('');}catch{setError('No se pudo guardar el borrador en este navegador.');}},[key,value]);
  return [value,setValue,error] as const;
}
export const validText=(v:unknown)=>typeof v==='string'&&v.length<5000;
