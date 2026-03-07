import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// Centralize AI models to make it easy to swap them later
// We use generic names so we can upgrade the underlying model transparently
export const reasoningModel = openai('gpt-4-turbo');
export const fastModel = openai('gpt-3.5-turbo');
export const creativeModel = anthropic('claude-3-opus-20240229');
