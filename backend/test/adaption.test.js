import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdaptionClient} from '../src/adaption-client.js';

const result={
  fuentes_usadas:[],aclaraciones_sugeridas:[],
  resumen:'Datos ficticios de prueba.',datos_por_aclarar:[],
  orientacion_general:'Preparar informacion para la consulta.',
  siguiente_paso:'Solicitar evaluacion profesional.',
  preguntas_para_profesional:[]
};

test('Adaption genera orientacion JSON validada sin parametro reasoning',async()=>{
  let url, request;
  const client=createAdaptionClient({apiKey:'test-key',enabled:true,fetchImpl:async(u,options)=>{
    url=u;request=JSON.parse(options.body);
    return new Response(JSON.stringify({status:'completed',model:'gemma-4-31b-it',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify(result)}]}],usage:{input_tokens:12,output_tokens:30}}),{status:200});
  }});
  const generated=await client.generate({caso:'ficticio'});
  assert.equal(client.provider,'Adaption Labs');
  assert.equal(url,'https://api.prod.adaptionlabs.ai/api/v1/responses');
  assert.equal(request.model,'gemma-4-31b-it');
  assert.equal(request.store,false);
  assert.equal(request.reasoning,undefined);
  assert.equal(request.text.format.strict,true);
  assert.equal(Object.keys(request.text.format.schema.properties).length,7);
  assert.deepEqual(generated.result,result);
});