export interface MathPart { start:number; end:number; power:boolean; text:string; }
const raised='⁰¹²³⁴⁵⁶⁷⁸⁹';
export function canonicalMath(value:string) {
  return value.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,s=>'^'+[...s].map(c=>raised.indexOf(c)).join('')).replace(/[×·]/g,'*').replace(/÷/g,'/');
}
// Keep source offsets so changing a displayed exponent never changes its meaning.
export function mathParts(value:string):MathPart[] {
  const parts:MathPart[]=[];let i=0;
  while(i<value.length){
    if(value[i]!=='^'){parts.push({start:i,end:i+1,power:false,text:value[i]==='*'?'×':value[i]==='/'?'÷':value[i]==='-'?'−':value[i]});i++;continue;}
    const start=i++;let end=i;
    if(/[+−-]/.test(value[end]||''))end++;
    if(value[end]==='('){let depth=0;do{if(value[end]==='(')depth++;if(value[end]===')')depth--;end++;}while(end<value.length&&depth>0);}
    else {const match=value.slice(end).match(/^(?:\d+(?:\.\d+)?|[a-zA-Z])/);if(match)end+=match[0].length;}
    parts.push({start,end:Math.max(start+1,end),power:true,text:value.slice(i,end)||'□'});i=Math.max(i,end);
  }
  return parts;
}
export function replaceMathSelection(value:string,start:number,end:number,token:string,inside?:number) {
  const text=canonicalMath(token);return {value:value.slice(0,start)+text+value.slice(end),cursor:start+(inside??text.length)};
}
