'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import {
  PanelRightClose,
  PanelRightOpen,
  Brain,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Gauge,
  Shield,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

function MetricBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="metric-bar-container">
      <div className="metric-bar-header">
        <div className="metric-bar-label">
          <Icon size={14} style={{ color }} />
          <span>{label}</span>
        </div>
        <span className="metric-bar-value" style={{ color }}>{value}%</span>
      </div>
      <div className="metric-bar-track">
        <div
          className="metric-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function RightPanel() {
  const { rightPanelOpen, toggleRightPanel, promptMetrics, aiReasoning } = useAppStore();
  const [reasoningOpen, setReasoningOpen] = useState(true);

  return (
    <aside
      className={`right-panel-container ${rightPanelOpen ? 'right-panel-open' : 'right-panel-closed'}`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleRightPanel}
        className="right-panel-toggle"
        aria-label={rightPanelOpen ? 'Collapse panel' : 'Expand panel'}
      >
        {rightPanelOpen ? (
          <PanelRightClose size={18} />
        ) : (
          <PanelRightOpen size={18} />
        )}
      </button>

      {rightPanelOpen && (
        <div className="right-panel-content">
          {/* AI Reasoning Section */}
          <div className="right-panel-section">
            <button
              onClick={() => setReasoningOpen(!reasoningOpen)}
              className="right-panel-section-header"
            >
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-cta" />
                <span className="text-sm font-bold text-foreground">AI Reasoning</span>
              </div>
              {reasoningOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {reasoningOpen && (
              <div className="right-panel-reasoning">
                {aiReasoning ? (
                  <p className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">
                    {aiReasoning}
                  </p>
                ) : (
                  <div className="right-panel-empty">
                    <Sparkles size={16} className="text-foreground/20" />
                    <p className="text-xs text-foreground/30">
                      AI reasoning will appear here as you interact with the system.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prompt Quality Metrics */}
          <div className="right-panel-section">
            <div className="right-panel-section-header cursor-default">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-cta" />
                <span className="text-sm font-bold text-foreground">Quality Metrics</span>
              </div>
            </div>
            <div className="right-panel-metrics">
              {promptMetrics ? (
                <>
                  <MetricBar
                    label="Clarity"
                    value={promptMetrics.clarity}
                    icon={Sparkles}
                    color="#22C55E"
                  />
                  <MetricBar
                    label="Token Efficiency"
                    value={promptMetrics.tokenEfficiency}
                    icon={Gauge}
                    color="#3B82F6"
                  />
                  <MetricBar
                    label="Model Compatibility"
                    value={promptMetrics.modelCompatibility}
                    icon={Shield}
                    color="#8B5CF6"
                  />
                  <MetricBar
                    label="Ambiguity Risk"
                    value={promptMetrics.ambiguityRisk}
                    icon={AlertTriangle}
                    color={promptMetrics.ambiguityRisk > 50 ? '#EF4444' : '#F59E0B'}
                  />
                </>
              ) : (
                <div className="right-panel-empty">
                  <BarChart3 size={16} className="text-foreground/20" />
                  <p className="text-xs text-foreground/30">
                    Generate a prompt to see quality metrics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
