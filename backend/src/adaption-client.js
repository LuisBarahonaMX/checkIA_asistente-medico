import {createOpenAIClient} from './openai-client.js';

// Adaption comparte el contrato de orientacion validado de CHECK_IA.
// No contiene la clave API; se lee del entorno del backend.
export function createAdaptionClient(options={}) {
  return createOpenAIClient({
    apiKey:process.env.ADAPTION_API_KEY,
    model:process.env.ADAPTION_MODEL||'gemma-4-31b-it',
    enabled:process.env.CHECKIA_LLM_ENABLED==='true',
    endpoint:'https://api.prod.adaptionlabs.ai/api/v1/responses',
    provider:'Adaption Labs',
    ...options
  });
}