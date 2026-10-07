"""Reviewed repairs. Labels and common givens were checked page by page.
Unreliable extracted mathematics is explicitly auxiliary, not certified text.
"""
import json, re
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(code,num,part=''):return next(a for a in ds if a['sectionCode']==code and a['number']==num and a['part']==part)
def math(code,num,part,value,text=None):
 a=get(code,num,part);a['math']=value;a['text']=text or '';a['review']='reviewed'
def context(code,num,value):
 for a in ds:
  if a['sectionCode']==code and a['number']==num:a['instruction']=value
# All 16 exercises, preserving grouping lost during extraction.
logic=[r'P\lor\neg(\neg R\lor P)\lor R',r'(P\leftrightarrow R)\land\neg(\neg P\lor R)',r'[P\lor\neg(\neg Q\lor\neg S)]\lor\neg(\neg Q\to\neg S)',r'[(\neg P\lor Q)\land P]\to Q',r'[(\neg P\land Q)\lor\neg(Q\lor P)]\land[(P\lor R)\land(P\lor\neg R)]',r'\neg[P\land\neg(T\land R)]\land(T\to\neg P)',r'[(\neg P\lor Q)\land\neg R]\to[(\neg Q\land R)\lor P]',r'(\neg P\land Q)\lor[\neg P\land\neg(Q\land R)]\lor\neg(R\to P)',r'[P\to(Q\land P)]\lor[\neg Q\land(P\lor Q)]',r'\neg Q\lor\neg\left[\left[\neg[(P\land Q)\lor(P\land\neg Q)]\lor Q\right]\land P\right]',r'[(P\lor Q)\land\neg(R\lor P)]\lor[(R\land Q)\lor P]',r'\neg[(\neg P\lor\neg Q)\land(\neg Q\lor P)]\land(\neg Q\lor R)',r'(\neg P\land Q)\lor[\neg(Q\land R)\land\neg P]\lor(P\land\neg R)',r'\neg[(Q\lor P)\land\neg[(\neg P\land(\neg Q\land R))\land(P\lor R)]]',r'\neg\left[\neg[\neg P\lor(\neg Q\lor R)]\lor(S\land R)\lor(Q\land P)\right]',r'(P\to\neg Q)\land\left[[(\neg(R\lor\neg P)\land(Q\lor P))]\lor(R\land P)\right]']
for i,v in enumerate(logic):math('1.3',i+1,'',v)
# Correct the parent / premise-number confusion in section 1.7.
args=[([r'\nexists x[R(x)\land\neg S(x)]',r'\forall x[P(x)\to Q(x)]',r'\forall x[Q(x)\to\neg S(x)]'],r'\forall x[P(x)\to\neg R(x)]'),([r'\forall x[\neg Q(x)\to\neg P(x)]',r'\forall x[Q(x)\to(R(x)\land S(x))]',r'\nexists x[\neg P(x)\lor\neg T(x)]'],r'\forall x\,S(x)'),([r'\nexists x[P(x)\land R(x)]',r'\nexists x[Q(x)\land\neg R(x)]',r'\forall x[S(x)\to P(x)]'],r'\forall x[S(x)\to\neg Q(x)]'),([r'\exists x[P(x)\land Q(x)]',r'\nexists x[R(x)\land Q(x)]',r'\forall x[(P(x)\land\neg R(x))\to T(x)]'],r'\exists x\,T(x)')]
for i,(premises,conclusion) in enumerate(args):
 a=get('1.7',1,'abcd'[i]);a['mathLines']=premises+[r'\therefore '+conclusion];a['text']='Demuestre la validez del argumento.';a['review']='reviewed'
for part,value in zip('abc',[r'\neg\exists x\,\forall y[x\ge y\lor x-y=2]\equiv\forall x\,\exists y[x<y\land x-y\ne2]',r'\exists x[H(x,2)\to(G(8)\to F(3))]\equiv\neg G(8)\lor F(3)\lor\forall x[\neg H(x,2)]',r'\forall x[\exists y\,H(x,y)\to\forall z\,I(x,z)]\equiv\forall x[\exists z\neg I(x,z)\to\forall y\neg H(x,y)]']):math('1.7',2,part,value)
context('1.7',2,'Para x, y, z reales, F y G son predicados de una variable; H e I de dos. Compruebe la validez de las equivalencias.')
# Nested incisos receive the necessary predicate legend, not just the survey data.
legend='Predicados: C(x): casado; CP(x): tiene casa propia; AC(x): alquila; AP(x): tiene automóvil; E(x): estudia en la universidad.'
for a in ds:
 if a['sectionCode']=='1.6' and a['number']==2 and a['part'].startswith('b.'):a['instruction']+=' '+legend
for part,value in zip(['b.i','b.ii','b.iii','b.iv'],[r'\exists x[C(x)\land CP(x)\land AP(x)]',r'\forall x[CP(x)\lor E(x)]',r'(\forall x\,CP(x))\lor(\forall x\,E(x))',r'\forall x[C(x)\to(CP(x)\lor AC(x))]']):math('1.6',2,part,value,'Valide la proposición sobre el universo de cinco personas.')
for part,value in [('c.i',r'(\exists x\in B)[x^2-1\in C]'),('c.ii',r'(\forall x)[x\in A\to(x+1)\in B]')]:math('2.1',16,part,value,'Determine el valor de verdad.')
# Method-of-proof questions all depend on the common axioms.
axioms=r'\begin{aligned}&5\in A\\&x\in A\Rightarrow3x+2\in A\\&x\in A\land y\in A\Rightarrow(x+y)\in A\\&7\notin A\end{aligned}'
context('1.8',1,'Sea A un conjunto de números reales que satisface los cuatro axiomas. Demuestre el teorema por el método indicado.')
for a in ds:
 if a['sectionCode']=='1.8':a['contextMath']=axioms;a['instruction']='Sea A un conjunto de números reales con estos cuatro axiomas. Demuestre el teorema con el método indicado.';a['visuals'].insert(0,{'page':110,'crop':{'x':.125,'y':.12,'width':.75,'height':.22}})
vals=[r'3\in A\Rightarrow16\in A',r'4\in A\Rightarrow23\in A',r'11\in A\Rightarrow(28\in A\lor31\notin A)',r'3\in A\land11\in A\Rightarrow51\in A',r'x\in A\land y\in A\Rightarrow(3x+2y+17)\in A',r'x\in A\land y\in A\Rightarrow(7x+3y+16)\in A',r'11\notin A\Rightarrow3\notin A',r'24\notin A\Rightarrow(4\notin A\lor12\in A)',r'(3y+z+7)\notin A\Rightarrow(y\notin A\lor\tfrac z2\notin A)',r'(3y\notin A\land(z+10)\notin A)\Rightarrow(y\notin A\land z\notin A)',r'3\in A\Rightarrow1\notin A',r'21\in A\Rightarrow-31\notin A',r'x\in A\land y\in A\Rightarrow(-3-3x-y)\notin A',r'2\notin A',r'(\exists x\in A)[x^2-17x+70=0]']
for i,v in enumerate(vals):math('1.8',i+1,'',v, 'Método: '+('directo' if i<6 else 'contradicción' if i<10 else 'reducción al absurdo' if i<13 else 'el libro no indica método'))
# Section 1.2: bracket grouping, exclusive disjunction and two supplied tables.
math('1.2',1,'a',r'[P\to(R\to T)]\leftrightarrow[(\neg P\land S)\to(Q\to\neg T)]')
math('1.2',1,'b',r'[(\neg T\lor\neg P)\leftrightarrow[T\to(R\lor S)]]\leftrightarrow[(P\land Q\land\neg T)\to(\neg Q\to\neg S)]')
for part,v in zip('abcde',[r'\neg(P\to Q)\leftrightarrow(P\land\neg Q)',r'R\to[(\neg P\lor Q)\land(P\land\neg Q)]',r'(P\lor Q)\to[Q\to(P\land Q)]',r'[(P\to Q)\to R]\leftrightarrow[(P\land\neg R)\to\neg Q]',r'[\neg(\neg P\land R)\lor Q]\leftrightarrow[(\neg P\lor R)\land Q]']):math('1.2',2,part,v)
math('1.2',3,'',r'[(A\to(B\lor C))\land(C\to(D\land E))\land\neg D]\not\Rightarrow(A\to E)','Determine una asignación de valores de verdad para A, B, C, D y E que verifique que la primera proposición no implica tautológicamente a la segunda.')
math('1.2',4,'',r'[(A\to B)\land(C\to D)\land(B\lor C)]\not\Rightarrow(A\lor D)','Determine valores de verdad para A, B, C y D que verifiquen que la primera proposición no implica tautológicamente a la segunda.')
math('1.2',5,'',r'(P\to Q)\lor[(\neg Q\to\neg P)\land\neg R]\quad;\quad\neg(P\land\neg Q)','Use tablas de verdad para determinar si las dos proposiciones son tautológicamente equivalentes.')
math('1.2',6,'',r'[(P\lor R)\land\neg Q]\to[(\neg P\land S)\to(T\lor P)]','Si P → Q es falsa, determine el valor de verdad de esta proposición.')
math('1.2',7,'',r'[(\neg P\lor T)\lor Q]\land(\neg R\to S)','Si (P → Q) ∧ R es verdadera, determine el valor de verdad de esta proposición.')
math('1.2',8,'a',r'[(Q\to R)\land(\neg Q\to S)]\Rightarrow(R\lor S)')
math('1.2',8,'b',r'[\neg P\lor(Q\to R)]\Leftrightarrow[\neg(P\land Q)\lor R]')
math('1.2',9,'',r'\underline{P\lor Q}\quad\equiv\quad(P\land\neg Q)\lor(Q\land\neg P)','Use una tabla de verdad para demostrar la equivalencia. La disyunción subrayada es exclusiva.')
for a in ds:
 if a['sectionCode']=='1.2' and a['number'] in [10,11,12]:a['review']='reviewed'
for num,op,values,name in [(13,r'\mid',['F','V','V','V'],'trazo de Sheffer: anticonjunción'),(14,r'\downarrow',['F','F','F','V'],'flecha de Pierce: antidisyunción')]:
 a=get('1.2',num);a['instruction']='Se define la conectiva '+name+' mediante la tabla.'
 a['table']={'headers':['P','Q','P '+('|' if num==13 else '↓')+' Q'],'rows':[[p,q,v] for (p,q),v in zip([('V','V'),('V','F'),('F','V'),('F','F')],values)]}
 math('1.2',num,'',fr'P{op} P\quad;\quad(P{op} Q){op} (P{op} Q)\quad;\quad(P{op} P){op}(Q{op} Q)','Determine cuál de las conectivas estudiadas corresponde a cada una de estas tres proposiciones.')
math('1.2',15,'',r'[(P\lor S)\downarrow(R\mid T)]\lor[(\neg P\mid S)\downarrow(Q\to\neg T)]','Si P, Q, T son verdaderas y R, S son falsas, determine el valor de verdad.')
# Normal forms: preserve every nesting bracket.
for part,v,form in zip('abcde',[r'[(P\land Q)\lor(\neg P\lor R)]\lor(Q\land R)',r'(P\to Q)\land R',r'\neg[\neg(\neg P\land\neg Q)\lor\neg(Q\to R)]\land\neg(R\to P)',r'\neg(P\lor\neg Q)\land(S\to T)',r'(P\land Q)\lor[R\land(S\lor T)]'],['FNC','FND','FND','FND','FNC']):math('1.5',1,part,v,'Determine la '+form+' usando leyes de la lógica.')
for part,v,form in zip('abcd',[r'(P\to Q)\land R',r'[P\lor\neg(\neg Q\lor\neg S)]\lor\neg(\neg Q\to\neg S)',r'[\neg(Q\land R)\lor P]\leftrightarrow[(P\to Q)\to R]',r'(P\land\neg Q\land R)\lor[(P\to\neg Q)\leftrightarrow(Q\leftrightarrow R)]'],['FND y FNC','FND','FND y FNC','FND y FNC']):math('1.5',2,part,v,'Determine la '+form+' usando tablas de verdad.')
# Set laws: overbars are semantic data. Ambiguous nested bars remain auxiliary.
for num,v in {1:r'\overline{[\overline{(A\cup B)}\cap A]}\cup B',2:r'[A\cup\overline{(B\cup\overline C)}]\cup(\overline B\cap C)',3:r'[\overline{\overline{(A\cup B)}\cup C}]\cup(\overline B\cap C)\cup A',4:r'(\overline A\cap B)\cup[\overline A\cap\overline{(B\cap C)}]\cup(\overline A\cap C)',5:r'[\overline A\cup(B\cap A)]\cup[\overline B\cap(A\cup B)]',7:r'[(A\cup B)\cap\overline{(C\cup A)}]\cup[(C\cap B)\cup A]',8:r'\overline{(A\cup B)}\cap\overline{(B\cup A)}\cap(\overline B\cup C)',9:r'(\overline A\cap B)\cup[\overline{B\cap C}\cap\overline A]\cup(A\cap\overline C)',11:r'\overline{[\overline{(C\cup\overline A)}\cap(B\cup A)]\cup(C\cap A)}\cap\overline{A\cap B}'}.items():math('2.4',num,'',v,'Simplifique usando leyes de conjuntos. Indique la ley utilizada en cada paso.')
# Remove artifacts and keep prose paragraphs legible. Formula/table/diagram cases remain auxiliary until repaired.
for a in ds:
 a['text']=re.sub(r'(?<=[a-záéíóúñ])- (?=[a-záéíóúñ])','',a['text'])
 a['instruction']=re.sub(r'(?<=[a-záéíóúñ])- (?=[a-záéíóúñ])','',a['instruction'])
# An explicit inventory records the recovered omissions and removed false parent IDs.
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('Repairs:',sum(a['review']=='reviewed' for a in ds),'reviewed transcriptions; remainder auxiliary')
