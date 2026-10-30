"""Download exact-species portraits/cries and Unova NPC assets; preserve source log."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request, json, time
ROOT=Path(__file__).resolve().parents[1]
base='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
jobs=[]
for ident in range(494,650):
    for directory in ['pokemon/','pokemon/shiny/','pokemon/back/','pokemon/back/shiny/']:
        rel=directory+str(ident)+'.png'
        jobs.append((base+rel,'assets/pokeapi/sprites/'+rel,'png'))
    for directory in ['pokemon/other/showdown/','pokemon/other/showdown/shiny/','pokemon/other/showdown/back/','pokemon/other/showdown/back/shiny/']:
        rel=directory+str(ident)+'.gif'
        jobs.append((base+rel,'assets/pokeapi/sprites/'+rel,'gif'))
    jobs.append(('https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/'+str(ident)+'.ogg','assets/pokeapi/cries/pokemon/latest/'+str(ident)+'.ogg','ogg'))
for name in ['cilan','chili','cress','lenora','burgh','elesa','clay','skyla','brycen','drayden','iris','juniper','n','ghetsis']:
    jobs.append(('https://play.pokemonshowdown.com/sprites/trainers/'+name+'.png','assets/showdown/trainers/'+name+'.png','png'))
for ident in range(33,41):
    jobs.append((base+'badges/'+str(ident)+'.png','assets/pokeapi/sprites/badges/'+str(ident)+'.png','png'))
magic={'gif':b'GIF8','png':b'\x89PNG','ogg':b'OggS'}
def download(job):
    url,rel,kind=job
    dest=ROOT/rel
    for attempt in range(3):
        try:
            data=dest.read_bytes() if dest.exists() else urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':'https://play.pokemonshowdown.com/'}),timeout=35).read()
            if not data.startswith(magic[kind]):raise ValueError('Invalid media header')
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(data)
            return {'path':rel,'url':url}
        except Exception as error:
            if attempt==2:return {'path':rel,'url':url,'error':str(error)}
            time.sleep(.4)
with ThreadPoolExecutor(max_workers=12) as pool:
    result=list(pool.map(download,jobs))
(ROOT/'modes/idle/unova/SUPPORT-SOURCES.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
errors=[r for r in result if 'error' in r]
print(json.dumps({'assets':len(result)-len(errors),'errors':errors}),flush=True)
if errors:raise SystemExit(1)
