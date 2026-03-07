import { generateObject } from 'ai';
import { z } from 'zod';
import { reasoningModel } from '../ai';

export const IntentDetectionSchema = z.object({
    intent_category: z.enum([
        'research',
        'content_creation',
        'software_development',
        'ui_ux_design',
        'business_strategy',
        'learning',
        'automation',
        'general_question'
    ]).describe("The primary intent category based on the user's prompt"),
    secondary_intents: z.array(z.string()).describe("Other matching contextual intents, if applicable")
});

export type IntentDetectionResult = z.infer<typeof IntentDetectionSchema>;

export class IntentDetectionEngine {
    /**
     * Identifies the primary user intent and task category from an unstructured prompt.
     */
    static async detect(unstructuredPrompt: string): Promise<IntentDetectionResult> {
        const { object } = await generateObject({
            model: reasoningModel,
            schema: IntentDetectionSchema,
            prompt: `Analyze the following unstructured user prompt and accurately categorize its intent:\n\n"${unstructuredPrompt}"`,
            system: `You are the Intent Detection Engine within the Universal AI Prompt Architect. 
Your job is to strictly categorize the user's root intent using the allowed categories.
Do not hallucinate categories outside the enum.`
        });

        return object;
    }
}
