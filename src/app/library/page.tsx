import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LibraryPage() {
    // Try-catch protects against build errors if DB isn't migrated locally yet
    let prompts = [];
    try {
        prompts = await prisma.prompt.findMany({
            orderBy: { lastUsed: 'desc' },
            take: 20
        });
    } catch (e) {
        console.warn("DB not connected or migrated yet", e);
    }

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">

                <header className="flex items-center justify-between mb-12 border-b border-secondary/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Prompt Library</h1>
                        <p className="text-foreground/70 mt-2">Manage and reuse your optimized master prompts.</p>
                    </div>
                    <Link href="/" className="btn-secondary">
                        &larr; Back to Architect
                    </Link>
                </header>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        className="input-field flex-grow"
                        disabled
                    />
                    <button className="btn-primary" disabled>
                        + New Template
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-secondary/50 rounded-2xl bg-secondary/10">
                            <svg className="w-12 h-12 text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-xl font-semibold justify-center text-foreground">Library is Empty</h3>
                            <p className="text-foreground/50 mt-2 text-center max-w-sm">
                                You haven't generated any saved prompts yet. Use the Architect to create your first one.
                            </p>
                        </div>
                    ) : (
                        prompts.map((prompt: any) => (
                            <div key={prompt.id} className="card group hover:border-cta/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-cta/10 text-cta rounded-md uppercase tracking-wider">
                                        {prompt.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cta transition-colors">
                                    {prompt.title}
                                </h3>
                                <p className="text-sm text-foreground/70 line-clamp-3 mb-4 leading-relaxed">
                                    {prompt.description || prompt.promptContent}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-secondary/30">
                                    {prompt.tags.map((tag: string) => (
                                        <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-foreground/50 bg-secondary/50 px-2 py-1 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
