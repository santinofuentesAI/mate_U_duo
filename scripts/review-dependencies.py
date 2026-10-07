"""Cross references that supply essential givens to otherwise standalone activities."""
import json
from pathlib import Path
p=Path('src/bookProblemCatalog.json');cat=json.loads(p.read_text());ds=cat['discreta']
def get(code,n,part=''):return next(a for a in ds if a['sectionCode']==code and a['number']==n and a['part']==part)
legend='En Vacilonia hay dos clases de habitantes: los sinceros siempre dicen la verdad y los mentirosos siempre mienten (PDF40, impresa38).'
for a in [get('1.1',n) for n in [15,16,18,19,20]]+[get('1.4',7)]:
 a['instruction']=legend+' '+a['instruction'] if not a['instruction'].startswith(legend) else a['instruction'];a['sourcePages']=sorted(set(a['sourcePages']+[40]));a['visuals']=[v for v in a['visuals'] if v['page']!=40 or a['page']==40];a['visuals'].insert(0,{'page':40,'crop':{'x':.13,'y':.305,'width':.76,'height':.18}})
a=get('1.1',34,'b');a['text']='Paradoja de Protágoras (ejemplo3, PDF36/impresa34). Protágoras enseña a Eualzo sin cobrar, con el acuerdo de que pagará al ganar su primer litigio después de estudiar. Eualzo termina y no emprende ningún caso. Protágoras reclama el pago y amenaza con demandarlo. Eualzo sostiene: si gana no debe pagar por la ley; si pierde aún no ganó su primer litigio y no debe pagar por el acuerdo. Protágoras sostiene: si él gana, Eualzo paga por la ley; si Eualzo gana, paga por el acuerdo. Discuta y analice la paradoja.'
a['sourcePages']=[36,45];a['visuals']=[v for v in a['visuals'] if v['page']!=36];a['visuals'].insert(0,{'page':36,'crop':{'x':.13,'y':.12,'width':.76,'height':.6}})
for a in ds:a['visuals']=list({json.dumps(v,sort_keys=True):v for v in a['visuals']}.values())
p.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
inv_path=Path('src/bookInventory.json');inv=json.loads(inv_path.read_text())
for r in inv:r['referencedBy']=[a['sectionCode']+':'+str(a['number'])+a['part'] for a in cat[r['course']] if r['page'] in a['sourcePages'] and r['page']!=a['page']]
inv_path.write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
