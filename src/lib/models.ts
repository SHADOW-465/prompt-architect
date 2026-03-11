import { anthropic } from '@ai-sdk/anthropic';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export type ModelTier = 'free' | 'pro';

export interface ModelOption {
  id: string;
  label: string;
  provider: 'groq' | 'openrouter' | 'claude';
  tier: ModelTier;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // Groq — free
  { id: 'groq:llama-3.3-70b-versatile',             label: 'Llama 3.3 70B',      provider: 'groq',       tier: 'free' },
  { id: 'groq:llama-3.1-8b-instant',                label: 'Llama 3.1 8B',       provider: 'groq',       tier: 'free' },
  // OpenRouter — free
  { id: 'or:meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B (OR)',  provider: 'openrouter', tier: 'free' },
  { id: 'or:google/gemma-2-9b-it:free',             label: 'Gemma 2 9B',         provider: 'openrouter', tier: 'free' },
  // Claude — pro
  { id: 'claude:claude-sonnet-4-20250514',          label: 'Claude Sonnet 4',    provider: 'claude',     tier: 'pro'  },
  { id: 'claude:claude-haiku-4-5-20251001',         label: 'Claude Haiku 4.5',   provider: 'claude',     tier: 'pro'  },
];

export const DEFAULT_MODEL_ID = 'groq:llama-3.3-70b-versatile';

export function resolveModel(modelId: string) {
  const [provider, ...rest] = modelId.split(':');
  const model = rest.join(':');

  if (provider === 'groq')   return groq(model);
  if (provider === 'or')     return openrouter(model);
  if (provider === 'claude') return anthropic(model);

  // fallback to default
  return groq('llama-3.3-70b-versatile');
}
