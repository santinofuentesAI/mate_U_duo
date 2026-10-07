"""Visual repairs of sections 2.1, 2.2 and nested set complements (2.4)."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(code,n,part=''):return next(a for a in ds if a['sectionCode']==code and a['number']==n and a['part']==part)
def math(code,n,part,v,text=''):
 a=get(code,n,part);a['math']=v;a['text']=text;a['review']='reviewed'
def common(code,n,v):
 for a in ds:
  if a['sectionCode']==code and a['number']==n:a['instruction']=v
# Precise common sets; the universal set matters when taking complements.
common('2.1',1,'A = {a,b,c}, B = {c,d,e}, C = {c,e,f,g}. Calcule:')
common('2.1',4,'A = {{∅},1,{2},{3}}, B = {3,{2}}. Calcule:')
common('2.1',5,'A = {a,b}, B = {b,c,d}, C = {a,d}; universo U = {a,b,c,d,e,f}. Calcule:')
common('2.1',6,'Universo U = {1,2,…,8,9}, A = {3,4,5}, B = {3,5,8,9}. Calcule:')
common('2.1',7,'A = {a,b,g}, B = {b,d,e,g}, C = {a,b,d,f,g}; universo U = {a,b,c,d,e,f,g}. Calcule:')
common('2.1',10,'A = {2,3,4}, B = {1,3,4}, C = {1,2,4}; universo U = {0,1,2,3,4,5}. Calcule:')
common('2.1',11,'A = {1,2}, B = {3,5,7}, C = {2,4,5,6}, D = {2,5,6}; universo U = {1,2,3,4,5,6,7}. Calcule:')
common('2.1',13,'A = {1,2,3}, B = {∅}, C = {{1},{2,3},{2}}. Determine el valor de verdad:')
common('2.1',16,'A = {1,2,3,4}, B = {2,3,5,6}, C = {1,2,7,8}; universo U = {1,2,…,7,8}.')
common('2.1',19,'A = [−1,1], B = [−2,2], C = {−1,0,1}, D = {−2,−1,0,1,2}. Represente en un sistema cartesiano:')
common('2.1',20,'A = [0,1], intervalo cerrado de reales x con 0 ≤ x ≤ 1. Determine el valor de verdad:')
common('2.1',21,'A = {x ∈ ℕ / −3x + 2 = −13}, B = {2,3,4,5}, C = {1,2,3,6}; universo U = {1,2,3,4,5,6,7,8,9}. Determine el valor de verdad:')
common('2.1',22,'A = {2,3,4}, B = {3,∅}. Determine:')
expressions={1:[r'A\times(B-C)',r'P(A-B)',r'(A\triangle C)\cap B'],4:[r'(A\cap B)-(A\triangle B)',r'(A-B)\times(B-A)',r'P(A-B)'],5:[r'(A\cup C)\triangle B',r'P(\overline A\cap\overline B)',r'(C\times B)-(A\times C)'],6:[r'P(A\cap B)',r'\overline{B-A}',r'(A\triangle B)\times\overline{(A\cup B)}'],7:[r'[(A\triangle C)\cap B]-A',r'P(C-B)\times(A\cap B)'],10:[r'C-(A\triangle B)',r'P(A)-P(B)',r'(A\cap C)\times\overline{(B\cup C)}'],11:[r'\overline{(A\triangle B)}-\overline B\cap D',r'P(B-D)\times P(B-C)'],13:[r'\exists x[x\in C\to x\subseteq A]',r'\forall x[x\in A\to\{x\}\in C]',r'\neg\forall x[x\in B\to x=\varnothing]'],22:[r'P(B)\times P(A)',r'P(B\times P(A))',r'B\times P(A\times P(B))']}
for n,values in expressions.items():
 for part,v in zip('abc',values):math('2.1',n,part,v,'Determine dos elementos de este conjunto.' if n==22 else '')
math('2.1',2,'',r'[(A-B)\cup C]\cap\overline{(B\triangle C)\cup\{d\}}','Universo U = {a,b,c,d,e,f}, A = {a,b,e}, B = {c,e,f}, C = {b,e,f}. Calcule la expresión.')
math('2.1',3,'',r'B\times A\quad;\quad A\cap B\quad;\quad P(A)\quad;\quad B-A','A = {∅,2,{2}}, B = {1,{2}}. Determine estos conjuntos.')
math('2.1',8,'',r'P(P(A))\quad;\quad P(A)\times P(A)','Si A = {a}, calcule estos conjuntos.')
math('2.1',9,'',r'A\in B\quad,\quad B\in C\quad,\quad C\in D\quad,\quad A\in D','Dé un ejemplo de cuatro conjuntos que satisfagan todas estas relaciones.')
math('2.1',12,'',r'\begin{aligned}A&=\{x\in U\,/\,P(x)\lor Q(x)\}\\B&=\{x\in U\,/\,P(x)\land Q(x)\}\\C&=\{x\in U\,/\,P(x)\underline{\lor}Q(x)\}\end{aligned}','P(x): x es múltiplo de 2; Q(x): x es múltiplo de 3. Si U = {1,2,3,…,10}, calcule A, B y C. La disyunción subrayada es exclusiva.')
math('2.1',14,'',r'A=\{3n-2\,/\,n\in\mathbb Z\}\quad,\quad B=\{3m+4\,/\,m\in\mathbb Z\}','Determine si A = B es verdadera o no.')
math('2.1',15,'',r'\forall x\,(x\in S\to x\subseteq S)','Si es posible, determine un conjunto S no vacío que satisfaga la proposición.')
math('2.1',16,'a',r'P(\overline A\cap C)','Calcule.')
math('2.1',16,'b',r'(A-B)\times\{e,f\}','Calcule.')
for part,v in zip('abcd',[r'A=[-1,4[\quad,\quad B=[0,2]',r'A=[1,5]\quad,\quad B=[0,3[',r'A=]-\infty,2]\quad,\quad B=[1,3]',r'A=[3,+\infty[\quad,\quad B=]1,5]']):math('2.1',17,part,v,'Calcule A ∪ B, A ∩ B, A − B, B − A y A △ B.')
for part,v in zip('abcdef',[r'A=\{-1,0,1\}\quad,\quad B=\{2,3\}',r'A=[-1,3]\quad,\quad B=[1,2[',r'A=\{-1,3\}\quad,\quad B=[1,2[',r'A=[-1,3[\quad,\quad B=\{1,2\}',r'A=\mathbb R\quad,\quad B=\{2\}',r'A=[1,+\infty[\quad,\quad B=]-\infty,3[']):math('2.1',18,part,v,'Represente A × B en un sistema cartesiano.')
for part,domain,v in zip('abcdefg',['A\\times B','C\\times D','C\\times D','A\\times B','C\\times D','C\\times D','C\\times D'],['y=x','y=x','y=2x-1','y=2x-1','|x+y|=1','|x+y|\\le1','|x|+|y|\\le1']):math('2.1',19,part,r'\{(x,y)\in '+domain+r'\,/\,'+v+r'\}')
for part,v in zip('abc',[r'\exists x\in A\land\exists y\in A\text{ tal que }x+y<1',r'(\forall x\in A)(\exists y\in A)[0<y<x]',r'(\forall x\in A)(\forall y\in A)[\exists z\in A\,/\,x+y<z]']):math('2.1',20,part,v)
math('2.1',21,'a',r'(\forall x\in C)(\exists y\in B)[x+1=y]')
math('2.1',21,'b',r'(\exists x\in C)[x\in C\to(x^2+1)\in A\cap B]')
# The last numbered problem's a/b are definitions, with one shared final question.
common('2.1',23,'Universo: los adjetivos. Una palabra autológica cumple lo que significa; una heterológica no. ¿Cómo clasificaría «heterológica»: autológica o heterológica? Lea ambos tipos antes de responder.')
for a in ds:
 if a['sectionCode']=='2.1' and a['number']==23:a['review']='reviewed'
# 2.2: numerical sets and decimal periods. I denotes the irrationals.
common('2.2',1,'Determine el valor de verdad. I denota el conjunto de números irracionales.')
for part,v in zip('abcdefghi',[r'\mathbb I\subseteq\mathbb R',r'\varnothing\subseteq\mathbb Q',r'\mathbb Q-\mathbb I=\mathbb I',r'\mathbb N\cup\mathbb Q=\mathbb R-\mathbb I',r'\{\tfrac54,-2,4,\sqrt9\}\subseteq\mathbb Z',r'3\notin\mathbb Z\lor\pi\notin\mathbb I',r'-4\in\mathbb N\to\pi\in\mathbb Q',r'\mathbb N\cap\mathbb I\ne\varnothing',r'\{\tfrac{3^{100}-1}{2},\tfrac{\sqrt{225}}{\sqrt{25}},-3\}\subseteq\mathbb Z']):math('2.2',1,part,v)
# Decimal overbars still require a separate visual review; don't certify them by regex.
# Multi-level overbars in 2.4, checked against vector line endpoints as well as pixels.
fix={1:r'\overline{[(\overline A\cup B)\cap A]}\cup B',2:r'[A\cup\overline{(\overline B\cup\overline C)}]\cup(\overline B\cap C)',3:r'[\overline{(\overline A\cup B)}\cup C]\cup(\overline B\cap C)\cup A',6:r'B\cup\overline{\overline{[(A\cap B)\cup(A\cap\overline B)]\cup B}\cap A}',8:r'\overline{(\overline A\cup B)\cap(\overline B\cup A)}\cap(\overline B\cup C)',10:r'\overline{\overline{[(\overline A\cup(\overline B\cup C))\cup(D\cap C)]}\cup(B\cap A)}',11:r'[\overline{(C\cup\overline A)}\cap(B\cup A)\cup(C\cap A)]\cap\overline{A\cap B}'}
for n,v in fix.items():math('2.4',n,'',v,'Simplifique usando leyes de conjuntos. Indique la ley utilizada en cada paso.')
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('Reviewed Discreta:',sum(a['review']=='reviewed' for a in ds))
