"""Section 1.6: manually checked universes, scope of quantifiers and exponents."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(n,part=''):return next(a for a in ds if a['sectionCode']=='1.6' and a['number']==n and a['part']==part)
def math(n,part,value,text=''):
 a=get(n,part);a['math']=value;a['text']=text;a['review']='reviewed'
for a in ds:
 if a['sectionCode']=='1.6' and a['number'] in [1,2,4,8,11,12,16]:a['review']='reviewed'
for part,v in zip('abc',[r'(\forall n\in\mathbb N)[n^2-2n+5\ge4]',r'(\exists x\in\mathbb R)[x>2\to x^2\le5]',r'(\forall x\in\mathbb R)(\exists n\in\mathbb N)[n>x\lor nx\le0]']):math(3,part,v)
context='Para x entero: P(x): 2 < x ≤ 10; Q(x): x es impar; R(x): x es primo; S(x): 4x − 1 es divisible por 3; T(x): x se escribe como suma de dos primos. Determine el valor de verdad.'
for part,v in zip('abcde',[r'(\exists x\in\mathbb N)[P(x)\land Q(x)\land\neg R(x)]',r'(\exists x\in\mathbb N)[P(x)\land R(x)\land S(x)]',r'(\forall x\in\mathbb N)[P(x)\to(Q(x)\lor\neg R(x))]',r'(\forall x\in\mathbb N)[(P(x)\land Q(x)\land R(x))\to\neg S(x)]',r'(\forall x\in\mathbb N)[(P(x)\land\neg Q(x))\to T(x+2)]']):
 math(5,part,v);get(5,part)['instruction']=context
for part,v in zip('abcdefg',[r'(\exists y\in\mathbb Z)(\forall x\in\mathbb Z)[x=y+1]',r'(\forall x\in\mathbb Z)(\exists y\in\mathbb Z)[x=y+1]',r'(\exists y\in\mathbb R)(\forall x\in\mathbb R)[2x+3y=1]',r'(\forall x\in\mathbb R)(\exists y\in\mathbb R)[2x+3y=1]',r'(\forall x\in\mathbb Z)(\exists y\in\mathbb Z)[2x+3y=1]',r'(\exists x\in\mathbb R)(\forall y\in\mathbb R)[xy=0]',r'(\forall x\in\,]0,+\infty[)(\exists y\in\mathbb R)[0<y<x]']):math(6,part,v)
for part,v in zip('abc',[r'\forall x\in\mathbb N[x\in A\to x<9]\land\exists x\in\mathbb N[x\notin A\land P(2x)]',r'\exists x\in A[P(2x-1)\leftrightarrow Q(x+1)]',r'(\forall x\in\mathbb N)(\exists y\in\mathbb N)[x\in A\to(Q(x)\lor P(x+y))]']):
 math(7,part,v);get(7,part)['instruction']='A = {2,3,4,5,6,7}. P(x): x + 1 es primo; Q(x): x² + x es impar. Determine el valor de verdad.'
for part,v in [('a',r'\forall x\in\mathbb N[x<7\lor x^2\ge40]'),('b',r'\forall x\in\mathbb N[4x<27\to x^2+1\le38]')]:math(9,part,v)
for part,v in zip('abcde',[r'n^2\text{ es par}\leftrightarrow n\text{ es par}',r'n^2\text{ es impar}\leftrightarrow n\text{ es impar}',r'n\text{ impar}\Rightarrow3n^2+7n+5\text{ impar}',r'n^2+3n+2\text{ es par}',r'n+m\text{ par}\Rightarrow n^2+m^2\text{ par}']):
 math(10,part,v);get(10,part)['instruction']='Para n entero: D1, n es par si y solo si existe k ∈ ℤ tal que n = 2k. D2, n es impar si y solo si existe k ∈ ℤ tal que n = 2k + 1. Demuestre la proposición.'
math(13,'',r'(\forall\epsilon>0)(\exists\delta>0)[x<\delta\to f(x)<\epsilon]','Obtenga la negación y simplifique.')
math(14,'',r'(\forall x\in\mathbb R)(\forall y\in\mathbb R)[6x+9y=101\to x\notin\mathbb Z\lor y\notin\mathbb Z]','Demuestre por contradicción.')
math(15,'',r'2^p+p^2','Si p es un número primo con p > 2, pruebe que esta expresión es impar.')
math(17,'',r'[(\forall a,b\in\mathbb R)\,ax+by=0]\to(x=0\land y=0)','Demuestre la validez de la proposición.')
math(18,'',r'(\forall a,b\in\mathbb R)[ax+by=0\to(x=0\land y=0)]','Determine el valor de verdad y compare con el ejercicio anterior.')
math(19,'',r'(\forall\epsilon>0)(\exists\delta>0)[|x-2|<\delta\to|f(x)-4|<\epsilon]','Si f(x) = 3x − 2, demuestre la validez.')
# Clean typographical extraction accents, without altering mathematical signs.
for a in ds:
 for field in ['text','instruction']:
  if field in a:a[field]=a[field].replace('˜n','ñ').replace('˜N','Ñ')
# Correct scope/characters found on a second visual pass.
get(2,'b.iii')['math']=r'\forall x\,CP(x)\lor\forall x\,E(x)'
next(a for a in ds if a['sectionCode']=='1.8' and a['number']==9)['math']=r'(3y+z+7)\notin A\Rightarrow(y\notin A\lor\tfrac z2\notin A)'
next(a for a in ds if a['sectionCode']=='1.2' and a['number']==15)['math']=r'[(P\lor S)\downarrow(R\mid T)]\underline{\lor}[(\neg P\mid S)\downarrow(Q\to\neg T)]'
next(a for a in ds if a['sectionCode']=='1.2' and a['number']==15)['text']='Si P, Q, T son verdaderas y R, S son falsas, determine el valor de verdad. La disyunción subrayada es exclusiva.'
next(a for a in ds if a['sectionCode']=='1.4' and a['number']==8)['text']=next(a for a in ds if a['sectionCode']=='1.4' and a['number']==8)['text'].replace('MUUIIUMIII','MUUIUIMIII')
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('Reviewed Discreta:',sum(a['review']=='reviewed' for a in ds))
