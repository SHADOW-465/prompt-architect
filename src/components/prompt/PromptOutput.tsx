'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptOutputProps {
  content: string;
  format: string;
  label?: string;
}

export default function PromptOutput({ content, format, label }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prompt-output animate-fade-in-up">
      <div className="prompt-output-header">
        <div className="flex items-center gap-3">
          {label && <span className="text-xs font-medium text-foreground/50">{label}</span>}
          <span className="prompt-output-format">{format}</span>
        </div>
        <button
          onClick={handleCopy}
          className="btn-ghost flex items-center gap-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check size={14} className="text-cta" />
              <span className="text-cta">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="prompt-output-body">
        {content}
      </div>
    </div>
  );
}
