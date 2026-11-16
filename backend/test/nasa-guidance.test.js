import test from 'node:test';
import assert from 'node:assert/strict';
import {nasaQuestions,inspectNasaAnswers} from '../src/nasa-mode.js';
const payload=nasaQuestions();
const ids=[...payload.questions,...payload.branches].map(q=>q.id);
test('50 preguntas y comprobación de emergencias de selección única',()=>{
 assert.equal(payload.questions.length,50);
 assert.equal(payload.branches.length,3);
 assert.equal(payload.branches.find(q=>q.id==='2.1.1').type,'single_select');
 assert.equal(Object.keys(payload.emergencyGuidance.emergencies).length,9);
});
test('nueve emergencias abren guía local aun sin contestar las restantes',()=>{
 for(let i=1;i<=9;i++){
  const r=inspectNasaAnswers({'2.1.1':String(i)});
  assert.equal(r.paused,true);
  assert.ok(r.guidance.title);
 }
});
test('las respuestas omitidas explícitamente permiten resumen parcial',()=>{
 const skipped=ids.filter(id=>id!=='2.1.1');
 const r=inspectNasaAnswers({'2.1.1':'10'},skipped);
 assert.equal(r.paused,false);
 assert.equal(r.skippedQuestionIds.length,52);
});
test('no permite respuestas faltantes sin registrar como omitidas',()=>{
 assert.throws(()=>inspectNasaAnswers({'2.1.1':'10'},[]),/Falta respuesta/);
});
test('no permite omitir comprobación de emergencias ni declarar respuestas omitidas como contestadas',()=>{
 assert.throws(()=>inspectNasaAnswers({},ids),/comprobación de emergencias/);
 assert.throws(()=>inspectNasaAnswers({'2.1.1':'10','2.1':4},ids.filter(id=>id!=='2.1.1')),/respondida y omitida/);
});
test('las selecciones múltiples de emergencia siguen rechazadas',()=>{
 assert.throws(()=>inspectNasaAnswers({'2.1.1':['1','2']}),/Selecciona una opción/);
});
