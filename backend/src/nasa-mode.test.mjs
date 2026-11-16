import test from 'node:test';
import assert from 'node:assert/strict';
import {nasaQuestions,inspectNasaAnswers,evaluateNasa} from './nasa-mode.js';
test('50 preguntas y tres subpreguntas',()=>{assert.equal(nasaQuestions().questions.length,50);assert.equal(nasaQuestions().branches.length,3);});
test('alarma pausa sin llamar a IA',()=>{const outcome=inspectNasaAnswers({'2.1':10,'2.1.1':['4']});assert.equal(outcome.paused,true);assert.equal(outcome.notificationSent,undefined);});
test('ninguna excluyente de emergencia',()=>assert.throws(()=>inspectNasaAnswers({'2.1':1,'2.1.1':['10','2']}),{status:400}));
test('no llama API si falta consentimiento',async()=>{process.env.CHECKIA_NASA_MODE='true';await assert.rejects(evaluateNasa({answers:{},consent:false}),{status:400});});
