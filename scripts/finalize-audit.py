"""Attach weekly evidence and explicitly describe continuations, independent of response state."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
for a in ds:
 code,n,part=a['sectionCode'],a['number'],a['part']
 a['classAssigned']= bool(code=='1.6' and ((n==1 and part in ['a','b','d','f','g','h','i']) or n==2) or code=='1.4' and (n==1 and part in ['a','f','i','j','m','p'] or n==3 and part in ['d','f','j']) or code=='1.2' and (n==1 and part=='b' or n==8 and part=='b' or n==11 and part in ['b','d','e']))
 if code=='2.1' and n==20 and part in ['a','c']:a['week']='S3';a['assignment']='confirmed';a['classAssigned']=True
for a in cat['precalculo']:a['classAssigned']=a['sectionCode']=='3.3.5' and str(a['number'])+a['part'] in ['1g','2f','2l','3k']
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
# Actual exercise or inciso continuations; referencedBy also includes common data.
continued={('discreta',40):['18'],('discreta',42):['28'],('discreta',43):['31'],('discreta',73):['1'],('discreta',74):['3'],('discreta',75):['3i'],('discreta',77):['12'],('discreta',93):['1'],('discreta',94):['4'],('discreta',95):['7'],('discreta',124):['10'],('discreta',125):['16'],('discreta',126):['19'],('discreta',127):['23'],('discreta',133):['2'],('precalculo',42):['2'],('precalculo',52):['2']}
inv=json.loads(Path('src/bookInventory.json').read_text())
for r in inv:
 r['referencedBy']=r.pop('continuations',r.get('referencedBy',[]))
 r['continuesOnNextPage']=continued.get((r['course'],r['page']),[])
 r['continuesFromPreviousPage']=continued.get((r['course'],r['page']-1),[])
 r['weeks']=list(dict.fromkeys(a['week'] for a in cat[r['course']] if a['page']==r['page'])) or [r['week']]
Path('src/bookInventory.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
print('Final catalog:',[(c,len(v),sum(a['review']=='reviewed' for a in v)) for c,v in cat.items()])
