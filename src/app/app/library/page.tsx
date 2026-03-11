import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-cta/10 flex items-center justify-center">
          <BookOpen size={20} className="text-cta" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prompt Library</h1>
          <p className="text-sm text-foreground/50">Your saved and optimized prompts.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search prompts..."
          className="input-field flex-grow"
        />
      </div>

      <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-secondary/50 rounded-2xl bg-secondary/10">
        <svg className="w-12 h-12 text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-xl font-semibold text-foreground">Library is Empty</h3>
        <p className="text-foreground/50 mt-2 text-center max-w-sm">
          You haven&apos;t saved any prompts yet. Use Quick Prompt or Prompt Architect to generate your first one.
        </p>
        <Link href="/app/quick" className="btn-primary mt-6 flex items-center gap-2 text-sm">
          Get Started
        </Link>
      </div>
    </div>
  );
}
