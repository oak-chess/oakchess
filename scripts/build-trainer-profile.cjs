/* Promote approved profile UI into deployable game assets. */
const fs=require('fs'),path=require('path'),vm=require('vm');const root=path.resolve(__dirname,'..'),src=path.join(root,'prototypes/trainer-profile'),out=path.join(root,'assets/trainer-profile');fs.mkdirSync(out,{recursive:true});
const styles=['profile','pokedex-console','trainer-card','trainer-home','focused-profile','tablet-home','digital-terminal','applications','terminal-polish','trainer-registry','arena-gallery','identity-header'];
fs.writeFileSync(path.join(out,'styles.css'),styles.map(n=>fs.readFileSync(path.join(src,n+'.css'),'utf8')).join('\n'));
const scripts=['art','expansion','partner-sprites','profile','duo','victory','emotes','console-effects','trainer-home','card-arena','applications'];
for(const name of scripts){let s=fs.readFileSync(path.join(src,name+'.js'),'utf8').replaceAll('prototypes/trainer-profile/','assets/trainer-profile/');
 if(name==='profile'){
 s=s.replace("const key='profile.v1'","const key='oakchess_trainer_profile_v1'");
 s=s.replace('const progress=()=>presets[preset]','const progress=()=>window.TRAINER_PROFILE_DATA.snapshot()');
 s=s.replace("document.body.append(sheet);","sheet.hidden=true;document.body.append(sheet);");
 s=s.replace("function apply(){persist();","function apply(){validateChoices();persist();");
 s=s.replace("function parseBackup(raw){","function parseBackup(raw){throw new Error('Use os dados salvos neste navegador.');");
 s=s.replace("const equipped=(o,kind=tab)","const equipped=(o,kind=tab)");
 s=s.replace("open.onclick=()=>{","open.onclick=()=>{validateChoices();render();apply();");
 s=s.replace("window.TRAINER_PROFILE_API={catalogs,","window.TRAINER_PROFILE_API={refresh(){validateChoices();render();apply()},catalogs,");
 s=s.replace("q('[data-close]').focus();\n})();","if(!sheet.hidden)q('[data-close]').focus();\n})();");
 }
 if(name==='expansion'){const box={window:{}};vm.runInNewContext(s,box);box.window.TRAINER_PROFILE_EXPANSION.achievements=[];s='window.TRAINER_PROFILE_EXPANSION='+JSON.stringify(box.window.TRAINER_PROFILE_EXPANSION)+';';}
 if(name==='applications')s=s.replace("const collection=E('section','ta-collection'),list=E('div','ta-list');body.append(collection);", "const collection=E('section','ta-collection'),list=E('div','ta-list');body.append(collection);if(kind==='trainer'){const label=E('label','ta-player-name','Nome do treinador'),input=E('input');input.value=api.state.name;input.maxLength=20;input.setAttribute('aria-label','Nome do treinador');input.onchange=()=>{const field=root.querySelector('.tp-label input');field.value=input.value;field.dispatchEvent(new Event('input'))};label.append(input);collection.append(label)}");
 if(name==='card-arena'){s=s.replaceAll('profile.arena-background.v1','oakchess_trainer_arena_v1');s=s.replace("let selected='terminal'","try{const oldArena=localStorage.getItem('profile.arena-background.v1');if(oldArena&&entries.some(o=>o.id===oldArena&&ready(o))){localStorage.setItem('oakchess_trainer_arena_v1',oldArena);localStorage.removeItem('profile.arena-background.v1')}}catch{}\n "+"let selected='terminal'");}
 if(name==='trainer-home')s=s.replace('profile.v1','oakchess_trainer_profile_v1');
 const words=[['Escolhas salvas somente no protótipo.','Perfil salvo neste navegador.'],['Prévia com progresso de exemplo · alterações salvas neste protótipo','Progresso salvo neste navegador'],['progresso de exemplo','progresso registrado'],[' Nova proposta para o perfil.',''],[' Conquista já existente no jogo.',''],['Prévia com progresso de exemplo · salvo apenas neste protótipo','Progresso salvo neste navegador']];for(const [a,b]of words)s=s.split(a).join(b);
 fs.writeFileSync(path.join(out,name+'.js'),s);
}
const achievementSource=fs.readFileSync(path.join(root,'assets/achievements.js'),'utf8'),rows=vm.runInNewContext(achievementSource.match(/const defs=(\[[\s\S]*?\])\.map\(a=>/)[1]);fs.writeFileSync(path.join(out,'achievement-catalog.js'),'window.TRAINER_PROFILE_ACHIEVEMENTS='+JSON.stringify(rows.map(a=>({id:a[0],name:a[1],desc:a[2],category:a[3],target:a[4],kind:a[5],reward:a[6],color:a[7],secret:a[0]==='legend'})))+';');
fs.cpSync(path.join(src,'sprites'),path.join(out,'sprites'),{recursive:true});
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');html=html.replace(/<!-- trainer-profile:start -->[\s\S]*?<!-- trainer-profile:end -->/,'');const tags=['data', 'art','achievement-catalog','expansion','partner-sprites','profile','duo','victory','emotes','console-effects','trainer-home','card-arena','applications','runtime'].map(n=>'<script src="assets/trainer-profile/'+n+'.js?v='+(['profile','duo'].includes(n)?'biker-2':n==='runtime'?'5':n==='card-arena'?'2':['applications','trainer-home'].includes(n)?'notice-game-6':'1')+'"></script>').join('\n');html=html.replace('</body>','<!-- trainer-profile:start -->\n<link rel="stylesheet" href="assets/trainer-profile/styles.css?v=notice-game-7">\n'+tags+'\n<!-- trainer-profile:end -->\n</body>');fs.writeFileSync(path.join(root,'index.html'),html);
