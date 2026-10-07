"""Visual transcription of section 1.4 (PDF 73–78), common dependencies included."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(n,part=''):return next(a for a in ds if a['sectionCode']=='1.4' and a['number']==n and a['part']==part)
# Each tuple is (conclusion, premises), in the printed order.
arguments=[
(r'P',[r'(\neg P\lor\neg Q)\to(R\land S)',r'R\to T',r'\neg T']),
(r'P\land Q',[r'Q\to\neg R',r'P\lor R',r'Q']),
(r'D',[r'A\to(B\lor C)',r'B\to C',r'A\lor D',r'\neg C']),
(r'U',[r'P\to Q',r'Q\to(R\land S)',r'\neg R\lor\neg T\lor U',r'P\land T']),
(r'R\land(P\lor Q)',[r'P\lor Q',r'Q\to R',r'P\to T',r'\neg T']),
(r'\neg(L\land D)',[r'V\to(R\lor P)',r'R\to\neg V',r'L\to\neg P',r'V']),
(r'Q\lor T',[r'P\to Q',r'\neg R\to(S\to T)',r'R\lor P\lor S',r'\neg R']),
(r'T',[r'(P\lor Q)\to(R\land S)',r'\neg(\neg P\lor\neg R)',r'\neg T\to\neg(P\land S)']),
(r'\neg U',[r'(Q\land R)\to\neg P',r'\neg Q\to S',r'R\lor T',r'P',r'U\to(\neg S\land\neg T)']),
(r'P',[r'(\neg P\lor Q)\to R',r'R\to(S\lor T)',r'\neg S\land\neg U',r'\neg U\to\neg T']),
(r'\neg(T\land\neg U)',[r'(R\lor Q)\to\neg T',r'\neg Q\lor R',r'P\lor Q',r'P\to(R\land S)']),
(r'F_0',[r'(S\lor T)\lor(T\land K)',r'\neg(T\land K)',r'\neg T',r'(R\lor S)\to(T\land K)']),
(r'\neg R\to\neg T',[r'P\to(Q\to R)',r'P\lor S',r'T\to Q',r'\neg S']),
(r'\neg(T\to A)',[r'E',r'\neg P\lor Q',r'E\to(B\land\neg Q)',r'A\to(P\land C)',r'T']),
(r'S\lor\neg T',[r'P\land\neg R',r'(R\to S)\to(P\to Q)',r'(Q\lor T)\to(S\lor R)']),
(r'x=5',[r'z>x\to x<7',r'(x<6\lor x=3)\to z>x',r'x<6\land z=8',r'x\ge7\lor x=5']),
(r'T\to A',[r'Q\to S',r'\neg P\to Q',r'P\to(R\land S)',r'A\lor\neg S'])]
for part,(conclusion,premises) in zip('abcdefghijklmnopq',arguments):
 a=get(1,part);a['text']='Demuestre la conclusión a partir de las premisas dadas. Justifique cada paso.';a['mathLines']=premises+[r'\therefore '+conclusion];a['review']='reviewed'
for part,formula in [('a',r'[(P\to Q)\land(P\lor(T\land S))\land(Q\to R)\land(\neg R)]\Rightarrow S'),('b',r'[(P\lor Q)\land(\neg R\lor\neg P)\land(S\to R)\land(T\lor S)\land(R\to\neg Q)]\Rightarrow T')]:
 a=get(2,part);a['text']='Demuestre la proposición usando reglas de inferencia y leyes de la lógica. Justifique cada paso.';a['math']=formula;a['review']='reviewed'
for a in ds:
 if a['sectionCode']=='1.4' and a['number']==3:a['review']='reviewed'
a=get(4);a['text']='Verifique que el siguiente argumento no es válido.';a['mathLines']=[r'P',r'P\lor Q',r'Q\to(R\to S)',r'T\to R',r'\therefore\neg S\to\neg T'];a['review']='reviewed'
for n in [5,6,7,9,10,11,12]:get(n)['review']='reviewed'
a=get(8);a['instruction']='Sistema del ejemplo 33 (PDF 72, impresa 70): símbolos M, I, U; axioma MI. Reglas: 1) triplicar una palabra; 2) reemplazar U por II; 3) eliminar IIII; 4) insertar U después de M; 5) en IMU quitar M.'
a['text']='Demuestre que son admisibles MIM, MUIM, MIIIMII, MIU, MUMI, MMIII, MIIIM, MIMUU y MUUIIUMIII. Además, demuestre que no es posible deducir MU.'
a['review']='reviewed';a['sourcePages']=[72,77];a['visuals'].insert(0,{'page':72,'crop':{'x':.13,'y':.245,'width':.76,'height':.35}})
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('Reviewed Discreta:',sum(a['review']=='reviewed' for a in ds))
