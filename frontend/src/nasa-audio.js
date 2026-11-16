import {useCallback,useEffect,useRef,useState} from 'react';

// No third-party audio or remote resources. Web Audio API uses low-volume synthetic tones.
export function useNasaAudio(){
  const ctxRef=useRef(null), ambientRef=useRef(null);
  const [enabled,setEnabled]=useState(true),[volume,setVolume]=useState(12);
  const activeRef=useRef(false),enabledRef=useRef(enabled),volumeRef=useRef(volume);
  enabledRef.current=enabled;volumeRef.current=volume;
  const getContext=useCallback(()=>{
    if(typeof window==='undefined')return null;
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)return null;
    if(!ctxRef.current)ctxRef.current=new C();
    if(ctxRef.current.state==='suspended')ctxRef.current.resume().catch(()=>{});
    return ctxRef.current;
  },[]);
  const stop=useCallback(()=>{
    activeRef.current=false;
    if(ambientRef.current){try{ambientRef.current.osc.forEach(o=>o.stop());}catch{}ambientRef.current=null;}
  },[]);
  const start=useCallback(()=>{
    activeRef.current=true;
    if(!enabledRef.current||ambientRef.current)return;
    const ctx=getContext();if(!ctx)return;
    const gain=ctx.createGain();gain.gain.value=0;gain.connect(ctx.destination);
    const osc=[110,164.81,220].map((hz,i)=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=hz;o.connect(gain);o.start();return o;});
    gain.gain.setTargetAtTime((volumeRef.current/100)*0.40,ctx.currentTime,1.2);
    ambientRef.current={osc,gain};
  },[getContext]);
  const play=useCallback((kind='select')=>{
    if(!enabledRef.current)return;
    const ctx=getContext();if(!ctx)return;
    const frequency=kind==='complete'?740:kind==='next'?510:660;
    const duration=kind==='complete'?.38:kind==='next'?.17:.075;
    const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';
    osc.frequency.setValueAtTime(frequency,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency*(kind==='complete'?1.42:1.13),ctx.currentTime+duration);
    gain.gain.setValueAtTime(.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002,(volumeRef.current/100)*.30),ctx.currentTime+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration+.01);
  },[getContext]);
  useEffect(()=>{if(!enabled){if(ambientRef.current){try{ambientRef.current.osc.forEach(o=>o.stop());}catch{}ambientRef.current=null;}}else if(activeRef.current)start();},[enabled,start]);
  useEffect(()=>{if(ambientRef.current){ambientRef.current.gain.gain.setTargetAtTime((volume/100)*.40,ctxRef.current.currentTime,.1);}},[volume]);
  useEffect(()=>()=>{stop();ctxRef.current?.close().catch(()=>{});},[stop]);
  return {enabled,setEnabled,volume,setVolume,start,stop,play};
}
