# Model Selection Design
Date: 2026-03-12

## Overview
Wire all AI calls in Prompt Architect (Quick Prompt + Architect flow) to support multiple providers — Groq (free), OpenRouter (free), and Anthropic Claude (paid) — with a per-request model selector in the UI.

## Model Registry (`src/lib/models.ts`)

Central file defining all available models and resolving them to AI SDK instances.

### Available Models (free first)
| Provider   | Model ID                                    | Display Name              | Tier |
|------------|---------------------------------------------|---------------------------|------|
| Groq       | `llama-3.3-70b-versatile`                   | Llama 3.3 70B             | FREE |
| Groq       | `llama-3.1-8b-instant`                      | Llama 3.1 8B              | FREE |
| OpenRouter | `meta-llama/llama-3.1-8b-instruct:free`     | Llama 3.1 8B (OR)         | FREE |
| OpenRouter | `google/gemma-2-9b-it:free`                 | Gemma 2 9B                | FREE |
| Claude     | `claude-sonnet-4-20250514`                  | Claude Sonnet 4           | PRO  |
| Claude     | `claude-haiku-4-5-20251001`                 | Claude Haiku 4.5          | PRO  |

- Default: `llama-3.3-70b-versatile` (Groq, free)
- `resolveModel(modelId: string)` returns correct AI SDK model instance
- OpenRouter uses `@ai-sdk/openai` with base URL `https://openrouter.ai/api/v1`
- Groq requires installing `@ai-sdk/groq`

## API Routes

All 5 routes accept an optional `model` string in the request body (defaults to `llama-3.3-70b-versatile`):
- `POST /api/quick-prompt`
- `POST /api/architect/intent`
- `POST /api/architect/questions`
- `POST /api/architect/architecture`
- `POST /api/architect/compile`

Each route calls `resolveModel(model)` and passes the result to `streamText` / `generateObject`. No other logic changes.

## UI — ModelSelector Component

**Location**: `src/components/ui/ModelSelector.tsx`

- Compact dropdown above each action button
- Shows model name + FREE/PRO badge
- Options grouped by provider (Groq, OpenRouter, Claude)
- Per-action local state (not globally persisted)
- Default: `llama-3.3-70b-versatile`

**Placement**:
- Quick Prompt page → above "Optimize" button
- Architect page → above "Analyze Intent", "Generate Questions", "Generate Architecture", "Compile" buttons

## Packages to Install
- `@ai-sdk/groq` (new)
- `@ai-sdk/openai` already installed (reused for OpenRouter)
