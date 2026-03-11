import { primaryModel } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const questionsSchema = z.object({
  questions: z.array(z.object({
    id: z.string().describe('Unique question ID'),
    category: z.string().describe('Category: idea_understanding, target_users, usage_scale, technical_preferences, ai_capabilities, output_requirements'),
    question: z.string().describe('The question to ask the user'),
    hint: z.string().describe('A brief hint or example answer to guide the user'),
    required: z.boolean().describe('Whether this question is required'),
  })).describe('Array of clarifying questions'),
});

export async function POST(req: Request) {
  const { idea, parsedIntent } = await req.json();

  if (!idea) {
    return new Response(JSON.stringify({ error: 'Idea is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await generateObject({
      model: primaryModel,
      schema: questionsSchema,
      system: `You are an adaptive Question Engine for a prompt architecture system. Based on the user's idea and parsed intent, generate smart clarifying questions to fill in gaps before designing the prompt architecture.

## Rules:
- Generate 5-8 questions maximum
- Questions should cover: target users, scale, technical preferences, AI capabilities needed, output format requirements
- Make questions specific to the user's idea, not generic
- Each question should have a helpful hint/example
- Order questions from most important to least important
- Don't ask questions that are already clearly answered in the idea
- Use these categories: idea_understanding, target_users, usage_scale, technical_preferences, ai_capabilities, output_requirements`,
      prompt: `User's idea: "${idea}"

Parsed intent: ${JSON.stringify(parsedIntent)}

Generate clarifying questions to fill in context gaps for designing the optimal prompt architecture.`,
    });

    return new Response(JSON.stringify(result.object), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Question generation failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
