"""Stage consistent normal/shiny PMD animations for Johto from a pinned revision.
Never touches a save. Run build-idle-johto-pmd.cjs after all downloads succeed.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import urllib.request, json, time, xml.etree.ElementTree as ET, struct, sys

ROOT=Path(__file__).resolve().parents[1]
HOENN=False
STAGE=ROOT/'tmp/sinnoh-pmd-source'
STAGE.mkdir(parents=True,exist_ok=True)
HEAD='https://api.github.com/repos/PMDCollab/SpriteCollab/commits/master'
def fetch(url):
    request=urllib.request.Request(url,headers={'User-Agent':'OakChess-assets','Accept':'application/vnd.github+json' if 'api.github.com' in url else '*/*'})
    for attempt in range(3):
        try:return urllib.request.urlopen(request,timeout=45).read()
        except Exception:
            if attempt==2:raise
            time.sleep(.5*(attempt+1))

source_file=STAGE/'revision.json'
if source_file.exists(): source=json.loads(source_file.read_text())
else:
    commit=json.loads(fetch(HEAD));source={'repository':'https://github.com/PMDCollab/SpriteCollab','revision':commit['sha']}
    source_file.write_text(json.dumps(source,indent=2))
base='https://raw.githubusercontent.com/PMDCollab/SpriteCollab/'+source['revision']+'/'
print('Pinned source:',source['revision'],flush=True)
def download(relative,kind):
    dest=STAGE/relative
    if dest.exists() and dest.stat().st_size>0:content=dest.read_bytes()
    else:
        content=fetch(base+relative)
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(content)
    if kind=='xml':ET.fromstring(content)
    elif kind=='png':
        if content[:8]!=b'\x89PNG\r\n\x1a\n':raise ValueError('Not a PNG: '+relative)
    return relative

variants=[f'{ident:04d}'+suffix for ident in range(387,494) for suffix in ['', '/0000/0001']]
if HOENN:
    variants += [f'{ident:04d}/{form:04d}'+suffix for ident in [351,386] for form in [1,2,3] for suffix in ['', '/0001']]
errors=[]
with ThreadPoolExecutor(max_workers=10) as pool:
    futures={pool.submit(download,'sprite/'+p+'/AnimData.xml','xml'):p for p in variants}
    for future in as_completed(futures):
        try:future.result()
        except Exception as error:errors.append({'path':futures[future],'error':str(error)})
if errors:
    (STAGE/'errors.json').write_text(json.dumps(errors,indent=2));print(json.dumps(errors),flush=True);raise SystemExit(1)
print('Animation XMLs ready:',len(variants),flush=True)

jobs={};manifest={}
for p in variants:
    xml=(STAGE/'sprite'/p/'AnimData.xml').read_text(encoding='utf-8-sig')
    anims={a.findtext('Name'):a for a in ET.fromstring(xml).findall('.//Anim')}
    def resolve(name):
        seen=set()
        while name in anims and anims[name].findtext('CopyOf'):
            if name in seen:raise ValueError('Cyclic animation: '+p+' '+name)
            seen.add(name);name=anims[name].findtext('CopyOf')
        return anims.get(name)
    if not any(resolve(n) is not None for n in ['Idle','Walk']):raise ValueError('No idle/walk: '+p)
    for name,anim in anims.items():
        if anim.findtext('CopyOf'):continue
        width=int(anim.findtext('FrameWidth') or 0);height=int(anim.findtext('FrameHeight') or 0)
        durations=anim.findall('Durations/Duration')
        if width<=0 or height<=0 or not durations:raise ValueError('Invalid animation: '+p+' '+str(name))
        relative='sprite/'+p+'/'+name+'-Anim.png'
        jobs[relative]={'w':width,'h':height,'frames':len(durations)}
    manifest[p]=xml
print('Downloading physical sheets:',len(jobs),flush=True)
with ThreadPoolExecutor(max_workers=10) as pool:
    futures={pool.submit(download,p,'png'):p for p in jobs}
    for done,future in enumerate(as_completed(futures),1):
        try:future.result()
        except Exception as error:errors.append({'path':futures[future],'error':str(error)})
        if done%200==0:print('Sheets ready:',done,'/',len(jobs),flush=True)

# Validate geometry against the exact matching XML revision before installation.
if not errors:
    for relative,meta in jobs.items():
        w,h=struct.unpack('>II',(STAGE/relative).read_bytes()[16:24])
        if w%meta['w'] or h%meta['h'] or w//meta['w']!=meta['frames']:
            errors.append({'path':relative,'error':'Sheet/XML geometry mismatch'})
(STAGE/'errors.json').write_text(json.dumps(errors,indent=2))
if errors:print(json.dumps(errors),flush=True);raise SystemExit(1)
print('Fetching attribution records',flush=True)
with ThreadPoolExecutor(max_workers=10) as pool:
    credits={pool.submit(download,'sprite/'+p+'/credits.txt','text'):p for p in variants}
    for future in as_completed(credits):
        try:future.result()
        except Exception as error:errors.append({'path':credits[future]+'/credits.txt','error':str(error)})
download('credit_names.txt','text')
if errors:
    (STAGE/'errors.json').write_text(json.dumps(errors,indent=2));print(json.dumps(errors),flush=True);raise SystemExit(1)
(STAGE/'manifest.json').write_text(json.dumps({'source':source,'variants':list(manifest),'sheets':list(jobs)},indent=2))
print('Validated:',len(manifest),'variants,',len(jobs),'sheets',flush=True)
