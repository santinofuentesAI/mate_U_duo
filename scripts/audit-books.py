"""Rebuild reviewed anchors for the exact user editions, never guess exercise keys.
Usage: python3 scripts/audit-books.py PRECALCULO.pdf DISCRETA.pdf
Source PDFs and page images stay private; only metadata and text enter the repo.
"""
import fitz,json,re,sys,hashlib,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
old=json.loads((ROOT.parent/'audit/catalog-before.json').read_text()) if (ROOT.parent/'audit/catalog-before.json').exists() else json.loads((ROOT/'src/bookProblemCatalog.json').read_text())
def clean(s):
 s=s.replace('ı','i')

 for a,b in [('´a','á'),('´e','é'),('´i','í'),('´o','ó'),('´u','ú'),('´A','Á'),('´E','É'),('˜n','ñ'),('˜N','Ñ')]:s=s.replace(a,b)
 s=unicodedata.normalize('NFKC',s)
 s=re.sub(r'[\x00-\x08\x0b-\x1f]', '□',s)
 return re.sub(r'\s+',' ',s).strip()
def lines(p):
 return [dict(text=''.join(s['text'] for s in l['spans']),box=l['bbox']) for b in p.get_text('dict')['blocks'] for l in b.get('lines',[])]
def region(p,y0,y1,x0=55,x1=None):
 x1=x1 or p.rect.width-45
 # clipping via bounding rectangles preserves superscripts/roots instead of linear page merges
 return clean(p.get_text('text',clip=fitz.Rect(x0,y0,x1,y1),sort=True))
def crop(p,y0,y1,x0=55,x1=None):
 x1=x1 or p.rect.width-45
 return {'x':round(x0/p.rect.width,5),'y':round(y0/p.rect.height,5),'width':round((x1-x0)/p.rect.width,5),'height':round((y1-y0)/p.rect.height,5)}
# Explicit page ranges manually checked against rendered pages. Weeks are evidence based.
sections=[
 ('1.1','Introducción',37,45,'Apoyo','support'),('1.2','Conectivas',55,58,'S1','confirmed'),('1.3','Leyes de lógica',63,63,'S1','confirmed'),
 ('1.4','Inferencias',73,78,'S2','confirmed'),('1.5','Formas normales',82,82,'Apoyo','support'),('1.6','Cuantificadores',93,97,'S3','confirmed'),
 ('1.7','Inferencias cuantificadas',100,100,'Apoyo','support'),('1.8','Demostraciones',110,110,'Apoyo','support'),
 ('2.1','Conjuntos',123,128,'S4','confirmed'),('2.2','Conjuntos numéricos',133,134,'Apoyo','support'),('2.3','Venn',137,138,'S4','confirmed'),
 ('2.4','Leyes de conjuntos',142,142,'S4','confirmed'),('2.5','Cardinalidad',148,152,'Por confirmar','unconfirmed')]
D=fitz.open(sys.argv[2]);out=[];inventory=[]
assert hashlib.sha256(Path(sys.argv[2]).read_bytes()).hexdigest()=='3ba95edf85f1cd982d49438680dbcd75f809c4e0e4f6374c7e6c06394a3caf75'
for code,title,first,last,week,scope in sections:
 anchors=[];sectionTop=70
 for n in range(first,last+1):
  p=D[n-1];ls=lines(p)
  if n==first:
   head=next(l for l in ls if l['text'].startswith('Ejercicios'))
   sectionTop=head['box'][3]+3
  for l in ls:
   x,y,xx,yy=l['box'];t=l['text']
   if y< (sectionTop if n==first else 70) or y>560:continue
   m=re.match(r'^(\d+)\.(?:\s|$)',t)
   a=re.match(r'^\(([a-zñ])\)',t)
   if m and 60<x<86:anchors.append({'page':n,'y':y,'number':int(m[1]),'part':''})
   elif a and 88<x<107:anchors.append({'page':n,'y':y,'number':None,'part':a[1]})
 # 1.7 letters are centered alongside premises. Include the lines above the label.
 if code=='1.7':
  for a in anchors:
   if a['part'] in ['a','b','c','d'] and a['page']==100 and a['y']<410:a['y']-=31
 anchors.sort(key=lambda a:(a['page'],a['y']))
 # Every numbered parent with explicit incisos is common context, not a second activity.
 parents=[]
 for a in anchors:
  if a['number'] is not None:parents.append(a)
  else:
   assert parents,(code,a);a['number']=parents[-1]['number']
 def between(start,end):
  pieces=[]
  for pn in range(start['page'],end['page']+1):
   p=D[pn-1];y0=start['y']-5 if pn==start['page'] else 70;y1=end['y']-5 if pn==end['page'] else (533 if pn==40 else 560)
   if y1>y0+1:pieces.append({'page':pn,'crop':crop(p,y0,y1),'text':region(p,y0,y1)})
  return pieces
 end={'page':last,'y':560}
 shared=between({'page':first,'y':sectionTop+5},anchors[0])
 globalInstruction=' '.join(s['text'] for s in shared)
 for k,a in enumerate(anchors):
  nxt=anchors[k+1] if k+1<len(anchors) else end
  children=[b for b in anchors if b['number']==a['number'] and b['part']]
  if not a['part'] and children:continue
  segments=between(a,nxt)
  text=' '.join(s['text'] for s in segments)
  text=re.sub(r'^(?:\d+\.\s*|\([a-zñ]\)\s*)','',text)
  parent=next(b for b in parents if b['number']==a['number'])
  context=between(parent,children[0]) if children else []
  if context:context[0]['text']=re.sub(r'^\d+\.\s*','',context[0]['text'])
  instruction=' '.join(s['text'] for s in context) or globalInstruction
  # Explicit Roman subincisos on 1.6/2b and 2.1/16c must remain separately addressable.
  splits=[]
  if code=='1.6' and a['number']==2 and a['part']=='b':
   splits=[('i',357,375),('ii',376,393),('iii',394,411),('iv',412,439)]
  if code=='2.1' and a['number']==16 and a['part']=='c':
   splits=[('i',112,131),('ii',132,152)]
  base={'course':'discreta','week':week,'assignment':scope,'section':title,'sectionCode':code,'page':a['page'],'printedPage':a['page']-2,'number':a['number'],'part':a['part'],'text':text,'instruction':instruction,'visuals':[{'page':s['page'],'crop':s['crop']} for s in context+segments],'review':'auxiliary','inventoryReviewed':True,'sourcePages':sorted({s['page'] for s in context+segments})}
  if not splits:
   out.append(base)
  else:
   for label,y0,y1 in splits:
    p=D[a['page']-1];copy=dict(base);copy['part']=a['part']+'.'+label;copy['text']=region(p,y0,y1);copy['visuals']=[{'page':s['page'],'crop':s['crop']} for s in context+segments];out.append(copy)
 for n in range(first,last+1):
  pageItems=[a for a in out if a['sectionCode']==code and a['page']==n]
  inventory.append({'course':'discreta','page':n,'printedPage':n-2,'sectionCode':code,'section':title,'week':week,'assignment':scope,'inventoryReviewed':True,'labels':[str(a['number'])+a['part'] for a in pageItems],'continuations':[str(a['number'])+a['part'] for a in out if a['sectionCode']==code and n in a['sourcePages'] and a['page']!=n]})
for a in out:
 matches=[p for p in old['discreta'] if p['section']==a['section'] and p['number']==a['number'] and p['part']==a['part']]
 a['id']=matches[0]['id'] if len(matches)==1 else f"discreta-{a['sectionCode']}-{a['number']}{a['part']}"
# Readable prose has been compared with the page; formulas with lost glyphs stay auxiliary.
for a in out:
 if a['sectionCode']=='1.1' and a['number'] not in [7,10,11,25,26,29]:a['review']='reviewed'
(ROOT/'src/bookProblemCatalog.json').write_text(json.dumps({'precalculo':old['precalculo'],'discreta':out},ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/bookInventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+'\n')
print('Discreta',len(out))
for s in sections:
 its=[a for a in out if a['sectionCode']==s[0]];print(s[0],len(its),[(n,len([a for a in its if a['page']==n])) for n in range(s[2],s[3]+1)])
