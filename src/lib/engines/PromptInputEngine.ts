export class PromptInputEngine {
    /**
     * Collects and sanitizes raw unstructured user prompts
     */
    static process(input: string): string {
        if (!input || input.trim() === '') {
            throw new Error('Input prompt cannot be empty');
        }

        // Basic sanitization: trim and remove excessive newlines
        return input.trim().replace(/\n{3,}/g, '\n\n');
    }
}
