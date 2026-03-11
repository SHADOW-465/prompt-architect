'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: Array<{ id: string; label: string }>;
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
}

export default function StepIndicator({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = completedSteps.includes(step.id);
        const canClick = isComplete || isActive;

        return (
          <div key={step.id} className="contents">
            <div className="step-dot-group">
              <button
                onClick={() => canClick && onStepClick?.(step.id)}
                className={`step-dot ${isActive ? 'step-dot-active' : ''} ${isComplete ? 'step-dot-complete' : ''}`}
                style={{ cursor: canClick ? 'pointer' : 'default' }}
                disabled={!canClick}
              >
                {isComplete ? <Check size={14} /> : index + 1}
              </button>
              <span className={`step-label ${isActive ? 'step-label-active' : ''}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${isComplete ? 'step-line-complete' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
