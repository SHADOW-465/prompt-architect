import { anthropic } from '@ai-sdk/anthropic';

// Centralize AI models for easy swapping
export const primaryModel = anthropic('claude-sonnet-4-20250514');
export const fastModel = anthropic('claude-sonnet-4-20250514');
