import Link from "next/link";
import { Zap, Compass, BookOpen, ArrowRight, Sparkles, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20 relative overflow-hidden">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.15),rgba(15,23,42,0))]"></div>

      <main className="flex flex-col items-center max-w-4xl space-y-8 z-10">
        <div className="glass px-4 py-1.5 rounded-full text-sm font-medium text-cta border-cta/20 mb-4 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          v1.0.0 Now Available
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-emerald-300">Architect</span>
        </h1>

        <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
          Design, optimize, and test AI prompts with guided architecture.
          Stop guessing — start engineering.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
          <Link href="/app/quick" className="btn-primary w-full sm:w-auto hover:scale-[1.02] flex items-center justify-center gap-2">
            <Zap size={18} />
            Quick Prompt
          </Link>
          <Link href="/app/architect" className="btn-secondary w-full sm:w-auto hover:bg-white/5 flex items-center justify-center gap-2">
            <Compass size={18} />
            Prompt Architect
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 text-left">
          <div className="card group">
            <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center mb-4">
              <Brain size={20} className="text-cta" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Intent Detection</h3>
            <p className="text-sm text-foreground/60">AI analyzes your idea to extract product type, capability needs, and complexity level.</p>
          </div>
          <div className="card group">
            <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center mb-4">
              <Sparkles size={20} className="text-cta" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Smart Architecture</h3>
            <p className="text-sm text-foreground/60">Get 3 architecture options from simple to multi-agent, with trade-off analysis.</p>
          </div>
          <div className="card group">
            <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center mb-4">
              <Zap size={20} className="text-cta" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Prompt Generation</h3>
            <p className="text-sm text-foreground/60">Instantly generate production-ready prompts and pipelines, optimized for any AI model.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
