import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20 relative overflow-hidden">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.15),rgba(15,23,42,0))]"></div>

      <main className="flex flex-col items-center max-w-4xl space-y-8 z-10">
        <div className="glass px-4 py-1.5 rounded-full text-sm font-medium text-cta border-cta/20 mb-4 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          v1.0.0 Now Available
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cta to-emerald-300">AI Prompt</span> Architect
        </h1>

        <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
          Convert vague user intent into highly structured, context-rich prompts.
          Stop guessing and start engineering.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
          <Link href="/architect" className="btn-primary w-full sm:w-auto hover:scale-[1.02]">
            Launch Prompt Architect
          </Link>
          <Link href="/library" className="btn-secondary w-full sm:w-auto hover:bg-white/5">
            Explore Prompt Library
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 text-left">
          <div className="card group">
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Intent Detection</h3>
            <p className="text-sm text-foreground/60">Automatically categorize and structure your goals.</p>
          </div>
          <div className="card group">
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Context Assembly</h3>
            <p className="text-sm text-foreground/60">Identify and fill the missing gaps in your inputs.</p>
          </div>
          <div className="card group">
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-cta transition-colors">Prompt Generation</h3>
            <p className="text-sm text-foreground/60">Instantly generate AI-optimized payloads.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
