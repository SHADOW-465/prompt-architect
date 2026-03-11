import { primaryModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const architectureSchema = z.object({
  options: z.array(z.object({
    id: z.string().describe('Option identifier: option_a, option_b, or option_c'),
    name: z.string().describe('Short name for this architecture option'),
    description: z.string().describe('2-3 sentence description of the approach'),
    complexity: z.enum(['low', 'medium', 'high']).describe('Implementation complexity'),
    promptCount: z.number().describe('Number of prompts needed'),
    pros: z.array(z.string()).describe('3-4 advantages of this approach'),
    cons: z.array(z.string()).describe('2-3 disadvantages of this approach'),
    isRecommended: z.boolean().describe('Whether this is the recommended option'),
    components: z.array(z.string()).describe('Key prompt components or modules needed'),
  })).describe('Three architecture options from simple to complex'),
  reasoning: z.string().describe('Brief explanation of why the recommended option is best for this use case'),
});

export async function POST(req: Request) {
  const { idea, parsedIntent, requirements } = await req.json();

  if (!idea) {
    return new Response(JSON.stringify({ error: 'Idea is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await generateObject({
      model: primaryModel,
      schema: architectureSchema,
      system: `You are an Architecture Engine for a prompt engineering platform. You design prompt architectures — the structure and pipeline of prompts needed to solve a user's problem.

## Your job:
Generate EXACTLY 3 architecture options, ordered from simplest to most complex:

### Option A: Simple Prompt
- A single, well-crafted prompt that handles everything
- Best for low-complexity tasks
- Pros: Simple, fast, cheap, easy to iterate
- Cons: Limited capability, may miss edge cases

### Option B: Prompt Pipeline
- A sequence of 2-4 prompts that chain together
- Each prompt handles a specific sub-task
- Best for medium-complexity tasks
- Pros: More reliable, modular, better output quality
- Cons: More complex, higher cost, more latency

### Option C: Multi-Agent System
- A system of 4-8 specialized prompts working together
- Includes orchestration, validation, and fallback prompts
- Best for high-complexity tasks
- Pros: Most capable, handles edge cases, production-ready
- Cons: Complex setup, expensive, harder to debug

Mark exactly ONE option as recommended based on the complexity and requirements.`,
      prompt: `Design prompt architecture options for:

Idea: "${idea}"

Parsed Intent: ${JSON.stringify(parsedIntent)}

User Requirements: ${JSON.stringify(requirements)}`,
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Architecture generation failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate architecture' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
