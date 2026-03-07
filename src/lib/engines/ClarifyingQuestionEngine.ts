import { generateObject } from 'ai';
import { z } from 'zod';
import { reasoningModel } from '../ai';
import { IntentDetectionResult } from './IntentDetectionEngine';

export const ClarifyingQuestionSchema = z.object({
    questions: z.array(z.object({
        parameter: z.string().describe("The exact missing parameter key from the list provided"),
        question: z.string().describe("The conversational question to ask the user"),
        suggested_answers: z.array(z.string()).describe("2-4 suggestive quick-reply answers")
    }))
});

export type ClarifyingQuestionResult = z.infer<typeof ClarifyingQuestionSchema>;

export class ClarifyingQuestionEngine {
    /**
     * Generates conversational follow-up questions to gather missing context parameters.
     */
    static async generateQuestions(
        intent: IntentDetectionResult['intent_category'],
        missingParameters: string[],
        originalPrompt: string
    ): Promise<ClarifyingQuestionResult> {

        if (missingParameters.length === 0) {
            return { questions: [] };
        }

        const { object } = await generateObject({
            model: reasoningModel,
            schema: ClarifyingQuestionSchema,
            prompt: `Original User Prompt: "${originalPrompt}"\nTarget Intent: ${intent}\nMissing Parameters to Fill: ${missingParameters.join(', ')}\n\nGenerate exactly one engaging and clear question for each missing parameter. Provide sensible suggested answers.`,
            system: `You are the Clarifying Question Engine. Your goal is to extract missing requirements from the user so their final prompt can be extremely high quality.`
        });

        return object;
    }
}
