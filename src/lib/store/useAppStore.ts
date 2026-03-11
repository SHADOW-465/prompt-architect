import { create } from 'zustand';

export type AppMode = 'quick' | 'architect';
export type ArchitectStep = 'idea' | 'intent' | 'questions' | 'architecture' | 'edit' | 'compile';
export type PromptFormat = 'plain' | 'json' | 'xml' | 'yaml' | 'system_user';

interface PromptMetrics {
  clarity: number;
  tokenEfficiency: number;
  modelCompatibility: number;
  ambiguityRisk: number;
}

interface ArchitectState {
  step: ArchitectStep;
  idea: string;
  parsedIntent: {
    productType: string;
    aiCapability: string;
    problemCategory: string;
    estimatedComplexity: 'low' | 'medium' | 'high';
  } | null;
  questions: Array<{
    id: string;
    category: string;
    question: string;
    hint?: string;
    answer: string;
  }>;
  architectureOptions: Array<{
    id: string;
    name: string;
    description: string;
    complexity: string;
    pros: string[];
    cons: string[];
    components: string[];
    isRecommended: boolean;
  }>;
  selectedArchitecture: string | null;
  editedArchitecture: Record<string, unknown> | null;
  generatedPrompts: Array<{
    name: string;
    content: string;
    format: PromptFormat;
  }>;
}

interface AppState {
  // Layout
  activeMode: AppMode;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;

  // Quick Prompt
  quickPromptInput: string;
  quickPromptOutput: string;
  quickPromptFormat: PromptFormat;
  quickPromptExplanation: string;
  isOptimizing: boolean;

  // Architect
  architect: ArchitectState;
  isProcessing: boolean;

  // Metrics & Reasoning
  promptMetrics: PromptMetrics | null;
  aiReasoning: string;

  // Actions
  setActiveMode: (mode: AppMode) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;

  setQuickPromptInput: (input: string) => void;
  setQuickPromptOutput: (output: string) => void;
  setQuickPromptFormat: (format: PromptFormat) => void;
  setQuickPromptExplanation: (explanation: string) => void;
  setIsOptimizing: (v: boolean) => void;

  setArchitectStep: (step: ArchitectStep) => void;
  setArchitectIdea: (idea: string) => void;
  setArchitectIntent: (intent: ArchitectState['parsedIntent']) => void;
  setArchitectQuestions: (questions: ArchitectState['questions']) => void;
  updateQuestionAnswer: (id: string, answer: string) => void;
  setArchitectureOptions: (options: ArchitectState['architectureOptions']) => void;
  selectArchitecture: (id: string) => void;
  setGeneratedPrompts: (prompts: ArchitectState['generatedPrompts']) => void;
  setIsProcessing: (v: boolean) => void;
  resetArchitect: () => void;

  setPromptMetrics: (metrics: PromptMetrics | null) => void;
  setAiReasoning: (reasoning: string) => void;
}

const initialArchitectState: ArchitectState = {
  step: 'idea',
  idea: '',
  parsedIntent: null,
  questions: [],
  architectureOptions: [],
  selectedArchitecture: null,
  editedArchitecture: null,
  generatedPrompts: [],
};

export const useAppStore = create<AppState>((set) => ({
  // Layout
  activeMode: 'quick',
  sidebarOpen: true,
  rightPanelOpen: true,

  // Quick Prompt
  quickPromptInput: '',
  quickPromptOutput: '',
  quickPromptFormat: 'plain',
  quickPromptExplanation: '',
  isOptimizing: false,

  // Architect
  architect: { ...initialArchitectState },
  isProcessing: false,

  // Metrics
  promptMetrics: null,
  aiReasoning: '',

  // Actions
  setActiveMode: (mode) => set({ activeMode: mode }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),

  setQuickPromptInput: (input) => set({ quickPromptInput: input }),
  setQuickPromptOutput: (output) => set({ quickPromptOutput: output }),
  setQuickPromptFormat: (format) => set({ quickPromptFormat: format }),
  setQuickPromptExplanation: (explanation) => set({ quickPromptExplanation: explanation }),
  setIsOptimizing: (v) => set({ isOptimizing: v }),

  setArchitectStep: (step) =>
    set((s) => ({ architect: { ...s.architect, step } })),
  setArchitectIdea: (idea) =>
    set((s) => ({ architect: { ...s.architect, idea } })),
  setArchitectIntent: (parsedIntent) =>
    set((s) => ({ architect: { ...s.architect, parsedIntent } })),
  setArchitectQuestions: (questions) =>
    set((s) => ({ architect: { ...s.architect, questions } })),
  updateQuestionAnswer: (id, answer) =>
    set((s) => ({
      architect: {
        ...s.architect,
        questions: s.architect.questions.map((q) =>
          q.id === id ? { ...q, answer } : q
        ),
      },
    })),
  setArchitectureOptions: (architectureOptions) =>
    set((s) => ({ architect: { ...s.architect, architectureOptions } })),
  selectArchitecture: (id) =>
    set((s) => ({ architect: { ...s.architect, selectedArchitecture: id } })),
  setGeneratedPrompts: (generatedPrompts) =>
    set((s) => ({ architect: { ...s.architect, generatedPrompts } })),
  setIsProcessing: (v) => set({ isProcessing: v }),
  resetArchitect: () => set({ architect: { ...initialArchitectState } }),

  setPromptMetrics: (promptMetrics) => set({ promptMetrics }),
  setAiReasoning: (aiReasoning) => set({ aiReasoning }),
}));
