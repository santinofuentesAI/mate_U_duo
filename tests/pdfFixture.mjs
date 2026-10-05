// Original test material, never a copy of a textbook. Keeps crop QA runnable in CI.
export function pdfFixture(pages=1) {
  const pageIds=Array.from({length:pages},(_,i)=>3+i),fontId=3+pages,contentIds=Array.from({length:pages},(_,i)=>fontId+1+i);
  const text=(n)=>`BT /F1 24 Tf 40 740 Td (Practice page ${n}: logical transformations) Tj 0 -50 Td /F1 18 Tf (1. Transform NOT\\(P AND Q\\) using De Morgan.) Tj 0 -50 Td (2. Name the law used on each line.) Tj ET`;
  const objects=[
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] /Count ${pages} >>`,
    ...pageIds.map((id,i)=>`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`),
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ...contentIds.map((_,i)=>{const value=text(i+1);return `<< /Length ${Buffer.byteLength(value)} >>\nstream\n${value}\nendstream`;})
  ];
  let pdf='%PDF-1.4\n', offsets=[0];
  for(let i=0;i<objects.length;i++){offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=Buffer.byteLength(pdf);
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(x=>String(x).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return {name:'practice.pdf',mimeType:'application/pdf',buffer:Buffer.from(pdf)};
}
