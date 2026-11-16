/**
 * CHECK_IA NASA / CUBE - preparación de evaluación contextual, simulación únicamente.
 * No convierte verificaciones no validadas en evidencia clínica ni hace triaje.
 */
const unwrap = raw => raw && typeof raw === 'object' && !Array.isArray(raw) && Object.hasOwn(raw,'value') ? raw.value : raw;
const text = (value, limit=240) => String(value ?? '').slice(0, limit);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function prettyAnswer(question, raw) {
  const value=unwrap(raw);
  const options=new Map((question.options||[]).map(o=>[String(o.value),o.label]));
  for(const o of question.specialOptions||[]) options.set(String(o.value),o.label);
  const translate=x=> {
    if(x === undefined || x === null || x === '') return 'No registrado';
    if(typeof x === 'object') return text(JSON.stringify(x),400);
    const key=String(x);
    return options.has(key)?text(options.get(key),170):text(x,240);
  };
  const answer=Array.isArray(value)?value.map(translate):translate(value);
  const details=isObject(raw?.details)?Object.fromEntries(
    Object.entries(raw.details).slice(0,10).map(([k,v])=>[text(k,55),text(v,200)])
  ):undefined;
  return {
    id:String(question.id),
    pregunta:text(question.text,260),
    respuesta:answer,
    ...(details&&Object.keys(details).length?{detalles:details}:{})
  };
}

function briefProfile(profile) {
  if(!profile)return null;
  return {
    id:text(profile.id,30),nombre:text(profile.name,80),
    edadAnios:profile.ageYears,estaturaReferenciaCm:profile.heightCm,
    pesoBaseKg:profile.baselineWeightKg,
    antecedentes:(profile.medicalHistory||[]).map(x=>text(x,160)).slice(0,5),
    alergias:(profile.allergies||[]).map(x=>text(x,120)).slice(0,5),
    medicacionRegistrada:(profile.currentMedications||[]).map(x=>text(x,120)).slice(0,5),
    ficticio:true
  };
}

export function buildRichNasaInput({answers,questions,crewProfile,expertContext}) {
  if(!isObject(answers)||!Array.isArray(questions?.questions)||!Array.isArray(questions?.branches)) throw new TypeError('Datos NASA inválidos');
  const questionsById=new Map([...questions.questions,...questions.branches].map(q=>[String(q.id),q]));
  const orden=['1','1.1','2','2.1','2.1.1',...questions.questions.map(q=>String(q.id)).filter(id=>!['1','2'].includes(id))];
  const respuestas=orden.filter(id=>Object.hasOwn(answers,id)&&questionsById.has(id)).map(id=>prettyAnswer(questionsById.get(id),answers[id]));
  const checks=(expertContext?.listasDeVerificacion||[]).slice(0,7).map(c=>({
    id:text(c.id,50),area:text(c.area,60),
    verificar:text(c.pregunta_de_verificacion,250),
    validacionClinica:false
  }));
  return {
    proposito:'evaluacion_de_salud_espacial_experimental',
    origen:'cuestionario_50_preguntas_y_perfil_ficticio',
    cuestionario:{respondidas:questions.questions.filter(q=>Object.hasOwn(answers,String(q.id))).length,respuestas},
    expediente:briefProfile(crewProfile),
    conocimientoAeroespacial:{
      corpusVersion:text(expertContext?.corpusVersion||'sin_version',50),
      areas:(expertContext?.areasDetectadas||[]).slice(0,8).map(x=>text(x,80)),
      preguntasDeVerificacion:checks,
      advertencia:'Son listas de verificación experimentales, no evidencia clínica revisada ni protocolos oficiales certificados.'
    },
    reglas:'Si hay alarma activa, el backend ya debe haber detenido el cuestionario. No rebajar ni decidir emergencias por inferencia.'
  };
}

export const richAnalysisInstructions = `\n\nEVALUADOR EXPERTO NASA — INFORME ANALÍTICO CONTEXTUAL (EXPERIMENTAL)\nRecibes un cuestionario de 50 respuestas que ya incorpora las etiquetas textuales de las opciones, un expediente ficticio y verificaciones aeroespaciales recuperadas de un corpus LOCAL. Debes analizar específicamente las respuestas; NO hagas un resumen genérico ni escribas frases del tipo «contiene respuestas categóricas» o «valores numéricos» sin explicar su significado.\n\nOBJETIVOS\n1. Resume el motivo de consulta, los hallazgos actuales más relevantes y sus incertidumbres en 110–180 palabras (campo resumen). Usa cifras, unidades, cronología, intensidad y valores declarados solo si constan efectivamente.\n2. En observaciones produce 5 a 7 elementos sustanciales, de 2–3 frases cada uno. Agrupa por áreas cuando existan datos: atmósfera de cabina (presión/O2/CO2), radiación, efectos de microgravedad, cardiovascular/neurológico, hidratación/nutrición, actividad/músculo, sueño/fatiga/psicología, tratamientos/antecedentes. Prioriza únicamente áreas pertinentes al caso; no rellenos. Explica concordancias, discrepancias y límites interpretativos sin diagnosticar ni establecer causalidad no demostrada. Cita la pregunta como «P13» cuando corresponda.\n3. En datos_pendientes incluye 3–6 aclaraciones concretas relacionadas directamente con respuestas, medidas, unidades, fechas, cambios frente a una línea base o verificaciones del corpus. Si no faltan datos relevantes, usa un elemento explicando qué falta para una validación clínica real.\n4. En preguntas_para_responsable_medico redacta 3–5 preguntas específicas y accionables para revisión profesional, vinculadas a hallazgos; no repitas preguntas genéricas.\n5. En siguiente_paso redacta un plan prudente de 90–150 palabras para documentar y escalar la revisión al responsable médico de vuelo, con distinción entre monitoreo y situaciones que requieren activar procedimientos aprobados. No indiques tratamientos, diagnósticos ni aptitud para misión. No afirmes haber enviado alertas.\n\nFUENTES Y CONFIANZA\nLas preguntas de verificación del corpus y los enlaces base son CONTEXTO, no evidencia clínica verificada. Nunca digas «NASA confirma» basándote únicamente en estas listas. No inventes citas, umbrales fisiológicos, ecuaciones de riesgo, diagnósticos, datos biométricos ni telemetría. Diferencia hechos reportados por el astronauta, datos precargados y suposiciones. Si una pregunta no tiene respuesta interpretable, márcala como incertidumbre.\n\nRESPUESTA: únicamente el objeto JSON estricto con las cinco propiedades exigidas, español formal, sin markdown externo. Prefiere profundidad sustentada sobre extensión artificial.\n`;
