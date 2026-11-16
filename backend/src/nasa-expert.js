import { readFileSync } from 'node:fs';

const knowledge = JSON.parse(readFileSync(new URL('../knowledge/nasa-medical-knowledge.json', import.meta.url), 'utf8'));
const byArea = new Map();
for (const item of knowledge.records) {
  const existing = byArea.get(item.area) || [];
  existing.push(item);
  byArea.set(item.area, existing);
}
const allowedQuestions = new Set(knowledge.records.flatMap(x => x.preguntas_relacionadas));
const unwrap = x => (x && typeof x === 'object' && !Array.isArray(x) && Object.hasOwn(x, 'value')) ? x.value : x;
const valuesOf = x => (Array.isArray(unwrap(x)) ? unwrap(x) : [unwrap(x)]).map(String);
const asArray = x => Array.isArray(x) ? x : [];

export const expertInstructions = `\nINSTRUCCIONES DE EVIDENCIA Y SEGURIDAD: Recibirás un campo expertContext generado por código determinista. Sus registros son listas de datos por verificar, NO protocolos médicos ni reglas clínicas validadas. No cites el enlace de una fuente contextual como si probara una conclusión clínica concreta; no inventes números de sección, límites fisiológicos, diagnósticos, porcentajes, dosificación ni procedimientos operativos. Si no hay evidencia verificada para una conclusión, dilo. No atribuyas al astronauta los datos de un perfil no identificado. La prioridad de emergencias está definida fuera del modelo y nunca debes rebajarla. Mantén el esquema JSON de salida de cinco campos, sin añadir propiedades.`;

/** Contexto limitado y determinista; no es diagnóstico ni decisión médica. */
export function buildNasaExpertContext(answers) {
 if (!answers || typeof answers !== 'object' || Array.isArray(answers)) throw new TypeError('Respuestas inválidas');
 const active=new Set();
 const is=(id,arr)=>valuesOf(answers[String(id)]).some(x=>arr.includes(x));
 if(is(3,['1','3'])||is(6,['1','3'])||is(32,['1']))active.add('environment_pressure');
 if(is(12,['1','3'])||is(32,['2']))active.add('environment_oxygen');
 if(is(13,['1','2','4'])||is(32,['3']))active.add('environment_co2');
 if(is(7,['1','3'])||is(8,['1'])||is(32,['7'])||is(40,['1']))active.add('radiation');
 if(is(9,['2','3','4'])||is(11,['2','3','4'])||is(22,['2','3','4'])||is(25,['1','2','3','4','5'])||is(46,['2','3','4','5']))active.add('microgravity');
 if(is(14,['2','3','4']))active.add('cardiovascular');
 if(is(28,['2','3','4'])||is(30,['yes'])||is(29,['unknown']))active.add('nutrition_hydration');
 if(is(38,['3','4','5','6'])||is(39,['7','8','9','10']))active.add('behavioral_health');
 if(is(20,['yes'])||is(21,['1','2'])||is(23,['yes'])||is(24,['yes'])||is(44,['1','2','3','4']))active.add('medical_history');
 active.add('sleep_fatigue');
 const selected=[...active].slice(0,7);
 const checks=selected.flatMap(area=>(byArea.get(area)||[]).slice(0,3)).slice(0,18).map(item=>({id:item.id,area:item.area,pregunta_de_verificacion:item.pregunta_de_verificacion,fuente_contextual:item.fuente_contextual,evidencia_clinica_validada:false}));
 return {corpusVersion:knowledge.schemaVersion,validatedForClinicalUse:false,mode:'orientacion_experimental',areasDetectadas:selected,listasDeVerificacion:checks,notas:['Fuentes contextuales no equivalen a evidencia clínica por párrafo.','No sustituir procedimientos de la misión ni decisiones del médico de vuelo.','Se utilizará solo expediente ficticio asociado al ID validado de la pregunta 1.1.']};
}

export function inspectExpertKnowledge() {
  return { version: knowledge.schemaVersion, records: knowledge.records.length, areas: byArea.size, clinicallyValidated: false, questionsIndexed: allowedQuestions.size };
}
