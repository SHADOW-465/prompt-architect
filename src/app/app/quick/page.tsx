'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import PromptOutput from '@/components/prompt/PromptOutput';
import { Zap, Sparkles, FileText, Code, FileCode2, MessageSquare, Info } from 'lucide-react';
import type { PromptFormat } from '@/lib/store/useAppStore';

const FORMAT_OPTIONS: { value: PromptFormat; label: string; icon: React.ElementType }[] = [
  { value: 'plain', label: 'Plain Text', icon: FileText },
  { value: 'json', label: 'JSON', icon: Code },
  { value: 'xml', label: 'XML', icon: FileCode2 },
  { value: 'yaml', label: 'YAML', icon: FileCode2 },
  { value: 'system_user', label: 'System / User', icon: MessageSquare },
];

export default function QuickPromptPage() {
  const {
    quickPromptInput,
    quickPromptOutput,
    quickPromptFormat,
    quickPromptExplanation,
    isOptimizing,
    setQuickPromptInput,
    setQuickPromptOutput,
    setQuickPromptFormat,
    setQuickPromptExplanation,
    setIsOptimizing,
    setPromptMetrics,
    setAiReasoning,
  } = useAppStore();

  const [showExplanation, setShowExplanation] = useState(true);

  const handleOptimize = async () => {
    if (!quickPromptInput.trim() || isOptimizing) return;

    setIsOptimizing(true);
    setQuickPromptOutput('');
    setQuickPromptExplanation('');
    setAiReasoning('Analyzing prompt structure, identifying intent gaps, and optimizing for clarity and token efficiency...');

    try {
      const res = await fetch('/api/quick-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: quickPromptInput,
          format: quickPromptFormat,
          explain: showExplanation,
        }),
      });

      if (!res.ok) throw new Error('Failed to optimize prompt');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE data chunks from Vercel AI SDK
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                fullText += text;
              } catch {
                // skip non-JSON lines
              }
            }
          }

          // Split explanation if present
          if (fullText.includes('---EXPLANATION---')) {
            const [prompt, explanation] = fullText.split('---EXPLANATION---');
            setQuickPromptOutput(prompt.trim());
            setQuickPromptExplanation(explanation.trim());
            setAiReasoning(explanation.trim());
          } else {
            setQuickPromptOutput(fullText.trim());
          }
        }
      }

      // Generate mock metrics based on output (in production, these would come from a separate analysis call)
      const outputLength = fullText.length;
      const inputLength = quickPromptInput.length;
      const ratio = Math.min(outputLength / Math.max(inputLength, 1), 5);

      setPromptMetrics({
        clarity: Math.min(95, 60 + Math.floor(ratio * 8)),
        tokenEfficiency: Math.min(90, 50 + Math.floor((1 / ratio) * 40)),
        modelCompatibility: Math.min(95, 75 + Math.floor(Math.random() * 20)),
        ambiguityRisk: Math.max(5, 40 - Math.floor(ratio * 8)),
      });

      setAiReasoning(
        fullText.includes('---EXPLANATION---')
          ? fullText.split('---EXPLANATION---')[1].trim()
          : 'Prompt optimized successfully. The output has been restructured for better clarity and model compatibility.'
      );
    } catch (error) {
      console.error('Optimization failed:', error);
      setQuickPromptOutput('Error: Failed to optimize prompt. Please check your API key and try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-cta/10 flex items-center justify-center">
          <Zap size={20} className="text-cta" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quick Prompt</h1>
          <p className="text-sm text-foreground/50">Paste any prompt. Get an optimized version instantly.</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="card-static space-y-4">
        <textarea
          value={quickPromptInput}
          onChange={(e) => setQuickPromptInput(e.target.value)}
          className="input-field min-h-[180px] resize-none text-[15px] leading-relaxed"
          placeholder="Paste your prompt here... e.g., 'help me build a modern fitness tracking app for iOS using React Native'"
        />

        {/* Format Selector + Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-primary/30 rounded-lg p-1">
            {FORMAT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setQuickPromptFormat(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  quickPromptFormat === value
                    ? 'bg-cta text-white shadow-sm'
                    : 'text-foreground/50 hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`btn-ghost flex items-center gap-1.5 text-xs ${showExplanation ? 'text-cta' : ''}`}
          >
            <Info size={14} />
            Explain Changes
          </button>

          <button
            onClick={handleOptimize}
            disabled={!quickPromptInput.trim() || isOptimizing}
            className="btn-primary ml-auto flex items-center gap-2 text-sm px-5 py-2.5"
          >
            {isOptimizing ? (
              <>
                <div className="spinner" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Optimize Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {quickPromptOutput && (
        <div className="space-y-4">
          <PromptOutput
            content={quickPromptOutput}
            format={quickPromptFormat}
            label="Optimized Prompt"
          />

          {quickPromptExplanation && (
            <div className="card-static border-cta/20">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-cta" />
                <h3 className="text-sm font-bold text-foreground">Improvement Explanation</h3>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
                {quickPromptExplanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {isOptimizing && !quickPromptOutput && (
        <div className="space-y-3">
          <div className="h-4 w-3/4 rounded animate-shimmer" />
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-5/6 rounded animate-shimmer" />
          <div className="h-4 w-2/3 rounded animate-shimmer" />
        </div>
      )}
    </div>
  );
}
