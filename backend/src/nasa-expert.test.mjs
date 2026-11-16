import test from 'node:test';
import assert from 'node:assert/strict';
import {buildNasaExpertContext,inspectExpertKnowledge} from './nasa-expert.js';

test('corpus 50 registros, 10 áreas y sin validación clínica', () => {
 const v=inspectExpertKnowledge(); assert.equal(v.records,50); assert.equal(v.areas,10); assert.equal(v.clinicallyValidated,false);
});
test('detecta referencias contextuales para alerta ambiental', () => {
 const c=buildNasaExpertContext({'32':['1','7'],'38':['1']});
 assert.ok(c.areasDetectadas.includes('environment_pressure')); assert.ok(c.areasDetectadas.includes('radiation'));
 assert.ok(c.listasDeVerificacion.every(x=>x.evidencia_clinica_validada===false));
});
test('no genera diagnóstico ni valores clínicos', () => {
 const c=buildNasaExpertContext({'32':['9'],'38':['1']});
 assert.equal(c.validatedForClinicalUse,false);
 assert.ok(c.listasDeVerificacion.length<=18);
 assert.equal(c.areasDetectadas.includes('radiation'),false);
});
test('rechaza entrada inválida',()=>assert.throws(()=>buildNasaExpertContext(null)));
