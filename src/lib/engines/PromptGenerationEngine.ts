import { generateObject } from 'ai';
import { z } from 'zod';
import { reasoningModel } from '../ai';
import { ContextObject } from './ContextAssemblyEngine';

export const PromptGenerationSchema = z.object({
    task_definition: z.string().describe("Clear, actionable definition of what the AI should do"),
    context: z.string().describe("Rich background context so the AI understands the scenario"),
    requirements: z.array(z.string()).describe("List of exact requirements derived from the user context"),
    output_format: z.string().describe("Instructions on how the AI should format its response"),
    constraints: z.array(z.string()).describe("Things the AI MUST NOT do or limits it must respect"),
    additional_instructions: z.array(z.string()).describe("Any extra guidelines to ensure premium output quality")
});

export type GeneratedPrompt = z.infer<typeof PromptGenerationSchema>;

export class PromptGenerationEngine {
    /**
     * Generates a highly-structured, engineered prompt package from raw user context.
     */
    static async generate(assembledContext: ContextObject): Promise<GeneratedPrompt> {
        const { object } = await generateObject({
            model: reasoningModel,
            schema: PromptGenerationSchema,
            prompt: `Translate this user context into a professional, AI-ready structured prompt:\n\n${JSON.stringify(assembledContext, null, 2)}`,
            system: `You are the Prompt Generation Engine. You take raw metadata and turn it into the ultimate meta-prompt. 
Ensure the prompt is extremely detailed, leaves no ambiguity, and applies advanced prompt engineering techniques (role prompting, zero-shot/few-shot framing, constraint mapping).`
        });

        return object;
    }
}
