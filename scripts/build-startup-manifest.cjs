// Regenerate after adding or removing runtime assets.
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const files=[];
function walk(dir){
 for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
  const name=path.join(dir,entry.name);
  if(entry.isDirectory()){if(name.replaceAll('\\','/')!=='assets/dex/pmd')walk(name);}
  else if(/\.(png|webp|jpe?g|gif|svg|ogg|mp3|wav|m4a|json|css|js|woff2?|ttf)$/i.test(entry.name)&&entry.name!=='startup-manifest.json')files.push([name.replaceAll('\\','/'),fs.statSync(path.join(root,name)).size]);
 }
}
walk('assets');
if(fs.existsSync(path.join(root,'wallpapers')))walk('wallpapers');
fs.writeFileSync(path.join(root,'assets/startup-manifest.json'),JSON.stringify(files));

const indexPath=path.join(root,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
const tag='<script id="startup-resources">window.OAK_STARTUP_FILES='+JSON.stringify(files)+';</script>';
if(html.includes('<script id="startup-resources">'))html=html.replace(/<script id="startup-resources">[\s\S]*?<\/script>/,()=>tag);
else html=html.replace('<script src="assets/startup-loader.js"></script>',()=>tag+'\n<script src="assets/startup-loader.js"></script>');
fs.writeFileSync(indexPath,html);
