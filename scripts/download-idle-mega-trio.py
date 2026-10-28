"""Fetch canonical Mega portraits, genuine shiny variants and item icons only."""
import concurrent.futures
import time
import urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REMOTE='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
paths=[]
for ident in [10036,10059,10064]:
    paths += [f'pokemon/other/showdown/{ident}.gif',f'pokemon/other/showdown/shiny/{ident}.gif',f'pokemon/other/showdown/back/{ident}.gif',f'pokemon/other/showdown/back/shiny/{ident}.gif',f'pokemon/{ident}.png',f'pokemon/shiny/{ident}.png']
paths += ['items/'+name+'.png' for name in ['blastoisinite','lucarionite','swampertite']]
def fetch(path):
    target=ROOT/'assets/pokeapi/sprites'/path
    if target.exists():return path
    target.parent.mkdir(parents=True,exist_ok=True)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(REMOTE+path,timeout=45) as response:data=response.read()
            assert len(data)>50
            target.write_bytes(data);return path
        except Exception:
            if attempt==2:raise
            time.sleep(1+attempt)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results=list(pool.map(fetch,paths))
print('Verified',len(results),'canonical images and icons')
