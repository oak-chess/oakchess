"""Adapt the user-approved PAdventures sheets to the native PMD renderer.
No original artwork recoloring. Cardinal rows are duplicated for diagonal slots.
Attack/Walk are aliases of the available source cycle, not separate animations.
"""
import hashlib
import json
import shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'modes/idle/mega/padventures/source'
OUT = ROOT / 'assets/pmd/sprite'
DEFS = [(9,41479,'Mega Blastoise',.66,1,False),(448,45003,'Mega Lucario',.70,1,False),(260,41650,'Mega Swampert',.78,1,False)]
expansion=json.loads((ROOT/'modes/idle/mega/expansion-specs.json').read_text(encoding='utf-8'))
definitions=json.loads((ROOT/'modes/idle/mega/padventures/expansion-stats.json').read_text(encoding='utf-8'))['rows']
for row in expansion:
    pid=next(x['base'] for x in definitions if x['key']==row['key'])
    label='Mega '+row['name']+(' Y' if row['key']=='charizard-y' else '')
    DEFS.append((pid,row['creature'],label,row['size'],row.get('form',1),False))
    if row.get('shinyCreature'):DEFS.append((pid,row['shinyCreature'],'Shiny '+label,row['size'],row.get('form',1),True))
META = json.loads((SOURCE/'metadata.json').read_text(encoding='utf-8'))
xmls, bounds, manifest, scales = {}, {}, [], {}
for pid, ident, name, scale, form, shiny in DEFS:
    original=SOURCE/f'{ident}.png'
    g=META[str(ident)]
    fw,fh,ph=g['w']*32,g['h']*32,g['phases']
    src=Image.open(original).convert('RGBA')
    assert g['px']==4 and g['py']==1 and g['pz']==1 and g['layers']==1
    assert src.width%fw==0 and src.height%fh==0
    assert src.width//fw*(src.height//fh)==4*ph
    # PMD S, SE, E, NE, N, NW, W, SW; source N, E, S, W.
    mapping=[2,1,1,1,0,3,3,3]
    image=Image.new('RGBA',(fw*ph,fh*8))
    for row,direction in enumerate(mapping):
        for frame in range(ph):
            index=direction*ph+frame;cols=src.width//fw
            x,y=index%cols*fw,index//cols*fh
            image.paste(src.crop((x,y,x+fw,y+fh)),(frame*fw,row*fh))
    folder=OUT/f'{pid:04}'/f'{form:04}'
    if shiny:folder=folder/'0001'
    folder.mkdir(parents=True,exist_ok=True)
    image.save(folder/'Idle-Anim.png')
    xml='<AnimData><ShadowSize>2</ShadowSize><Anims><Anim><Name>Idle</Name><Index>0</Index><FrameWidth>'+str(fw)+'</FrameWidth><FrameHeight>'+str(fh)+'</FrameHeight><Durations>'+''.join('<Duration>9</Duration>' for _ in range(ph))+'</Durations></Anim>'+''.join('<Anim><Name>'+n+'</Name><CopyOf>Idle</CopyOf></Anim>' for n in ['Walk','Attack','Hurt','Sleep','Shoot'])+'</Anims></AnimData>'
    (folder/'AnimData.xml').write_text(xml,encoding='utf-8')
    variant=f'{pid:04}/{form:04}'+('s' if shiny else '')
    xmls[variant]=xml;scales[f'{pid}:{form}']=scale
    rb,rt,fb,boxes=[],[],[],[]
    for row in range(8):
        bxs=[image.crop((f*fw,row*fh,(f+1)*fw,(row+1)*fh)).getbbox() for f in range(ph)]
        assert all(bxs)
        boxes.extend(bxs);rt.append(min(b[1] for b in bxs));rb.append(max(b[3]-1 for b in bxs));fb.append([b[3]-1 for b in bxs])
    relative=folder.relative_to(OUT).as_posix()+'/Idle-Anim.png'
    bounds[relative]=dict(fw=fw,fh=fh,mnx=min(b[0] for b in boxes),mny=min(b[1] for b in boxes),mxx=max(b[2]-1 for b in boxes),mxy=max(b[3]-1 for b in boxes),rt=rt,rb=rb,fb=fb)
    manifest.append(dict(pokemon=pid,name=name,form=form,shiny=shiny,creature=ident,sourceSha256=hashlib.sha256(original.read_bytes()).hexdigest(),sourceGeometry=g,cardinalToNativeRows=mapping,converted='assets/pmd/sprite/'+relative,dedicatedAttack=False,shinyPolicy='Identified PAdventures counterpart where available; canonical Mega Showdown GIF otherwise'))
    (folder/'credits.txt').write_text('PAdventures Sprites by DistTopic: https://github.com/DistTopic/padventures-sprites\nOriginal repository contributions CC BY-NC-SA 4.0. Adapted layout: cardinal rows duplicated into PMD direction slots; animation names aliased. Not PMDCollab artwork. Pokémon rights remain with their owners.\n',encoding='utf-8')
js='/* User-approved PAdventures cycles; see padventures/CREDITS.md. */\nObject.assign(window.PMD_ANIM_DATA,'+json.dumps(xmls,separators=(',',':'))+');\nObject.assign(window.PMD_BOUNDS_DATA,'+json.dumps(bounds,separators=(',',':'))+');\nwindow.IDLE_MEGA_SPRITE_SCALE='+json.dumps(scales)+';\n'
(ROOT/'modes/idle/mega/padventures-data.js').write_text(js,encoding='utf-8')
(SOURCE.parent/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Built',len(DEFS),'Mega cycles; four original directions; genuine shiny fallback where needed.')
