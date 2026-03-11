'use client';

import { AVAILABLE_MODELS } from '@/lib/models';

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
}

const PROVIDER_LABELS: Record<string, string> = {
  groq: 'Groq',
  openrouter: 'OpenRouter',
  claude: 'Claude',
};

export default function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const selected = AVAILABLE_MODELS.find((m) => m.id === value) ?? AVAILABLE_MODELS[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-foreground/40 font-medium">Model</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="appearance-none bg-primary/30 border border-white/10 rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-foreground cursor-pointer hover:border-cta/40 focus:outline-none focus:border-cta/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(['groq', 'openrouter', 'claude'] as const).map((provider) => (
            <optgroup key={provider} label={PROVIDER_LABELS[provider]}>
              {AVAILABLE_MODELS.filter((m) => m.provider === provider).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground/40"
            />
          </svg>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          selected.tier === 'free'
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-amber-500/15 text-amber-400'
        }`}
      >
        {selected.tier === 'free' ? 'FREE' : 'PRO'}
      </span>
    </div>
  );
}
