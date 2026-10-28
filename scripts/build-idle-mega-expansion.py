"""Generate the 22 approved definitions from PokeAPI CSV base stats/types.
Inputs: expansion-specs.json and official CSVs in tmp/dex-source.
Existing nine definitions and saved keys are not rewritten.
"""
import csv,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'modes/idle/mega'
specs=json.loads((BASE/'expansion-specs.json').read_text(encoding='utf-8'))
def table(name):return list(csv.DictReader((ROOT/'tmp/dex-source'/name).open(encoding='utf-8')))
pokemon=table('pokemon.csv');stats={};types={}
for row in table('pokemon_stats.csv'):stats.setdefault(int(row['pokemon_id']),{})[int(row['stat_id'])]=int(row['base_stat'])
for row in table('pokemon_types.csv'):types.setdefault(int(row['pokemon_id']),[]).append((int(row['slot']),int(row['type_id'])))
tn={1:'normal',2:'fighting',3:'flying',4:'poison',5:'ground',6:'rock',7:'bug',8:'ghost',9:'steel',10:'fire',11:'water',12:'grass',13:'electric',14:'psychic',15:'ice',16:'dragon',17:'dark',18:'fairy'}
defs=[];arenas=[];audit=[]
for s in specs:
    slug=s['name'].lower()+('-mega-y' if s['key']=='charizard-y' else '-mega')
    row=next(r for r in pokemon if r['identifier']==slug);pid=int(row['species_id']);mega=int(row['id']);form=s.get('form',1)
    ratios={k:stats[mega][i]/stats[pid][i] for k,i in [('atk',2),('spell',4),('armor',3),('mr',5),('as',6)]}
    label='Mega '+s['name']+(' Y' if s['key']=='charizard-y' else '')
    visual='PAdventures / DistTopic · quatro direções originais; diagonais adaptadas. '+('Versão shiny de Pokétibia identificada e preservada.' if s.get('shinyCreature') else 'Shiny usa a arte animada da forma Mega, sem recolorir o sprite.')
    defs.append(dict(key=s['key'],id=pid,name=s['name'],label=label,stone=s['stone'],stoneIcon=s['icon'],form=form,sprite=mega,types=[tn[t] for slot,t in sorted(types[mega])],color=s['color'],stats=ratios,mechanic=s['mechanic'],bossSkill=s['skill'],visual=visual))
    arenas.append([s['key'],s['arena'],s['base'],s['texture'],s['dark'],s['light'],s['color']])
    audit.append(dict(key=s['key'],base=pid,mega=mega,baseStats=stats[pid],megaStats=stats[mega],types=[tn[t] for slot,t in sorted(types[mega])]))
js='/* Approved expansion; source stats audited in padventures/expansion-stats.json. */\nwindow.IDLE_MEGA_DEFS.push(...'+json.dumps(defs,ensure_ascii=False,separators=(',',':'))+');\nwindow.IDLE_MEGA_EXTRA_ARENAS='+json.dumps(arenas,ensure_ascii=False,separators=(',',':'))+';\n'
(BASE/'expansion-data.js').write_text(js,encoding='utf-8')
(BASE/'padventures/expansion-stats.json').write_text(json.dumps({'source':'https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv','rows':audit},indent=2)+'\n',encoding='utf-8')
print('Generated',len(defs),'definitions with canonical stats and types')
