import { IntentDetectionResult } from './IntentDetectionEngine';

export const REQUIRED_PARAMETERS_BY_INTENT: Record<string, string[]> = {
    software_development: ["target_users", "platform", "core_features", "tech_stack", "design_style", "monetization"],
    research: ["topic", "scope", "depth", "sources", "output_format"],
    content_creation: ["topic", "tone", "target_audience", "format", "length"],
    ui_ux_design: ["product_type", "target_users", "design_style", "platform", "core_screens"],
    business_strategy: ["industry", "target_market", "business_model", "current_challenges", "goals"],
    learning: ["subject", "current_knowledge_level", "learning_goal", "preferred_format"],
    automation: ["current_workflow", "tools_used", "desired_outcome", "constraints"],
    general_question: ["topic", "context_background", "specific_question"]
};

export class ContextGapDetectionEngine {
    /**
     * Compares the user's provided context against the required parameters for their intent.
     * Returns an array of missing parameter keys.
     */
    static detectGaps(intent: IntentDetectionResult['intent_category'], providedParameters: Record<string, any>): string[] {
        const required = REQUIRED_PARAMETERS_BY_INTENT[intent] || [];

        return required.filter(param => {
            const val = providedParameters[param];
            return val === undefined || val === null || val === '';
        });
    }
}
