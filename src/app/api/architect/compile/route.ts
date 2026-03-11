import { resolveModel, DEFAULT_MODEL_ID } from '@/lib/models';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 90;

const compileSchema = z.object({
  prompts: z.array(z.object({
    name: z.string().describe('Name of this prompt module (e.g., "System Prompt", "Data Extraction", "Response Formatter")'),
    purpose: z.string().describe('What this prompt does in 1 sentence'),
    content: z.string().describe('The full, production-ready prompt text'),
    format: z.enum(['plain', 'json', 'xml', 'yaml', 'system_user']).describe('Output format of this prompt'),
    inputDescription: z.string().describe('What input this prompt expects'),
    outputDescription: z.string().describe('What output this prompt produces'),
  })).describe('Array of prompt modules in execution order'),
  executionFlow: z.string().describe('Description of how these prompts chain together'),
  totalEstimatedTokens: z.number().describe('Estimated total tokens per execution'),
  recommendedModel: z.string().describe('Recommended AI model for this pipeline (e.g., Claude 3.5 Sonnet, GPT-4, etc.)'),
});

export async function POST(req: Request) {
  const { idea, parsedIntent, requirements, selectedArchitecture, model } = await req.json();
  const aiModel = resolveModel(model ?? DEFAULT_MODEL_ID);

  if (!idea || !selectedArchitecture) {
    return new Response(JSON.stringify({ error: 'Idea and selected architecture are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await generateObject({
      model: aiModel,
      schema: compileSchema,
      system: `You are the Prompt Compiler — the final stage of a prompt architecture pipeline. Your job is to generate production-ready, optimized prompts based on the selected architecture.

## Rules:
1. Each prompt must be complete, self-contained, and production-ready
2. Prompts should be highly structured with clear sections (Role, Context, Task, Constraints, Output Format)
3. Include specific examples where helpful
4. Handle edge cases and error scenarios
5. Optimize for token efficiency without sacrificing quality
6. Use the appropriate format for each prompt module

## Prompt Quality Standards:
- Every prompt must have a clear ROLE definition
- Every prompt must specify CONSTRAINTS and GUARDRAILS
- Every prompt must define the expected OUTPUT FORMAT
- Include chain-of-thought instructions where reasoning is needed
- Add few-shot examples for complex tasks

## For pipeline architectures:
- Ensure prompts chain together logically
- Define clear input/output interfaces between modules
- Include data transformation instructions between steps`,
      prompt: `Compile production-ready prompts for:

Idea: "${idea}"

Intent: ${JSON.stringify(parsedIntent)}

Requirements: ${JSON.stringify(requirements)}

Selected Architecture: ${JSON.stringify(selectedArchitecture)}

Generate the complete prompt pipeline with all modules needed for this architecture.`,
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Prompt compilation failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to compile prompts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
