"""Fetch missing Johto visuals from the same public catalogs used by OakChess."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request, time, json, sys
root=Path(__file__).resolve().parents[1]
base='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
jobs=[]
hoenn=False
identifiers=list(range(387,494))
for ident in identifiers:
    for folder,ext in [('pokemon/other/showdown/','.gif'),('pokemon/other/showdown/shiny/','.gif'),('pokemon/other/showdown/back/','.gif'),('pokemon/other/showdown/back/shiny/','.gif')]:
        relative=folder+str(ident)+ext
        jobs.append((base+relative,root/'assets/pokeapi/sprites'/relative))
for name in (['roxanne','brawly','wattson','flannery','norman','winona','tate','liza','juan'] if hoenn else ['roark','gardenia','maylene','crasherwake','fantina','byron','candice','volkner']):
    jobs.append(('https://play.pokemonshowdown.com/sprites/trainers/'+name+'.png',root/'assets/showdown/trainers'/(name+'.png')))
for ident in (range(17,25) if hoenn else range(25,33)):
    jobs.append((base+'badges/'+str(ident)+'.png',root/'assets/pokeapi/sprites/badges'/(str(ident)+'.png')))
def download(job):
    url,p=job
    if p.exists() and p.stat().st_size>0:return None
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':'https://play.pokemonshowdown.com/sprites/trainers/'})
            content=urllib.request.urlopen(request,timeout=45).read()
            if not content.startswith((b'GIF8',b'\x89PNG')):raise ValueError('Invalid image')
            p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(content)
            return dict(path=str(p.relative_to(root)),url=url)
        except Exception as error:
            if attempt==2:return dict(path=str(p.relative_to(root)),url=url,error=str(error))
            time.sleep(.5)
with ThreadPoolExecutor(max_workers=8) as pool:results=[r for r in pool.map(download,jobs) if r]
(root/('tmp/hoenn-downloads.json' if hoenn else 'tmp/sinnoh-downloads.json')).write_text(json.dumps(results,indent=2))
errors=[r for r in results if 'error' in r]
print(json.dumps(dict(downloaded=len(results)-len(errors),errors=errors)))
if errors:raise SystemExit(1)
