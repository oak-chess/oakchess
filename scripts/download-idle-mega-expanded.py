"""Canonical normal/shiny Mega portraits and specific stone icons. No recolors."""
import concurrent.futures,json,time,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
specs=json.loads((ROOT/'modes/idle/mega/expansion-specs.json').read_text(encoding='utf-8'))
stats=json.loads((ROOT/'modes/idle/mega/padventures/expansion-stats.json').read_text(encoding='utf-8'))['rows']
paths=[]
for row in stats:
    i=row['mega'];paths.extend([f'pokemon/other/showdown/{i}.gif',f'pokemon/other/showdown/shiny/{i}.gif',f'pokemon/other/showdown/back/{i}.gif',f'pokemon/other/showdown/back/shiny/{i}.gif',f'pokemon/{i}.png',f'pokemon/shiny/{i}.png'])
paths += ['items/'+s['icon']+'.png' for s in specs]
def fetch(path):
    p=ROOT/'assets/pokeapi/sprites'/path
    if p.exists():return
    for retry in range(3):
        try:
            with urllib.request.urlopen('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'+path,timeout=45) as r:data=r.read()
            assert len(data)>50
            p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data);return
        except Exception:
            if retry==2:raise
            time.sleep(retry+1)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(fetch,paths))
print('Verified',len(paths),'Mega portraits and stone icons')
