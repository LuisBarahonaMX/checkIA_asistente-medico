import React, {useEffect, useMemo, useRef, useState} from 'react';
import './nasa-workspace.css';
import {useNasaAudio} from './nasa-audio.js';

const keyOf = q => String(q.id);
const baseValue = v => v && typeof v === 'object' && !Array.isArray(v) && 'value' in v ? v.value : v;
const asArray = v => Array.isArray(v) ? v.map(String) : v == null ? [] : [String(v)];
const hasAnswer = v => v !== undefined && v !== null && v !== '' && (!Array.isArray(v) || v.length > 0);
const emergencyMessage = 'SIMULACIÓN: evaluación pausada. Solicita asistencia por el canal real de emergencias de la nave y sigue únicamente los procedimientos locales autorizados. Esta aplicación NO ha notificado a la tripulación.';

function InputForQuestion({q, value, onChange, onSelect}) {
  const v = baseValue(value);
  const options = q.options || [];
  if (['single_select','yes_no','multi_select'].includes(q.type)) {
    const multiple = q.type === 'multi_select';
    const current = asArray(v);
    return <div className="nasa-choices" role={multiple?'group':'radiogroup'} aria-label={q.text}>
      {options.map(opt => {
        const selected = current.includes(String(opt.value));
        const toggle = () => {
          onSelect?.();
          if (!multiple) return onChange(String(opt.value));
          const exclusive = (q.exclusiveOptions || []).map(String);
          if (selected) return onChange(current.filter(x => x !== String(opt.value)));
          if (exclusive.includes(String(opt.value))) return onChange([String(opt.value)]);
          return onChange([...current.filter(x => !exclusive.includes(x)), String(opt.value)]);
        };
        return <button key={opt.value} type="button" role={multiple?'checkbox':'radio'} aria-checked={selected}
          className={'nasa-choice'+(multiple?' multiple':'')+(selected?' selected':'')} onClick={toggle}>
          <span className="nasa-choice-dot" aria-hidden="true"/>
          <span className="nasa-choice-label">{opt.label}</span>
        </button>;
      })}
    </div>;
  }
  if (q.type === 'scale') return <div className="nasa-scale">
    <div className="nasa-scale-labels"><span>1: {q.scale?.minLabel}</span><span>10: {q.scale?.maxLabel}</span></div>
    <div className="nasa-scale-numbers">{Array.from({length:10},(_,i)=>i+1).map(n=><button type="button" key={n} className={String(v)===String(n)?'active':''} aria-pressed={String(v)===String(n)} onClick={()=>{onSelect?.();onChange(n)}}>{n}</button>)}</div>
    {(q.specialOptions||[]).map(o=><button className={'nasa-special'+(v===o.value?' active':'')} type="button" key={o.value} onClick={()=>{onSelect?.();onChange(o.value)}}>{o.label}</button>)}
  </div>;
  if (String(q.id)==='4') return <div>
    <label className="nasa-measure-label" htmlFor="nasa-weight-4">Peso o masa corporal actual (kg)</label>
    <input className="nasa-measure-input" id="nasa-weight-4" type="text" inputMode="text" placeholder="Ejemplo: 78.5, 78 kg o No sé" value={v??''} onChange={e=>onChange(e.target.value)}/>
    <p className="nasa-measure-hint">Introduce el valor medido. La estatura en centímetros se solicita a continuación.</p>
  </div>;
  const numeric = q.type==='number';
  return <div>
    <label htmlFor={'nasa-input-'+q.id}>Respuesta {q.unit ? '('+q.unit+')' : ''}</label>
    <textarea id={'nasa-input-'+q.id} rows={3} maxLength={900} autoComplete="off" placeholder={numeric?'Escribe un número con su unidad, o No sé':q.type==='duration'?'Ej. 7 horas 30 minutos':'Describe tu respuesta; puedes indicar No sé o No disponible'} value={v??''} onChange={e=>onChange(e.target.value)} />
  </div>;
}

function Followup({f, value, onChange}) {
  const isMeasure=f.key==='height_cm';
  return <div className="nasa-followup">
    <label htmlFor={'fu-'+f.key}>{f.text}</label>
    <input id={'fu-'+f.key} type="text" inputMode={isMeasure?'text':undefined}
      autoComplete="off" maxLength={isMeasure?undefined:250} value={value ?? ''}
      placeholder={isMeasure?'Ejemplo: 175':f.type==='number'?'Cantidad y unidad':f.type==='datetime'?'Fecha y hora, o No sé':'Detalles (si corresponde)'}
      onChange={e=>onChange(e.target.value)}/>
  </div>;
}

function applicable(f, selected) {
  const value = baseValue(selected);
  const rule = f.whenAnswer;
  if (!rule || rule==='any') return hasAnswer(value);
  const possibilities = String(rule).split(',').map(s=>s.trim());
  return asArray(value).some(v=>possibilities.includes(v));
}

export default function NasaWorkspace({api}) {
  const [source,setSource] = useState(null), [loadError,setLoadError] = useState('');
  const [answers,setAnswers] = useState({}), [details,setDetails] = useState({});
  const [skipped,setSkipped] = useState({});
  const [testStatus,setTestStatus] = useState('');
  const [position,setPosition] = useState(0), [error,setError] = useState('');
  const [paused,setPaused] = useState(false),[incomplete,setIncomplete] = useState(false);
  const {enabled:audioEnabled, setEnabled:setAudioEnabled, volume,setVolume, start:audioStart, stop:audioStop, play:playSound} = useNasaAudio();
  const [started,setStarted] = useState(false);
  const [showCompletion,setShowCompletion] = useState(false);
  const [transitionKey,setTransitionKey] = useState(0);
  const completionTimer = useRef(null);
  useEffect(()=>()=>{clearTimeout(completionTimer.current);audioStop();},[audioStop]);
  const [consent,setConsent] = useState(false),[busy,setBusy]=useState(false),[evaluation,setEvaluation]=useState(null);
  useEffect(()=>{let alive=true;api('/nasa/questions').then(data=>{if(alive)setSource(data)}).catch(e=>{if(alive)setLoadError(e.message)});return()=>{alive=false};},[]);
  const ordered = useMemo(()=>source?[source.questions[0],source.branches.find(x=>x.id==='1.1'),source.questions[1],source.branches.find(x=>x.id==='2.1'),source.branches.find(x=>x.id==='2.1.1'),...source.questions.slice(2)].filter(Boolean):[],[source]);
  const q = ordered[position];
  const count = Object.keys(answers).filter(k=>/^\d+$/.test(k)&&Number(k)>=1&&Number(k)<=50 && hasAnswer(answers[k])).length;
  const skippedCount = Object.keys(skipped).filter(k=>/^\d+$/.test(k)&&Number(k)>=1&&Number(k)<=50&&skipped[k]).length;
  const completedCount = count + skippedCount;
  const val = q ? answers[keyOf(q)] : undefined;
  function change(value){
    if(!started){setStarted(true);audioStart();}
    setError('');setEvaluation(null);
    setSkipped(old=>{const next={...old};delete next[q.id];return next;});
    setAnswers(a=>({...a,[q.id]:value}));
    // Mandatory emergency screening: alert choices interrupt immediately; 'none' progresses.
    if(q.id==='2.1.1'){
      if(asArray(value).some(x=>x!=='10')){emergency();return;}
      if(asArray(value).includes('10')){playSound('next');setTransitionKey(k=>k+1);setPosition(i=>i+1);return;}
    }
    // Single-selection questions advance on the first click; no change to conditional or emergency behavior.
    if(['single_select','yes_no','scale'].includes(q.type)){
      if(q.id==='2.1' && (value==='immediate_help'||Number(value)>=9)){emergency();return;}
      if(q.id==='2.1.1' && asArray(value).some(x=>x!=='10')){emergency();return;}
      if(q.id==='50'){
        if(value==='2'){setPosition(0);return;}
        if(value==='3'){setIncomplete(true);return;}
        if(value==='1') {playSound('complete');audioStop();setShowCompletion(true);setPosition(ordered.length);return;}
      }
      playSound('next');setTransitionKey(k=>k+1);setPosition(i=>Math.min(ordered.length,i+1));
    }
  }
  function skipCurrent(){
    if(!q||busy||['1.1','2.1','2.1.1','50'].includes(String(q.id)))return;
    setSkipped(v=>({...v,[q.id]:true}));
    setAnswers(v=>{const a={...v};delete a[q.id];return a;});
    setDetails(v=>{const d={...v};delete d[q.id];return d;});
    setError('');playSound('next');setTransitionKey(k=>k+1);setPosition(i=>i+1);
  }
  function restartAssessment(){
    audioStop();setAnswers({});setDetails({});setSkipped({});setPosition(0);setError('');
    setPaused(false);setIncomplete(false);setConsent(false);setEvaluation(null);
    setShowCompletion(false);setStarted(false);setTransitionKey(0);
  }
  function testAudio(){setStarted(true);audioStart();playSound('complete');setTestStatus('Sonido de prueba activado. Comprueba el volumen del dispositivo y la pestaña.');}
  const parseMass = (value) => {const found=String(value??'').replace(',','.').match(/-?\d+(?:\.\d+)?/);return found?Number(found[0]):null;};
  function emergency(){audioStop();setShowCompletion(false);setPaused(true);setError('');setEvaluation(null);}
  function next(e){
    e?.preventDefault();
    if(!q || busy)return;
    if(!hasAnswer(val) && !skipped[q.id]){setError('Responde esta pregunta o utiliza Omitir pregunta cuando esté permitido.');return;}
    if (q.id==='2.1' && (val==='immediate_help'||Number(val)>=9)) return emergency();
    if (q.id==='2.1.1' && asArray(val).some(x=>x!=='10')) return emergency();

    if (q.id==='32' && asArray(val).some(x=>['1','2','3','4','5','7'].includes(x)) && /^(si|sí|yes|1)$/i.test((details['32']?.incident_active||'').trim())) return emergency();
    if (q.id==='50') {
      if (val==='2'){setPosition(0);setError('Puedes revisar y corregir tus respuestas. Regresa a la pregunta de confirmación para continuar.');return;}
      if (val==='3'){setIncomplete(true);return;}
      if(completedCount!==50){setError('Responde u omite expresamente las 50 preguntas principales antes de confirmar.');return;}playSound('complete');audioStop();setShowCompletion(true);setPosition(ordered.length);clearTimeout(completionTimer.current);completionTimer.current=setTimeout(()=>setShowCompletion(false),1800);return;
    }
    playSound('next');setTransitionKey(k=>k+1);setPosition(i=>i+1);setError('');
  }
  async function evaluate(){
    if (!consent){setError('Debes aceptar expresamente el envío de esta simulación a Adaption Labs.');return;}
    if (completedCount!==50 || !hasAnswer(answers['1.1']) || !hasAnswer(answers['2.1']) || !hasAnswer(answers['2.1.1']) || answers['50']!=='1'){setError('Completa el perfil, el control de emergencias y la confirmación. Responde u omite las preguntas ordinarias.');return;}
    setBusy(true);setError('');
    try{
      const packed={};
      for(const item of ordered){const id=item.id;const sub=details[id];packed[id]=skipped[id]?{skipped:true}:sub&&Object.keys(sub).length?{value:answers[id],details:sub}:answers[id];}
      const data=await api('/nasa/evaluate','POST',{answers:packed,consent:true});
      if(data.paused || data.emergency){emergency();return;}
      setEvaluation(data);
    }catch(e){setError(e.message||'No se pudo completar la simulación.');}
    finally{setBusy(false);}
  }
  if(loadError)return <section className="nasa-panel"><h2>Modo NASA</h2><p role="alert">No se pudo cargar el cuestionario: {loadError}</p></section>;
  if(!source)return <section className="nasa-panel"><p role="status">Cargando cuestionario CUBE…</p></section>;
  return <section className="nasa-panel" lang="es-MX" id="main-content" tabIndex={-1}>
    <div className="nasa-heading"><img src="/nasa_logo.jpg" width="72" height="59" alt="Insignia NASA de referencia; proyecto independiente sin respaldo oficial de NASA" className="nasa-reference-logo" onError={e=>{e.currentTarget.hidden=true}}/><p className="nasa-kicker">CHECK_IA_CUBE_NASA</p><h2>Evaluación experimental de salud a bordo</h2><p>Simulación técnica. No es un sistema certificado por NASA ni reemplaza al personal médico o los procedimientos de emergencia de la nave.</p></div>
    <div className="nasa-start-action">{!started && !evaluation && <button type="button" onClick={()=>{setStarted(true);audioStart();}}>Activar audio de evaluación</button>}</div>
    {paused ? <div className="nasa-alert" role="alert"><h3>Evaluación pausada por posible emergencia</h3><p>{emergencyMessage}</p><button type="button" onClick={()=>{setPaused(false);setPosition(0)}}>Reiniciar simulación (conservar respuestas)</button></div>
    : incomplete ? <div className="nasa-card"><h3>Sesión incompleta</h3><p>Las respuestas solo permanecen en la memoria de esta página. No se guardaron en Firestore y se perderán si recargas o cierras la pestaña.</p><button type="button" onClick={()=>{setIncomplete(false);setPosition(0)}}>Continuar respondiendo</button></div>
    : evaluation ? <div className="nasa-card"><h3>Resultado experimental</h3><p>No validado clínicamente. No se notificó a la tripulación.</p>{Object.entries(evaluation.result||{}).map(([key,value])=><div key={key}><h4>{key.replaceAll('_',' ')}</h4>{Array.isArray(value)?<ul>{value.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p>{value}</p>}</div>)}<div className="nasa-final-links"><a href="https://www.youtube.com/watch?v=k1O5sgkrids" target="_blank" rel="noopener noreferrer">Ver el video del proyecto CHECK_IA NASA</a><button type="button" onClick={restartAssessment}>Reiniciar evaluación</button></div></div>
    : position===ordered.length ? <div className="nasa-card">{showCompletion&&<div className="nasa-completion" role="status"><span className="nasa-completion-ring">✓</span><strong>EVALUACIÓN COMPLETADA</strong><small>Respuestas de evaluación registradas</small></div>}<h3>Cuestionario confirmado: {count} respondidas, {skippedCount} omitidas (50 en total)</h3><p>La evaluación enviará las respuestas de prueba a Adaption Labs. No se utilizará el corpus médico de CHECK_IA.</p><label className="nasa-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Acepto enviar datos ficticios de simulación a Adaption Labs para generar el resultado. No utilizar información real de astronautas.</label>{error&&<p role="alert" className="nasa-error">{error}</p>}<div className="nasa-actions"><button type="button" onClick={()=>setPosition(ordered.length-1)}>Anterior</button><button disabled={!consent||busy} type="button" onClick={evaluate}>{busy?'Generando…':'Generar evaluación con Adaption'}</button></div></div>
    : <div className="nasa-card nasa-question-transition" key={transitionKey}><div className="nasa-progress"><span>Pregunta {q.id} · {completedCount}/50 registradas ({skippedCount} omitidas)</span><progress max={50} value={count}/></div><form onSubmit={next} autoComplete="off"><div className="nasa-question-head"><h3>{q.text}</h3>{!['1.1','2.1','2.1.1','50'].includes(String(q.id)) && <button type="button" className="nasa-skip" onClick={skipCurrent}>Omitir pregunta</button>}</div><InputForQuestion q={q} value={val} onChange={change} onSelect={()=>playSound('select')}/>{q.id==='1.1'&&source.crewProfiles?.find(p=>p.id===val)&&<div className="nasa-followup"><strong>Perfil ficticio cargado</strong><p>{(()=>{const p=source.crewProfiles.find(p=>p.id===val);return `${p.name} (${p.id}) · ${p.ageYears} años · ${p.heightCm} cm · masa de referencia ${p.baselineWeightKg} kg`;})()}</p><p>{(()=>{const p=source.crewProfiles.find(p=>p.id===val);return `Antecedentes médicos: ${p.medicalHistory.join('; ')}. Alergias: ${p.allergies.join('; ')}. Medicamentos: ${p.currentMedications.join('; ')||'Sin registro'}.`;})()}</p></div>}{(q.followups||[]).filter(f=>applicable(f,val)).map(f=><Followup key={f.key} f={f} value={details[q.id]?.[f.key]} onChange={v=>setDetails(d=>({...d,[q.id]:{...(d[q.id]||{}),[f.key]:v}}))}/>)}{String(q.id)==='4' && <div className="nasa-microgravity" role="note">{Number.isFinite(parseMass(val)) && parseMass(val)>0 ? `Tu masa es aproximadamente ${parseMass(val)} kg. En microgravedad y flotación libre, el peso aparente es aproximadamente cero, pero la masa permanece en ${parseMass(val)} kg.` : 'La microgravedad no modifica la masa. Introduce un valor de masa medible para mostrar un ejemplo ilustrativo; no es una medición clínica.'}</div>}{error&&<p className="nasa-error" role="alert">{error}</p>}<div className="nasa-actions"><button type="button" disabled={position===0} onClick={()=>{setPosition(p=>p-1);setError('')}}>Anterior</button><button type="submit">{q.id==='50'?'Aplicar selección':'Siguiente'}</button></div></form></div>}
    <div className="nasa-audio-bottom"><div className="nasa-mission-settings" aria-label="Configuración del audio de misión">
      <label><input type="checkbox" checked={audioEnabled} onChange={e=>setAudioEnabled(e.target.checked)}/> Audio ambiental</label>
      <label>Volumen <input aria-label="Volumen del audio ambiental" type="range" min="0" max="50" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label>
      <button type="button" onClick={testAudio}>Probar sonido</button>
    </div>{testStatus&&<small role="status">{testStatus}</small>}</div>
    <p className="nasa-footnote">Este prototipo no guarda respuestas en un servidor ni en GitHub. No hay alertas reales, telemetría ni procedimientos operativos conectados.</p>
  </section>;
}
