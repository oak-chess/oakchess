/* Extract source MIDI note sequences for the browser's lightweight synthesizer. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'tmp/emerald-source/pokeemerald-master/sound/songs/midi');
const sounds={},instruments={sounds:{},samples:{}};
function parse(buffer){
 const division=buffer.readUInt16BE(12);if(division&0x8000)return [];
 const events=[];let offset=8+buffer.readUInt32BE(4),lastTick=0;
 while(offset+8<=buffer.length){const length=buffer.readUInt32BE(offset+4),end=offset+8+length;let p=offset+8,tick=0,status=0;const open=new Map(),programs={};
  function variable(){let n=0,v;do{v=buffer[p++];n=n*128+(v&127)}while(v&128&&p<end);return n}
  while(p<end){tick+=variable();let command=buffer[p];if(command&128){status=command;p++}else command=status;
   if(command===0xff){const kind=buffer[p++],size=variable();if(kind===0x51&&size===3)events.push({tick,tempo:buffer.readUIntBE(p,3)});p+=size;continue}
   if(command===0xf0||command===0xf7){const size=variable();p+=size;continue}
   const kind=command&240,channel=command&15,a=buffer[p++],b=(kind===0xc0||kind===0xd0)?0:buffer[p++];
   const key=channel+':'+a;
   if(kind===0xc0)programs[channel]=a;
   if(kind===0x90&&b>0)open.set(key,{tick,pitch:a,velocity:b,channel,program:programs[channel]||0});
   if(kind===0x80||(kind===0x90&&b===0)){const note=open.get(key);if(note){events.push({...note,end:tick});open.delete(key)}}
   lastTick=Math.max(lastTick,tick);
  }
  for(const note of open.values())events.push({...note,end:Math.max(note.tick+division/8,lastTick)});
  offset=end;
 }
 const tempos=events.filter(e=>e.tempo).sort((a,b)=>a.tick-b.tick);
 function seconds(tick){let time=0,start=0,tempo=500000;for(const e of tempos){if(e.tick>tick)break;time+=(e.tick-start)*tempo/division/1e6;start=e.tick;tempo=e.tempo}return time+(tick-start)*tempo/division/1e6}
 return events.filter(e=>e.pitch!=null).sort((a,b)=>a.tick-b.tick).map(e=>[+seconds(e.tick).toFixed(4),+(seconds(e.end)-seconds(e.tick)).toFixed(4),e.pitch,e.velocity,e.channel,e.program]);
}
const sourceRoot=path.join(root,'tmp/emerald-source/pokeemerald-master'),config=fs.readFileSync(path.join(source,'midi.cfg'),'utf8'),waveFiles={};
for(const m of fs.readFileSync(path.join(sourceRoot,'sound/direct_sound_data.inc'),'utf8').matchAll(/(DirectSoundWaveData_\w+)::\s*\.incbin "([^"]+)\.bin"/g))waveFiles[m[1]]=m[2]+'.wav';
for(const file of fs.readdirSync(source).filter(n=>/^se_m.*\.mid$/.test(n))){
 const notes=parse(fs.readFileSync(path.join(source,file)));if(!notes.length)continue;
 const key=path.basename(file,'.mid').toUpperCase();sounds[key]=notes;
 const group=config.split(/\r?\n/).find(l=>l.startsWith(file+':'))?.match(/-G_(\w+)/)?.[1];
 const groupPath=group&&path.join(sourceRoot,'sound/voicegroups',group+'.inc');if(!groupPath||!fs.existsSync(groupPath))continue;
 const voices=fs.readFileSync(groupPath,'utf8').split(/\r?\n/).map(l=>l.trim()).filter(l=>/^voice_/.test(l)&&!/^voice_group /.test(l));
 const mapping={};
 for(const program of new Set(notes.map(n=>n[5]))){
  const definition=voices[program];if(!definition)continue;
  const sample=definition.match(/DirectSoundWaveData_\w+/)?.[0],relative=waveFiles[sample],wave=relative&&path.join(sourceRoot,relative);
  if(wave&&fs.existsSync(wave)){
   if(!instruments.samples[sample])instruments.samples[sample]=fs.readFileSync(wave).toString('base64');
   mapping[program]={sample,root:Number(definition.match(/^\w+\s+(\d+)/)?.[1]||60),fixed:/no_resample/.test(definition),reverse:/reverse/.test(definition)};
  }else mapping[program]={wave:/noise/.test(definition)?'noise':/square/.test(definition)?'square':/programmable_wave/.test(definition)?'triangle':'sine'};
 }
 instruments.sounds[key]=mapping;
}
fs.writeFileSync(path.join(root,'assets/move-fx/emerald-audio.js'),'/* Source MIDI notes; browser synthesis adapts the original timbres. */\nwindow.EMERALD_AUDIO='+JSON.stringify(sounds)+';\n');
fs.writeFileSync(path.join(root,'assets/move-fx/emerald-instruments.js'),'/* Original source samples and adapted voice-group definitions. */\nwindow.EMERALD_INSTRUMENTS='+JSON.stringify(instruments)+';\n');
console.log(JSON.stringify({soundSequences:Object.keys(sounds).length,originalSamples:Object.keys(instruments.samples).length}));
