"""Stage genuine Unova PMD cycles from the audited revision, never edit the live game.
Missing variants are reported, not replaced by another species or recolored.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import json, urllib.request, xml.etree.ElementTree as ET, struct, time

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'modes/idle/unova'
STAGE = ROOT / 'tmp/unova-pmd-source'
source = json.loads((DATA / 'source/manifest.json').read_text(encoding='utf-8'))['sprites']
tracker = json.loads((DATA / 'source/sprite-tracker.json').read_text(encoding='utf-8'))
base = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/' + source['revision'] + '/'
STAGE.mkdir(parents=True, exist_ok=True)
errors, missing, variants, jobs = [], [], {}, {}

def download(relative):
    dest = STAGE / relative
    if dest.exists() and dest.stat().st_size:
        return dest.read_bytes()
    for attempt in range(3):
        try:
            req = urllib.request.Request(base + relative, headers={'User-Agent': 'OakChess-assets'})
            data = urllib.request.urlopen(req, timeout=35).read()
            if relative.endswith('.png') and data[:8] != b'\x89PNG\r\n\x1a\n':
                raise ValueError('Invalid PNG')
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            return data
        except Exception:
            if attempt == 2:
                raise
            time.sleep(.4 * (attempt + 1))

def prepare(variant):
    xml = ET.fromstring(download('sprite/' + variant + '/AnimData.xml'))
    anims = {a.findtext('Name'): a for a in xml.findall('Anims/Anim')}
    selected = set()
    def include(name, seen=None):
        if name not in anims:
            return
        seen = set() if seen is None else seen
        if name in seen:
            raise ValueError('Cyclic animation alias')
        selected.add(name)
        target = anims[name].findtext('CopyOf')
        if target:
            include(target, seen | {name})
    for name in ['Idle', 'Walk', 'Attack', 'Shoot', 'Strike', 'Hurt', 'Sleep', 'Faint', 'Charge']:
        include(name)
    if 'Walk' not in selected:
        raise ValueError('No walking cycle')
    sheet_jobs = {}
    for name in selected:
        anim = anims[name]
        if anim.findtext('CopyOf'):
            continue
        w, h = int(anim.findtext('FrameWidth')), int(anim.findtext('FrameHeight'))
        frames = len(anim.findall('Durations/Duration'))
        if min(w, h, frames) <= 0:
            raise ValueError('Invalid dimensions')
        sheet_jobs['sprite/' + variant + '/' + name + '-Anim.png'] = {'w': w, 'h': h, 'frames': frames}
    # Retain only cycles installed by this preparation, with all alias dependencies.
    for anim in list(xml.find('Anims')):
        if anim.findtext('Name') not in selected:
            xml.find('Anims').remove(anim)
    download('sprite/' + variant + '/credits.txt')
    return ET.tostring(xml, encoding='unicode'), sheet_jobs

available = []
for key, entry in tracker.items():
    for suffix, variant_entry in [('', entry), ('/0000/0001', entry.get('subgroups', {}).get('0000', {}).get('subgroups', {}).get('0001', {}))]:
        variant = key + suffix
        if 'Walk' not in variant_entry.get('sprite_files', {}):
            missing.append({'variant': variant, 'name': entry['name'], 'reason': 'No genuine Walk animation in pinned tracker'})
        else:
            available.append(variant)

print('Available variants:', len(available), 'missing:', len(missing), flush=True)
with ThreadPoolExecutor(max_workers=10) as pool:
    futures = {pool.submit(prepare, v): v for v in available}
    for count, future in enumerate(as_completed(futures), 1):
        variant = futures[future]
        try:
            xml, sheets = future.result()
            variants[variant] = xml
            jobs.update(sheets)
        except Exception as error:
            errors.append({'variant': variant, 'error': str(error)})
        if count % 60 == 0:
            print('Metadata:', count, '/', len(available), flush=True)

with ThreadPoolExecutor(max_workers=12) as pool:
    futures = {pool.submit(download, p): p for p in jobs}
    for count, future in enumerate(as_completed(futures), 1):
        relative = futures[future]
        try:
            data = future.result()
            w, h = struct.unpack('>II', data[16:24])
            meta = jobs[relative]
            if w != meta['w'] * meta['frames'] or h % meta['h'] or h // meta['h'] not in [1, 8]:
                raise ValueError('Sprite/XML geometry mismatch')
        except Exception as error:
            errors.append({'path': relative, 'error': str(error)})
        if count % 250 == 0:
            print('Sheets:', count, '/', len(jobs), flush=True)

download('credit_names.txt')
manifest = {'source': source, 'variants': variants, 'sheets': jobs, 'missing': missing, 'errors': errors}
(STAGE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print('Prepared:', len(variants), 'variants,', len(jobs), 'sheets,', len(errors), 'errors', flush=True)
if errors:
    raise SystemExit(1)
