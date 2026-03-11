'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import StepIndicator from '@/components/ui/StepIndicator';
import PromptOutput from '@/components/prompt/PromptOutput';
import ModelSelector from '@/components/ui/ModelSelector';
import type { ArchitectStep } from '@/lib/store/useAppStore';
import { DEFAULT_MODEL_ID } from '@/lib/models';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lightbulb,
  Brain,
  HelpCircle,
  Layers,
  Pencil,
  FileOutput,
  Check,
  Star,
  RotateCcw,
} from 'lucide-react';

const STEPS: Array<{ id: ArchitectStep; label: string }> = [
  { id: 'idea', label: 'Idea' },
  { id: 'intent', label: 'Intent' },
  { id: 'questions', label: 'Requirements' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'edit', label: 'Customize' },
  { id: 'compile', label: 'Generate' },
];

const STEP_ORDER: ArchitectStep[] = ['idea', 'intent', 'questions', 'architecture', 'edit', 'compile'];

export default function ArchitectPage() {
  const {
    architect,
    isProcessing,
    setArchitectStep,
    setArchitectIdea,
    setArchitectIntent,
    setArchitectQuestions,
    updateQuestionAnswer,
    setArchitectureOptions,
    selectArchitecture,
    setGeneratedPrompts,
    setIsProcessing,
    setAiReasoning,
    setPromptMetrics,
    resetArchitect,
  } = useAppStore();

  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);

  const currentStepIndex = STEP_ORDER.indexOf(architect.step);
  const completedSteps = STEP_ORDER.slice(0, currentStepIndex);

  // ---- API Handlers ----

  const handleAnalyzeIntent = async () => {
    if (!architect.idea.trim()) return;
    setIsProcessing(true);
    setAiReasoning('Parsing your idea to identify product type, AI capabilities needed, problem domain, and complexity level...');

    try {
      const res = await fetch('/api/architect/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: architect.idea, model: selectedModel }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setArchitectIntent(data);
      setAiReasoning(`Intent parsed successfully.\n\nProduct Type: ${data.productType}\nAI Capability: ${data.aiCapability}\nComplexity: ${data.estimatedComplexity}\n\n${data.summary}`);
      setArchitectStep('intent');
    } catch (error) {
      console.error('Intent analysis failed:', error);
      setAiReasoning('Failed to parse intent. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsProcessing(true);
    setAiReasoning('Generating adaptive clarifying questions based on your idea and identified intent gaps...');

    try {
      const res = await fetch('/api/architect/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: architect.idea, parsedIntent: architect.parsedIntent, model: selectedModel }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setArchitectQuestions(
        data.questions.map((q: { id: string; category: string; question: string; hint?: string; answer?: string }) => ({
          ...q,
          answer: q.answer || '',
        }))
      );
      setAiReasoning(`Generated ${data.questions.length} clarifying questions across ${new Set(data.questions.map((q: { category: string }) => q.category)).size} categories.`);
      setArchitectStep('questions');
    } catch (error) {
      console.error('Question generation failed:', error);
      setAiReasoning('Failed to generate questions. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateArchitecture = async () => {
    setIsProcessing(true);
    setAiReasoning('Designing 3 architecture options (Simple → Pipeline → Multi-Agent) based on your requirements...');

    try {
      const requirements = Object.fromEntries(
        architect.questions.map((q) => [q.id, q.answer])
      );

      const res = await fetch('/api/architect/architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: architect.idea,
          parsedIntent: architect.parsedIntent,
          requirements,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setArchitectureOptions(data.options);
      setAiReasoning(data.reasoning);

      // Auto-select recommended option
      const recommended = data.options.find((o: { isRecommended: boolean }) => o.isRecommended);
      if (recommended) selectArchitecture(recommended.id);

      setArchitectStep('architecture');
    } catch (error) {
      console.error('Architecture generation failed:', error);
      setAiReasoning('Failed to generate architecture options. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompilePrompts = async () => {
    if (!architect.selectedArchitecture) return;
    setIsProcessing(true);
    setAiReasoning('Compiling production-ready prompts for the selected architecture...');

    try {
      const selectedArch = architect.architectureOptions.find(
        (o) => o.id === architect.selectedArchitecture
      );
      const requirements = Object.fromEntries(
        architect.questions.map((q) => [q.id, q.answer])
      );

      const res = await fetch('/api/architect/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: architect.idea,
          parsedIntent: architect.parsedIntent,
          requirements,
          selectedArchitecture: selectedArch,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedPrompts(
        data.prompts.map((p: { name: string; content: string; format: string }) => ({
          name: p.name,
          content: p.content,
          format: p.format || 'plain',
        }))
      );

      setAiReasoning(
        `Generated ${data.prompts.length} prompt module(s).\n\nExecution Flow: ${data.executionFlow}\n\nEstimated Tokens: ~${data.totalEstimatedTokens}\nRecommended Model: ${data.recommendedModel}`
      );

      setPromptMetrics({
        clarity: 88,
        tokenEfficiency: 75,
        modelCompatibility: 92,
        ambiguityRisk: 12,
      });

      setArchitectStep('compile');
    } catch (error) {
      console.error('Prompt compilation failed:', error);
      setAiReasoning('Failed to compile prompts. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setArchitectStep(STEP_ORDER[currentStepIndex - 1]);
    }
  };

  // ---- RENDER ----

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cta/10 flex items-center justify-center">
            <Compass size={20} className="text-cta" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prompt Architect</h1>
            <p className="text-sm text-foreground/50">Guided prompt design through AI-powered analysis.</p>
          </div>
        </div>
        {currentStepIndex > 0 && (
          <button onClick={resetArchitect} className="btn-ghost flex items-center gap-1.5 text-xs">
            <RotateCcw size={14} />
            Start Over
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="card-static py-4 px-6">
        <StepIndicator
          steps={STEPS}
          currentStep={architect.step}
          completedSteps={completedSteps}
          onStepClick={(stepId) => {
            const idx = STEP_ORDER.indexOf(stepId as ArchitectStep);
            if (idx <= currentStepIndex) setArchitectStep(stepId as ArchitectStep);
          }}
        />
      </div>

      {/* Step Content */}
      <div className="card-static min-h-[400px] flex flex-col">

        {/* ---- STEP 1: IDEA INPUT ---- */}
        {architect.step === 'idea' && (
          <div className="space-y-6 flex-grow flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Describe Your Idea</h2>
            </div>
            <p className="text-sm text-foreground/50">
              Tell us what you want to build. Be as detailed or as vague as you like — the architect will ask follow-up questions.
            </p>
            <textarea
              value={architect.idea}
              onChange={(e) => setArchitectIdea(e.target.value)}
              className="input-field flex-grow min-h-[200px] resize-none text-[15px] leading-relaxed"
              placeholder="e.g., I want to build an AI-powered customer support chatbot that can handle refund requests, track orders, and escalate complex issues to human agents..."
            />
            <div className="flex items-center justify-between">
              <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isProcessing} />
              <button
                onClick={handleAnalyzeIntent}
                disabled={!architect.idea.trim() || isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                {isProcessing ? (
                  <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Brain size={16} /> Analyze Intent <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 2: INTENT REVIEW ---- */}
        {architect.step === 'intent' && architect.parsedIntent && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Intent Analysis</h2>
            </div>
            <p className="text-sm text-foreground/50">Here&apos;s what we understood from your idea. Review and proceed.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Product Type', value: architect.parsedIntent.productType },
                { label: 'AI Capability', value: architect.parsedIntent.aiCapability },
                { label: 'Problem Category', value: architect.parsedIntent.problemCategory },
                { label: 'Complexity', value: architect.parsedIntent.estimatedComplexity },
              ].map(({ label, value }) => (
                <div key={label} className="bg-primary/20 rounded-lg p-4 border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={goBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-3">
                <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isProcessing} />
                <button onClick={handleGenerateQuestions} disabled={isProcessing} className="btn-primary flex items-center gap-2">
                  {isProcessing ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating...</>
                  ) : (
                    <><HelpCircle size={16} /> Get Requirements <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- STEP 3: REQUIREMENTS QUESTIONS ---- */}
        {architect.step === 'questions' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Requirements</h2>
            </div>
            <p className="text-sm text-foreground/50">Answer these questions to help us design the optimal architecture.</p>

            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
              {architect.questions.map((q, i) => (
                <div key={q.id} className="space-y-2">
                  <label className="flex items-start gap-2 text-sm font-medium text-foreground">
                    <span className="text-cta/60 font-bold text-xs mt-0.5">{i + 1}.</span>
                    {q.question}
                  </label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => updateQuestionAnswer(q.id, e.target.value)}
                    className="input-field text-sm"
                    placeholder={q.hint || 'Your answer...'}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={goBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-3">
                <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isProcessing} />
                <button onClick={handleGenerateArchitecture} disabled={isProcessing} className="btn-primary flex items-center gap-2">
                  {isProcessing ? (
                    <><Loader2 size={16} className="animate-spin" /> Designing...</>
                  ) : (
                    <><Layers size={16} /> Generate Architecture <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- STEP 4: ARCHITECTURE OPTIONS ---- */}
        {architect.step === 'architecture' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Architecture Options</h2>
            </div>
            <p className="text-sm text-foreground/50">Choose the architecture that best fits your needs.</p>

            <div className="grid grid-cols-1 gap-4">
              {architect.architectureOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => selectArchitecture(option.id)}
                  className={`arch-card ${architect.selectedArchitecture === option.id ? 'arch-card-selected' : ''}`}
                >
                  {option.isRecommended && (
                    <div className="arch-card-badge flex items-center gap-1">
                      <Star size={10} /> Recommended
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">{option.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      option.complexity === 'low' ? 'bg-green-500/10 text-green-400' :
                      option.complexity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {option.complexity}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60 mb-3">{option.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-foreground/40 uppercase tracking-wider mb-1">Pros</p>
                      <ul className="arch-card-pros space-y-1 text-foreground/70">
                        {option.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-foreground/40 uppercase tracking-wider mb-1">Cons</p>
                      <ul className="arch-card-cons space-y-1 text-foreground/70">
                        {option.cons.map((con, i) => <li key={i}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={goBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => setArchitectStep('edit')}
                disabled={!architect.selectedArchitecture}
                className="btn-primary flex items-center gap-2"
              >
                <Pencil size={16} /> Customize & Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ---- STEP 5: CUSTOMIZE ---- */}
        {architect.step === 'edit' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Pencil size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Customize Architecture</h2>
            </div>
            <p className="text-sm text-foreground/50">
              Review the selected architecture. You can proceed to generate prompts or go back to change your selection.
            </p>

            {architect.selectedArchitecture && (() => {
              const selected = architect.architectureOptions.find(o => o.id === architect.selectedArchitecture);
              if (!selected) return null;
              return (
                <div className="bg-primary/20 rounded-xl p-6 border border-cta/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-cta">{selected.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-cta">
                      <Check size={14} /> Selected
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60">{selected.description}</p>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Components</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.components.map((comp, i) => (
                        <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-foreground/70">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-between">
              <button onClick={goBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-3">
                <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isProcessing} />
                <button onClick={handleCompilePrompts} disabled={isProcessing} className="btn-primary flex items-center gap-2">
                  {isProcessing ? (
                    <><Loader2 size={16} className="animate-spin" /> Compiling...</>
                  ) : (
                    <><FileOutput size={16} /> Generate Prompts <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- STEP 6: GENERATED PROMPTS ---- */}
        {architect.step === 'compile' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <FileOutput size={18} className="text-cta" />
              <h2 className="text-xl font-bold text-foreground">Generated Prompt Pipeline</h2>
            </div>
            <p className="text-sm text-foreground/50">
              Your production-ready prompts are below. Copy individual modules or the entire pipeline.
            </p>

            <div className="space-y-4">
              {architect.generatedPrompts.map((prompt, i) => (
                <PromptOutput
                  key={i}
                  content={prompt.content}
                  format={prompt.format}
                  label={`${i + 1}. ${prompt.name}`}
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={goBack} className="btn-ghost flex items-center gap-1.5">
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={resetArchitect} className="btn-primary flex items-center gap-2">
                <RotateCcw size={16} /> Start New Architecture
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="spinner !w-8 !h-8" />
              <p className="text-sm text-foreground/60">AI is processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
