"""Decimal periods, Venn statements, cardinality givens and common theorem dependencies."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(code,n,part=''):return next(a for a in ds if a['sectionCode']==code and a['number']==n and a['part']==part)
def math(code,n,part,v,text=''):
 a=get(code,n,part);a['math']=v;a['text']=text;a['review']='reviewed'
def dependency(a,page,crop):
 a['sourcePages']=sorted(set(a['sourcePages']+[page]));a['visuals'].insert(0,{'page':page,'crop':crop})
# Horizontal overbar endpoints were checked to avoid changing the repeating block.
for part,v in zip('abcdefg',[r'1{,}\overline{52}',r'1{,}5\overline2',r'5{,}4\overline{561}',r'0{,}3\overline{46}',r'5{,}22\overline{681}',r'37{,}344\overline{57}',r'267{,}3457\overline{68923}']):math('2.2',2,part,v)
for part,v in [('a',r'56{,}23\overline{374}'),('b',r'2573{,}343\overline{48}')]:math('2.2',4,part,v)
# A and B here denote concatenated digit strings interpreted as integers.
theorem=r'a_k\cdots a_0{,}b_1\cdots b_j\overline{c_1\cdots c_i}=\frac{(a_k\cdots a_0b_1\cdots b_jc_1\cdots c_i)-(a_k\cdots a_0b_1\cdots b_j)}{(10^i-1)\,10^j}'
a=get('2.2',3);a['text']='Demuestre el teorema 1: representación racional de un decimal periódico. Los grupos de dígitos en el numerador representan enteros por concatenación.';a['contextMath']=theorem;a['review']='reviewed'
for a in ds:
 if a['sectionCode']=='2.2' and a['number'] in [3,4]:
  if a['number']==4:a['instruction']='Utilice la fórmula del teorema 1 para determinar la representación racional. Los grupos de dígitos representan enteros por concatenación.';a['contextMath']=theorem
  dependency(a,131,{'x':.13,'y':.36,'width':.76,'height':.17})
for part,v in zip('abcde',['7, 8, X, 13, 17','3, X, 31, 95, 283, 851','17, 19, 22, 16, X, 13, 32','2, 5, 15, 18, 54, 57, 171, X','60, 30, 28, X, 12, 6, 4']):
 a=get('1.1',10,part);a['text']=v;a['review']='reviewed';a['instruction']='Determine el número que falta en la serie. Los guiones del libro se muestran como separadores, no como signos negativos.'
a=get('1.1',10,'f');a['text']='Determine el número que falta en el arreglo.';a['table']={'headers':['1','2','3','4','5','6','7','8'],'rows':[['2','3','6','9','36','41','246','X']]};a['review']='reviewed'
for n,v in [(25,r'\begin{array}{rrrrr}&T&R&E&S\\&T&R&E&S\\+&T&R&E&S\\\hline N&U&E&V&E\end{array}'),(26,r'\begin{array}{rrrrr}&S&E&N&D\\+&M&O&R&E\\\hline M&O&N&E&Y\end{array}')]:math('1.1',n,'',v,'Encuentre el dígito asociado con cada letra para que la suma sea aritméticamente correcta y cada letra quede asociada con un solo dígito.')
# Venn drawing is the requested output, not supplied data lost by extraction.
math('2.3',1,'',r'(A-B)\cup(B\cap C)','Represente el conjunto en un Diagrama de Venn.')
for a in ds:
 if a['sectionCode']=='2.3' and a['number']==2:a['review']='reviewed'
math('2.3',3,'',r'A\cap B=\varnothing,\quad A\cap C\ne\varnothing,\quad B\subseteq C,\quad D\subseteq A,\quad D\subseteq\overline C','Represente A, B, C y D en un Diagrama de Venn que satisfaga estas condiciones.')
math('2.3',4,'',r'A\cap B\ne\varnothing,\quad A\cap C=\varnothing,\quad B\cap C\ne\varnothing,\quad D\subseteq\overline{B\cap C}','Represente A, B, C y D en un Diagrama de Venn que satisfaga estas condiciones.')
math('2.3',5,'',r'[(A-C)-B]\cup(B-\overline C)','Si A ∩ B ∩ C ≠ ∅, represente el conjunto en un Diagrama de Venn.')
math('2.3',6,'',r'[(B\cup C)\cap(A\cup B)]-\overline B=[(A\triangle B)\cap(C\cup B)]\cup(A\cap B)','Si A ∩ B ∩ C ≠ ∅, verifique con un Diagrama de Venn que esta igualdad es falsa. ¿Bajo cuáles condiciones podría tenerse la igualdad?')
math('2.3',7,'',r'[A\cup(B\cap C)]\cup(\overline B\cap C)=A\cup C','Verifique mediante Diagramas de Venn que la igualdad es verdadera.')
math('2.3',8,'',r'C\subseteq\overline A\quad\land\quad C\cap\overline B=\varnothing\quad\Rightarrow\quad C\subseteq B-A','Compruebe la proposición para conjuntos A, B y C.')
# Survey prose and all shared numeric givens were checked against PDF 148–150.
for a in ds:
 if a['sectionCode']=='2.5' and a['number']<=7:a['review']='reviewed'
expr={8:[r'|P(A)\times P(B)|',r'|P(A\times B)|'],9:[r'|P(A)\times B|',r'|P(A\times B)|',r'|A\times P(B)|',r'|P(P(P(A)))|'],10:[r'|P(B-A)\times A|',r'|P((A\cup B)\times(A-B))|',r'|P(P(A))|'],11:[r'P(A)\times B',r'(A-C)\times P(A)\times P(B)'],13:[r'(A-B)\times P(C-A)',r'P[(A\cap C)\times C]'],14:[r'(A-(B\cup C))\times P(A-C)',r'P[(A\cap C)\times C]'],17:[r'A\subseteq P(A)',r'|P(A)|=64',r'|P(P(P(A)))|=16',r'|P(A\cup P(A))|=64',r'|P(A\cup P(A))|=32',r'|P(A)-A|=15']}
for n,values in expr.items():
 for part,v in zip('abcdef',values):math('2.5',n,part,v,'Muestre, si es posible, un conjunto A que cumpla la condición.' if n==17 else ('Calcule la cardinalidad de este conjunto.' if n in [11,13,14] else ''))
math('2.5',12,'',r'(C-A)\times P(\overline{B\cup C})','A = {0}, B = {2,4}, C = {0,3,4,5}. Calcule la cardinalidad del conjunto.')
math('2.5',15,'',r'\overline{P(A\times B)}','A = {w,2}, B = {2,3}, universo U = {2,3,w}. ¿Cuántos elementos tiene el conjunto? El original muestra la barra sobre toda la expresión P(A × B); no hay clave validada y la interpretación del universo para este complemento requiere revisión.')
math('2.5',16,'',r'P(A\cap D)\times(B\cup D)\times P(A\cup D)','A, B, D son conjuntos arbitrarios: |A| = 3, |B| = 3, |A ∩ B| = 1, |B − D| = 2, |D| = 4. Calcule la cardinalidad del conjunto.')
f1=r'|A\cup B|=|A|+|B|-|A\cap B|'
f2=r'|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|'
for n in [18,19]:
 a=get('2.5',n);a['contextMath']=r'\begin{aligned}'+f1+r'\\'+f2+r'\end{aligned}';a['review']='reviewed'
 dependency(a,143,{'x':.13,'y':.84,'width':.76,'height':.075});dependency(a,145,{'x':.13,'y':.16,'width':.76,'height':.14})
# Natural language states exactly which theorem is used, without dropping its data.
get('2.5',18)['text']='Utilice la fórmula (2.1), para dos conjuntos, para demostrar la fórmula (2.2), para tres conjuntos.'
math('2.5',19,'',r'|A\cup B\cup C\cup D|','Con base en las fórmulas (2.1) y (2.2), conjeture una fórmula para esta cardinalidad.')
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('Reviewed Discreta:',sum(a['review']=='reviewed' for a in ds))
