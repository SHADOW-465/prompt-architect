import { primaryModel } from '@/lib/ai';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt, format, explain } = await req.json();

  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formatInstructions: Record<string, string> = {
    plain: 'Output the optimized prompt as plain text.',
    json: 'Output the optimized prompt as a valid JSON object with keys like "system", "context", "task", "constraints", "output_format".',
    xml: 'Output the optimized prompt wrapped in XML tags like <prompt><system>...</system><task>...</task><constraints>...</constraints><output_format>...</output_format></prompt>.',
    yaml: 'Output the optimized prompt in YAML format with keys like system, context, task, constraints, output_format.',
    system_user: 'Output the optimized prompt split into two clearly labeled sections: [SYSTEM PROMPT] and [USER PROMPT].',
  };

  const systemPrompt = `You are an expert AI Prompt Architect. Your job is to take a user's raw, potentially vague prompt and transform it into a highly optimized, structured, and effective prompt.

## Your Optimization Process:
1. **Analyze Intent**: Understand what the user is truly trying to achieve
2. **Add Clarity**: Remove ambiguity, add specific instructions
3. **Add Structure**: Organize the prompt with clear sections
4. **Add Context**: Fill in missing context that would improve AI responses
5. **Add Constraints**: Add appropriate guardrails and output format specifications
6. **Optimize Tokens**: Remove redundancy while maintaining meaning

## Output Format:
${formatInstructions[format] || formatInstructions.plain}

${explain ? `## After the optimized prompt, add a section titled "---EXPLANATION---" that explains:
- What was unclear in the original prompt
- What improvements were made and why
- Token efficiency notes
- Model compatibility notes` : ''}

## CRITICAL RULES:
- Never add information the user didn't imply
- Always preserve the user's core intent
- Make the prompt work well across major AI models (GPT-4, Claude, Gemini)
- Focus on making the AI response more predictable and high-quality
- DO NOT wrap your response with extra commentary — output ONLY the optimized prompt${explain ? ' followed by the explanation section' : ''}`;

  const result = streamText({
    model: primaryModel,
    system: systemPrompt,
    prompt: `Here is the raw prompt to optimize:\n\n${prompt}`,
  });

  return result.toTextStreamResponse();
}
