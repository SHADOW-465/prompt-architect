import { generateObject } from 'ai';
import { z } from 'zod';
import { fastModel } from '../ai';
import { GeneratedPrompt } from './PromptGenerationEngine';

export const PromptExplanationSchema = z.object({
    prompt_breakdown: z.array(z.string()).describe("A step-by-step breakdown of why each section of the prompt was constructed this way"),
    learning_points: z.array(z.string()).describe("2-4 general prompt engineering best practices the user can learn from this example")
});

export type PromptExplanation = z.infer<typeof PromptExplanationSchema>;

export class PromptExplanationEngine {
    /**
     * Explains the theoretical mechanics behind the newly generated prompt to educate the end user.
     */
    static async explain(generatedPrompt: GeneratedPrompt): Promise<PromptExplanation> {
        const { object } = await generateObject({
            model: fastModel,
            schema: PromptExplanationSchema,
            prompt: `Analyze this engineered prompt:\n\n${JSON.stringify(generatedPrompt, null, 2)}\n\nExplain why it is structured this way to a beginner.`,
            system: `You are the Prompt Explanation Engine. Your role is educational.
Break down complex prompt engineering decisions into simple, digestible learning moments.`
        });

        return object;
    }
}
