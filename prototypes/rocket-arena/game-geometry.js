'use strict';
// Native game geometry: index.html (hexXY, benchXY, fit) and arena scene projection.
const RocketGeometry=Object.freeze({
 width:1280,height:800,radius:42,rows:8,cols:7,
 hex(r,col){const step=Math.sqrt(3)*42;return{x:(col-3.25+(r%2)*.5)*step,y:(r-3.5)*63}},
 bench(i){return{x:-240+i*60,y:292.5}},
 project(x,y,z=0,angled=true){
  if(!angled)return{x:640+x,y:332.5+y-z,s:1};
  const a=38*Math.PI/180,wy=(y-67.5)*1.02,wz=z*1.02;
  const k=2200/(2200-wy*Math.sin(a)-wz*Math.cos(a));
  return{x:640+x*1.02*k,y:400+(6+wy*Math.cos(a)-wz)*k,s:1.02*k};
 },
 fit(w,h){const scale=Math.min(w/1280,h/800);return{scale,left:(w-1280*scale)/2,top:0}}
});
