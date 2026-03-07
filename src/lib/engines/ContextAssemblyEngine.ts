export interface ContextObject {
    intent: string;
    topic?: string;
    target_users?: string;
    platform?: string;
    core_features?: string[];
    design_style?: string;
    tech_stack?: string;
    constraints?: string[];
    [key: string]: any;
}

export class ContextAssemblyEngine {
    /**
     * Combines incremental user answers into a unified, structured context object for prompt generation.
     */
    static assemble(
        baseContext: Partial<ContextObject>,
        newAnswers: Record<string, any>
    ): ContextObject {
        // Merge nested arrays or specific objects if needed, 
        // otherwise a flat merge is sufficient for key-value answers.
        return {
            ...baseContext,
            ...newAnswers,
        } as ContextObject;
    }
}
