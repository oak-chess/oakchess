// Generate the roster reference from the game's definitions, without running the game.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/passive-roster.js'),'utf8'),sandbox);
const roster=sandbox.window.PASSIVE_ROSTER;
const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/move-fx/emerald-catalog.js'),'utf8').split('window.EMERALD_CATALOG=')[1].trim().replace(/;$/,''));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),lines=new Map();
for(const m of html.matchAll(/^ln\(\d+,\[([\d,]+)\],\[([^\]]+)\]/gm)){
 const ids=m[1].split(',').map(Number),name=m[2].match(/^(['"])(.*?)\1/)?.[2];
 if(!lines.has(ids[0]))lines.set(ids[0],{ids,name});
}
const missing=[],invalid=[],rows=[];
for(const [id,line] of lines){
 const p=roster[id];if(!p){missing.push(line.name);continue;}
 for(const q of [p,...Object.values(p.forms||{})])if(!catalog.moves[q.move])invalid.push(q.move);
 const action=p.action==='heal'?'Cura':p.action==='shield'?'Escudo':p.action==='splash'?'Animação':p.drain?'Dano e drenagem':p.status?'Dano e '+p.status:'Dano';
 rows.push('| '+line.name+' | '+p.name+' | '+(p.chance?'18% por acerto':p.every+' acertos')+' | '+action+' |');
}
const introduction='# Golpes nas passivas\n\n'+lines.size+' linhas do elenco atual têm associação explícita em `assets/passive-roster.js`. As evoluções herdam a escolha da linha, com exceções por espécie: Metapod usa Endurecer, Butterfree usa Rajada e Gyarados usa Mordida. Magikarp usa Splash sem dano ou proteção.\n\n';
const details='\n## Regras\n\n- Implementação em `assets/passive-moves.js`, acionada por acertos básicos efetivos. Esquivas não contam.\n- Intervalo mínimo de 2s pelo relógio da batalha, contadores zerados por unidade ao iniciar o combate.\n- Golpes físicos usam defesa física; especiais usam defesa especial. Cura e escudos usam Poder.\n- Cura busca o aliado com menor proporção de PS. Escudos próprios duram 3s: ganho de até 6% dos PS máximos por ativação e sem adicionar acima de 15% dos PS máximos em escudo existente.\n- Contatos são resolvidos após 0,12s sem fazer o Pokémon flutuar; projéteis aplicam dano/condição na chegada.\n- Drenagem usa dano efetivo, incluindo escudos e excluindo excesso de dano. Relatórios recebem a atribuição normal de dano e cura.\n- Golpes passivos não são ataques básicos e não ativam a si mesmos. São cancelados se atacante/vítima morrerem ou a batalha terminar.\n- Propriedades anteriores de mobilidade, defesa e apoio são preservadas. Os seis gatilhos de ataque substituídos (kindling, foxflame, venomfang, voltage, thunderpulse e static) não são executados em duplicidade.\n- Os textos das passivas incluem as novas regras e as exceções de evolução. Os valores são escolhas iniciais de equilíbrio, ainda sem avaliação em partidas.\n- Estilhaço de Gelo usa os recursos visuais de Powder Snow, pois o golpe nominal surgiu depois do Emerald. As demais escolhas referenciam registros do catálogo importado.\n\nEsta tabela é gerada a partir das definições por `scripts/document-passive-moves.cjs`, sem executar partidas ou testes.\n';
fs.writeFileSync(path.join(root,'PASSIVE-MOVES.md'),introduction+'| Linha | Golpe | Ativação | Função |\n|---|---|---|---|\n'+rows.join('\n')+'\n'+details);
console.log(JSON.stringify({lines:lines.size,documented:rows.length,missing,invalidMoves:[...new Set(invalid)]}));
