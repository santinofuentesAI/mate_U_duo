"""Manual formula transcription, checked against the 8 original exercise pages.
Run after audit-books.py; requires the original Precálculo PDF as argv[1].
No answer keys are inferred from these transcriptions.
"""
import fitz,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=fitz.open(sys.argv[1]);catalog=json.loads((ROOT/'src/bookProblemCatalog.json').read_text());old=catalog['precalculo'];out=[];inventory=json.loads((ROOT/'src/bookInventory.json').read_text())
alpha='abcdefghijklmnñopqrstuvwxyz'
specs=[]
def group(page,number,code,title,week,instruction,values,start=0,contextMath=None):
 specs.append((page,number,code,title,week,instruction,values,start,contextMath))
group(18,1,'1.4','Números reales','B1','Anote falso (F) o verdadero (V) y justifique su respuesta.',[
 r'\frac{\sqrt[3]{27}}{-3^2}\text{ corresponde a un número racional negativo.}',r'\left(\frac{2}{\sqrt{2}}\right)^2\text{ representa un número irracional.}',r'\left(2+\frac{2}{\pi}\right)^2\text{ corresponde a un número racional negativo.}',r'\sqrt{x}\in\mathbb{Z}^{+}\text{; un posible valor de }x\text{ es }9.',r'\text{Todo número natural es entero y racional al mismo tiempo.}',r'\text{Todo número racional es irracional.}'])
group(18,2,'1.4','Números reales','B1','Determine el signo según corresponda en cada operación dada.',[None])
group(18,3,'1.4','Números reales','B1','Aplique propiedades de potencias; exprese su resultado en notación potencial.',[
 r'\left\{\left[\left(-\frac{1}{7}\right)^2\right]^{-1}\right\}^{-1}',r'\left(\frac{4}{9}\right)^2\cdot\left(\frac{9}{4}\right)^{-3}\cdot\left(\frac{4}{9}\right)^5',r'\left[\left(\frac{4}{5}\right)^7\div\left(\frac{4}{5}\right)^3\right]^2',r'\left(-\frac{1}{3}\right)\cdot\left(-\frac{1}{3}\right)^{-3}\cdot\left(-\frac{1}{3}\right)^0',r'\left(-\frac{5}{3}\right)^{-2}\div\left(-\frac{5}{3}\right)^0\div\left(-\frac{5}{3}\right)^{-5}',r'\left[\left(-\frac{10}{21}\right)^{-1}\right]^2\div\left[-\frac{10}{21}\cdot\left(-\frac{10}{21}\right)^3\right]^2',r'\left(\frac{7}{2}\right)^2\cdot\left(\frac{7}{2}\right)^4\cdot\left(\frac{7}{2}\right)^6\div\left(\frac{7}{2}\right)^9'])
group(19,4,'1.4','Números reales','B1','Aplique propiedades de potencias; exprese su resultado en notación potencial.',[r'\frac{25^6\cdot14^{10}}{-7^{10}\cdot10^{10}}',r'\frac{(-5)^7\cdot5^9}{(-5)^{15}\cdot5^{-4}}',r'\frac{35^{11}\cdot49^4\cdot(-12)^{-31}}{10^{12}\cdot6^{30}\cdot(-14)^{20}}',r'\frac{2^{-4}\cdot3^{-1}}{10^{-3}\cdot3^{-2}\cdot5^{-4}}'])
group(19,5,'1.4','Números reales','B1','Calcule cada radical usando sus propiedades.',[r'\sqrt[4]{16x^8y^4}',r'4m^5a^2\sqrt[5]{x^{15}\cdot a^5}',r'\sqrt[5]{\frac{-243x^{15}}{1024y^{10}}}',r'\frac{2x}{3y}\sqrt[3]{\frac{27y^6}{8x^9}}'])
group(19,6,'1.4','Números reales','B1','Resuelva las siguientes operaciones.',[
 r'\sqrt{256}-\{15^2-[4-3^2(0^2-5^2)]\}',r'(3+5)^2\cdot(1+\sqrt[3]{-27})^4\cdot(3-8)^2',r'\sqrt{(-5-7)^2}+(\sqrt[3]{-8}+2)',r'(-5)^2-[\sqrt[3]{-8}-(-17)+5+1]',r'11+\sqrt{2\cdot10^2-4}',r'(5-\sqrt[4]{2401})+(11-5)',r'-3[-1+\sqrt{36}+(-3)^2]\div(-7)',r'(-12\div3)\div\left(-\sqrt[3]{8}\right)(3^3\div3^2)',r'(3+(-2))^0+(\sqrt{4}-3)^2',r'(17-15)^4+(\sqrt[4]{16}-\sqrt[4]{81})-(1-2)^3',r'(\sqrt{25}\div5)+6^2(\sqrt{64}-2^3)',r'3\sqrt[8]{256}+2\sqrt{324}-5\sqrt{144}',r'(2\sqrt[4]{81}+3\sqrt[4]{625})\div\left(-3\sqrt{49}\right)',r'[(7^3-5^3)+(\sqrt{49}+7\sqrt{25})-4]^3',r'[4^4\div(\sqrt{16})^3]\cdot4-1',r'2\left\{\sqrt{5^2-3^2}+[2(-5-2)]^2\right\}',r'\left[\left(\frac{5}{12}-\frac{7}{18}\right)\cdot\sqrt[4]{\frac{10000}{1296}}\right]^{-1}'])
group(33,1,'2.5','Expresiones y polinomios','B2','Clasifique (monomio, binomio, trinomio, polinomio) e indique su grado.',[r'x^2+5',r'\frac{3}{x}+2',r'x^3+x^2+x+1',r'\frac{x^5+2x^2+x+1}{3}',r'\sqrt{x}+3x',r'5'])
group(33,2,'2.5','Expresiones y polinomios','B2','Considere los polinomios de variable real y determine la operación indicada.',[r'r(x)-p(x)',r'3p(x)+r(x)',r'p(x)+5q(x)',r'p(x)-2q(x)',r'p(x)\cdot r(x)',r'q(x)\cdot r(x)',r'q(x)\div p(x)',r'p(x)\div q(x)'],contextMath=r'p(x)=x^3+3x^2+2x+5,\quad q(x)=-3x^3-3x^2+4x+3,\quad r(x)=x^3-2x^2')
group(33,3,'2.5','Expresiones y polinomios','B2','Resuelva las operaciones con polinomios.',[r'(x-2)^2+(-x-3)^2-x^2',r'-2(y-1)^3-6(y+1)-(-3+y)^2',r'(x-3)^3+4(-x-2)^3+3x^3',r'(x-y+z)^3-(x+y-z)^3'])
group(33,4,'2.5','Expresiones y polinomios','B2','Resuelva los productos.',[r'\frac{15xy^2}{4}\left[\frac{4xy}{3}-\frac{8y^3}{5}+\frac{16y}{15}\right]',r'(x^3-6)(x^2+2x+3)',r'(x+1)(x^2-x+1)',r'\left(\frac{x}{2}-1\right)(2x+4)',r'(x^3-x)(x^3+2x)',r'(-8x^3-3)(6x^3+x+1)'])
group(33,5,'2.5','Expresiones y polinomios','B2','Resuelva las divisiones.',[r'(x^5-32)\div(3x-6)',r'(5x^3+2x^6-3)\div(x^2-x)',r'(2x^3+2x^2-x^4-7x+6)\div(2-x^2)',r'(4x^4+3x^3+3x+1)\div(-2x^2+1)'])
group(33,6,'2.5','Expresiones y polinomios','B2','Verifique si se cumple la igualdad.',[r'(x+y)^2-(x-y)^2=4xy'])
group(33,7,'2.5','Expresiones y polinomios','B2','Verifique si al resolver la división se obtiene residuo 19. El PDF escribe la división sin agrupar los polinomios.',[r'(2x^3-12x+1)\div(-x+3)'])
group(33,8,'2.5','Expresiones y polinomios','B2','Determine P(x) al dividirlo por Q(x), con cociente C(x) y residuo R(x). El grado del residuo indicado en el PDF requiere revisar la consistencia de la consigna.',[r'Q(x)=x^2-x+1,\quad C(x)=x^2+2,\quad R(x)=x^2+1'])
group(42,1,'3.2.5','Factorización','B3','Factorice las expresiones.',[r'3x^2-xy+3-yx^2+3x-y',r'a^2x-ax^2-2a^2y+2axy+x^3-2x^2y',r'x^{n+1}y^{n-1}+x^{n+2}-y^n-yx',r'a^2b^3-n^4+a^2b^3x^2-n^4x^2-3a^2b^3x+3n^4x',r'8-y^3',r'16a^{8n}-81b^{16}y^4',r'x^6-64',r'(5-a)^3+8',r'8x^3-12x^2y+6xy^2-y^3',r'6x-w^2x+3x^2-w^2+3',r'-20+5x^2+4y+yx^2+4xy',r'3x^3-3x^2+x-1',r'25x^4y^4-91x^2y^4-36y^4',r'a-b+3ax-3bx+3ax^2-3bx^2+ax^3-bx^3',r'-2x^9y+x^{10}y+x^{11}y+2xy^5-x^2y^5-x^3y^5',r'a^7b+a^6b-2a^5b-a^3b^3-a^2b^3+2ab^3',r'a^2-2a+b^2+2b-2ab',r'-8a^3+36a^2-54a+27',r'xa^3+3xa^2b+3xab^2+xb^3',r'(a+1)^3+(a-3)^3'])
group(42,2,'3.2.5','Factorización','B3','Factorice utilizando fórmula general e inspección.',[r'x^2+8x+15',r'x^2+3x-7',r'x^2-11x+30',r'9x^2-3xy-2y^2'])
group(43,2,'3.2.5','Factorización','B3','Factorice utilizando fórmula general e inspección. Continúa el ejercicio de PDF 42.',[r'4a^4-15a^2b^2-81b^4',r'x^2+4x+3',r'x^2-10x+24',r'2x^2-x-3',r'16x-5-3x^2'],start=4)
group(43,3,'3.2.5','Factorización','B3','Determine los valores de a para que el polinomio sea factorizable.',[r'ax^2+7x-5'])
group(43,4,'3.2.5','Factorización','B3','Si el trinomio es factorizable y Δ = 1, determine k.',[r'x^2-3x+k'])
group(43,5,'3.2.5','Factorización','B3','Halle m de modo que (x + 3) sea un factor del polinomio.',[r'x^3-x^2+m^2-x+5'])
group(43,6,'3.2.5','Factorización','B3','Determine k para dos factores iguales, dos distintos y ningún factor.',[r'P(x)=x^2-kx-x+1'])
group(52,1,'3.3.5','Fracciones algebraicas','S4','Factorice utilizando división sintética.',[r'2x^4-7x^3+7x^2-7x+5',r'2x^3-5x^2+2x-5',r'-8x^3+14x^2-7x+1',r'3x^3+7x^2+x-2',r'3x^4+2x^2+x-2',r'-2x^4+15x^3-29x^2+5x+3',r'4x^4-8x^3+5x^2-x',r'-1-2x^3'])
group(52,2,'3.3.5','Fracciones algebraicas','S4','Resuelva y factorice al máximo. Registre las restricciones de los denominadores originales.',[r'\frac{2x^2-3x-2}{6x+3}\cdot\frac{3x+6}{x^2-4}',r'\frac{4x^2-y^2}{x+2y}\div(4x^2+2xy)',r'\frac{a}{b}-\frac{b-a}{ab-b^2}',r'\frac{(a+b)^{-2}}{(ab)^{-2}}\div\frac{1}{b^{-2}-a^{-2}}',r'\frac{1}{x^2-1}-\frac{1}{1-x}',r'\frac{1}{x^2+x}+\frac{1}{x-x^2}+\frac{1}{x^2-1}',r'\frac{a^2+3a}{a+4}+\frac{2a^2-13a-8}{a+4}',r'\frac{2x}{5x+3}+\frac{2x}{5x-2}',r'\frac{8}{8x-16}-\frac{x+4}{x^2+5x+4}',r'\frac{y}{y-5}+\frac{y-5}{y}',r'\frac{x+3y}{3xy}+\frac{x^2y-4xy^2}{5x^2y^2}',r'\frac{5x^2}{x^3-x^2y}+\frac{3x-3y}{x-y}',r'\frac{a-b}{12}+\frac{2a+b}{15}+\frac{b-4a}{30}',r'\frac{x-3}{20x+10}-\frac{4x-1}{60x+30}+\frac{2x+5}{40x+20}'])
group(53,2,'3.3.5','Fracciones algebraicas','S4','Resuelva y factorice al máximo. Continúa el ejercicio de PDF 52.',[r'\frac{2}{y}+\frac{3y+1}{y^2}-\frac{y-2}{y^3}',r'\left(\frac{3x+1}{x}\right)^{-2}-\frac{(2-x)(2x-4)^{-1}}{3x+1}+\frac{1-x}{-6x^2+7x+3}'],start=14)
group(53,3,'3.3.5','Fracciones algebraicas','S4','Racionalice las expresiones bien definidas.',[r'\frac{a}{\sqrt{7}}',r'\frac{2}{5-\sqrt{2}}',r'\frac{2x}{2\sqrt{3}-1}',r'\frac{5}{x-\sqrt{2}}',r'\frac{3}{\sqrt{5}-x}',r'\frac{x^2-9}{\sqrt{6x}-\sqrt{x^2+9}}',r'\frac{2x+1-\sqrt{11x+3}}{2-32x^2}',r'\frac{x\sqrt[3]{x}-y\sqrt[3]{y}}{x-y}',r'\frac{nx+n^3x^3}{\sqrt[3]{nx}+nx}',r'\frac{-2\sqrt[3]{x}+\sqrt[3]{3x^2+4}}{2-3x}',r'\frac{2x-3}{\sqrt[3]{x+1}+3}'])
group(63,1,'4.6','Ecuaciones','B5','Determine el conjunto solución. Conserve las restricciones y compruebe cada raíz en la ecuación original.',[r'x^2+12x-3=3x^3+1',r'2(x^2+1)^3+12=14(x^2+1)',r'8(5-3x)^2+14(5-3x)=15',r'4x^4+12x^3-x^2-3x=0',r'10(x^2-x-1)=10x-11',r'2x(2x+1)=x(x-3)-3',r'x^4+4x^3+4x=4x^2+5',r'x-\frac{2x}{x+1}=\frac{2}{x+1}',r'\frac{x^2+5x}{5x+4}=\frac{x}{5}',r'\frac{3x-4}{2x+1}=\frac{3x-2}{2x+3}',r'\frac{x}{3}=\frac{x^2-8x}{3x-2}',r'\frac{3}{2x+1}=\frac{5}{4x-3}',r'\frac{2x^2+5x-3}{x^2+7x+12}=\frac{x}{x+4}-\frac{2}{x+3}',r'\frac{5}{x+5}-\frac{2}{x-3}=\frac{-6(x+1)}{15-2x-x^2}',r'\frac{3}{x+1}+\frac{4}{x}=\frac{7}{x^3+3x^2+2x}'])
group(63,2,'4.6','Ecuaciones','B5','Resuelva las ecuaciones con radicales y descarte raíces espurias.',[r'x+2\sqrt{x+7}=8',r'\sqrt{6x^2+3}=2',r'\sqrt{2x+1}=x-7',r'1-\sqrt{x+7}=2x',r'1+\sqrt{x+7}=2x',r'\sqrt{2x+3}+x=6',r'\sqrt{2x+3}+6=x',r'x+\sqrt{3x^2+x+1}=2',r'\sqrt[3]{3x-1}+1=x',r'2=\sqrt{1-5x}+\sqrt{1-x}',r'3\sqrt{x}+\sqrt{2x-1}=8'])
# Numbered parents with only a single expression are whole problems, no fabricated a).
singles={(18,2),(33,6),(33,7),(33,8),(43,3),(43,4),(43,5),(43,6)}
for pn,num,code,title,week,instruction,values,start,ctx in specs:
 p=D[pn-1];ls=[(l['bbox'],''.join(s['text'] for s in l['spans'])) for b in p.get_text('dict')['blocks'] for l in b.get('lines',[])];
 # assign letter anchors to the numbered band without mixing two columns
 bands={18:{1:(110,296),2:(297,451),3:(470,738)},19:{4:(70,207),5:(228,349),6:(369,738)},33:{1:(110,200),2:(278,369),3:(388,441),4:(468,549),5:(570,617)},42:{1:(216,618),2:(637,738)},43:{2:(40,145)},52:{1:(90,253),2:(270,738)},53:{2:(40,114),3:(135,512)},63:{1:(98,307),2:(325,449)}}
 band=bands.get(pn,{}).get(num)
 markers=[]
 if (pn,num) not in singles:
  for box,t in ls:
   m=re.match(r'^\s*([a-zñ])\s*\)',t)
   if m and band[0]<=box[1]<band[1]:markers.append((m[1],box))
 for i,math in enumerate(values):
  part='' if (pn,num) in singles else alpha[start+i]
  if part:
   match=[box for label,box in markers if label==part];assert len(match)==1,(pn,num,part,match);box=match[0];x0=box[0]-8;right=box[0]>300;x1=p.rect.width-30 if right or pn not in [33,63] else 323
   others=[b[1] for label,b in markers if (b[0]>300)==right and b[1]>box[1]+1]
   y0=box[1]-12;y1=min(others)-10 if others else band[1];cr={'x':round(x0/p.rect.width,5),'y':round(y0/p.rect.height,5),'width':round((x1-x0)/p.rect.width,5),'height':round((y1-y0)/p.rect.height,5)}
  else:
   box=next(b for b,t in ls if re.match(fr'^{num}\.\s',t) and b[1]>40);y0=box[1]-4;y1=451 if pn==18 else (705 if num==8 else box[3]+18);cr={'x':.075,'y':round(y0/p.rect.height,5),'width':.85,'height':round((y1-y0)/p.rect.height,5)}
  existing=[a for a in old if a['page']==pn and a['number']==num and a['part']==part];id=existing[0]['id'] if existing else f'precalculo-{pn}-{num}{part}'
  a={'id':id,'course':'precalculo','week':week,'assignment':'confirmed' if week=='S4' else 'unconfirmed','section':title,'sectionCode':code,'page':pn,'printedPage':pn,'number':num,'part':part,'instruction':instruction,'text':'Tabla de signos: complete las seis filas para cada operación.' if math is None else instruction,'math':math,'review':'reviewed','inventoryReviewed':True,'visuals':[{'page':pn,'crop':cr}],'sourcePages':[pn]}
  if ctx:a['contextMath']=ctx;a['visuals'].insert(0,{'page':pn,'crop':{'x':.075,'y':.245,'width':.85,'height':.095}})
  if pn in [43,53] and num==2:a['sourcePages']=[pn-1,pn] # context carried in reviewed instruction
  if pn==18 and num==2:
   a['table']={'headers':['x','y','w','z','x·y','z:w','x·w:z','y:z·w','x·y:w·z','z:w·y:x'],'rows':[['+','+','+','+'],['−','−','−','−'],['+','+','−','−'],['−','−','+','+'],['+','−','+','−'],['−','+','−','+']]}
  out.append(a)
for pn in [18,19,33,42,43,52,53,63]:
 its=[a for a in out if a['page']==pn];inventory.append({'course':'precalculo','page':pn,'printedPage':pn,'sectionCode':its[0]['sectionCode'],'section':its[0]['section'],'week':its[0]['week'],'assignment':its[0]['assignment'],'inventoryReviewed':True,'labels':[str(a['number'])+a['part'] for a in its],'continuations':[]})
assert len(out)==164,len(out)
catalog['precalculo']=out
(ROOT/'src/bookProblemCatalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n');(ROOT/'src/bookInventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n')
print('Precálculo:',len(out),'incisos/problemas revisados; 8 páginas')
