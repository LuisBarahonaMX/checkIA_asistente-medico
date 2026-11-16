import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRichNasaInput,richAnalysisInstructions} from './nasa-rich-analysis.js';
const qs={questions:[{id:'1',text:'¿Quién responde?',options:[{value:'1',label:'Yo'}]},{id:'4',text:'Peso',type:'number'},{id:'13',text:'¿Alarma CO2?',options:[{value:'1',label:'Sí, alarma'},{value:'3',label:'Ninguna'}]}],branches:[{id:'1.1',text:'¿ID?'}]};
test('traduce opciones y preserva el detalle de medidas',()=>{
 const v=buildRichNasaInput({questions:qs,answers:{'1':'1','1.1':'AST-002','4':{value:'78',details:{height_cm:'165.5'}},'13':'1'},crewProfile:{id:'AST-002',name:'Mary',medicalHistory:['cinetosis'],allergies:[],currentMedications:[]},expertContext:{corpusVersion:'v1',areasDetectadas:['environment_co2'],listasDeVerificacion:[{id:'NASA-KB-01',area:'environment_co2',pregunta_de_verificacion:'¿Hay lectura medida?'}]}});
 assert.equal(v.cuestionario.respuestas.find(x=>x.id==='1').respuesta,'Yo');
 assert.equal(v.cuestionario.respuestas.find(x=>x.id==='4').detalles.height_cm,'165.5');
 assert.equal(v.cuestionario.respuestas.find(x=>x.id==='13').respuesta,'Sí, alarma');
 assert.equal(v.conocimientoAeroespacial.preguntasDeVerificacion[0].validacionClinica,false);
 assert.equal(v.expediente.ficticio,true);
});
test('limita verificaciones y no convierte listas en evidencia validada',()=>{
 const v=buildRichNasaInput({questions:qs,answers:{'1':'1'},expertContext:{listasDeVerificacion:Array.from({length:20},(_,i)=>({id:'v'+i,pregunta_de_verificacion:'verificar'}))}});
 assert.equal(v.conocimientoAeroespacial.preguntasDeVerificacion.length,7);
 assert.match(v.conocimientoAeroespacial.advertencia,/no evidencia clínica/);
 assert.match(richAnalysisInstructions,/JSON estricto/);
});
test('rechaza entrada no estructurada',()=>assert.throws(()=>buildRichNasaInput({answers:[],questions:qs}),TypeError));
