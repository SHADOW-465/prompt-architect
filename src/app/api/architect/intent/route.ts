import { primaryModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const intentSchema = z.object({
  productType: z.string().describe('The type of product (e.g., web app, mobile app, API, chatbot, automation tool)'),
  aiCapability: z.string().describe('The core AI capability needed (e.g., text generation, classification, data extraction, conversation)'),
  problemCategory: z.string().describe('The broad problem category (e.g., productivity, education, healthcare, e-commerce, content creation)'),
  estimatedComplexity: z.enum(['low', 'medium', 'high']).describe('Estimated implementation complexity'),
  summary: z.string().describe('A concise 1-2 sentence summary of what the user wants to build'),
  keyComponents: z.array(z.string()).describe('Key components or features identified from the idea'),
});

export async function POST(req: Request) {
  const { idea } = await req.json();

  if (!idea || typeof idea !== 'string') {
    return new Response(JSON.stringify({ error: 'Idea is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await generateObject({
      model: primaryModel,
      schema: intentSchema,
      system: `You are an AI Intent Parser for a prompt architecture system. Your job is to analyze a user's raw idea and extract structured information about what they want to build.

Be specific and accurate. If the user's idea is vague, make reasonable inferences but note the ambiguity in the summary.

For estimatedComplexity:
- "low": Simple single-prompt tasks, basic text generation, simple Q&A
- "medium": Multi-step workflows, structured output generation, context-dependent tasks
- "high": Multi-agent systems, complex pipelines, real-time processing, integration-heavy systems`,
      prompt: `Analyze this idea and extract structured intent:\n\n"${idea}"`,
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Intent parsing failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to parse intent' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
