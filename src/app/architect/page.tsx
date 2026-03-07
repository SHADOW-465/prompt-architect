'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ArchitectDashboard() {
    const [activeMode, setActiveMode] = useState<'quick' | 'guided' | 'expert' | 'learning'>('quick');

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">

                <header className="flex items-center justify-between mb-8 pb-6 border-b border-secondary/30">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground drop-shadow-sm">Prompt Architect Sandbox</h1>
                        <p className="text-foreground/70 mt-2">Design, evaluate, and learn prompt engineering through dynamic AI interfaces.</p>
                    </div>
                    <Link href="/" className="btn-secondary">
                        &larr; Back Home
                    </Link>
                </header>

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveMode('quick')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeMode === 'quick' ? 'bg-cta text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] shadow-cta/20 transform -translate-y-[2px]' : 'bg-secondary/20 text-foreground/80 hover:bg-secondary/40'}`}
                    >
                        ⚡ Quick Prompt
                    </button>
                    <button
                        onClick={() => setActiveMode('guided')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeMode === 'guided' ? 'bg-cta text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] transform -translate-y-[2px]' : 'bg-secondary/20 text-foreground/80 hover:bg-secondary/40'}`}
                    >
                        💬 Guided Mode
                    </button>
                    <button
                        onClick={() => setActiveMode('expert')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeMode === 'expert' ? 'bg-cta text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] transform -translate-y-[2px]' : 'bg-secondary/20 text-foreground/80 hover:bg-secondary/40'}`}
                    >
                        🛠 Expert Form
                    </button>
                    <button
                        onClick={() => setActiveMode('learning')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeMode === 'learning' ? 'bg-cta text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] transform -translate-y-[2px]' : 'bg-secondary/20 text-foreground/80 hover:bg-secondary/40'}`}
                    >
                        🎓 Learning Mode
                    </button>
                </div>

                <div className="card min-h-[500px] flex flex-col relative overflow-hidden">

                    {/* subtle radiant background for the active pane */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-cta/5 blur-3xl rounded-full pointer-events-none"></div>

                    {activeMode === 'quick' && (
                        <div className="space-y-6 flex-grow flex flex-col z-10 animate-fade-in-up">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Quick Prompt Generator</h2>
                                <p className="text-foreground/60 mt-1">Generate a highly structured prompt instantly from a single vague sentence.</p>
                            </div>
                            <textarea
                                className="input-field flex-grow min-h-[200px] resize-none text-lg"
                                placeholder="E.g., help me build a modern fitness tracking app for iOS using React Native..."
                            />
                            <button className="btn-primary w-full md:w-auto self-start shadow-xl">Synthesize Optimal Prompt</button>
                        </div>
                    )}

                    {activeMode === 'guided' && (
                        <div className="space-y-6 flex-grow flex flex-col z-10 animate-fade-in-up">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                    Guided AI Assistant
                                    <span className="bg-cta/20 text-cta text-xs px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Interactive</span>
                                </h2>
                                <p className="text-foreground/60 mt-1">Our AI will ask you clarifying questions until your context gap is perfectly sealed.</p>
                            </div>

                            <div className="flex-grow bg-[#0A0F1C]/80 rounded-xl p-6 border border-secondary/30 flex flex-col justify-end space-y-4 shadow-inner">
                                <div className="self-start max-w-[85%] glass p-4 rounded-2xl rounded-tl-sm border-l-4 border-cta shadow-md hover:shadow-lg transition-all duration-300">
                                    <p className="text-xs font-bold text-cta mb-1 tracking-wider uppercase">Architect AI</p>
                                    <p className="text-foreground leading-relaxed">Hello! What are you trying to accomplish today? Give me a rough idea, and I'll ask the right questions.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <input type="text" className="input-field flex-grow" placeholder="Type your initial idea here..." />
                                <button className="btn-primary flex-shrink-0 px-8">Send</button>
                            </div>
                        </div>
                    )}

                    {activeMode === 'expert' && (
                        <div className="space-y-6 flex-grow z-10 animate-fade-in-up">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Expert Parameter Tuning</h2>
                                <p className="text-foreground/60 mt-1">Bypass the conversational UI. Manually inject all engine parameters for maximum deterministic control.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest uppercase text-foreground/50">Intent Category</label>
                                    <select className="input-field bg-primary/40">
                                        <option>Software Development</option>
                                        <option>UI/UX Design</option>
                                        <option>Content Creation</option>
                                        <option>Research</option>
                                        <option>Business Strategy</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest uppercase text-foreground/50">Target Audience / Users</label>
                                    <input type="text" className="input-field" placeholder="e.g., Beginners, Enterprise C-Suite" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold tracking-widest uppercase text-foreground/50">Core Features & Requirements</label>
                                    <textarea className="input-field h-32 resize-none" placeholder="List all complex constraints, boundaries, and technical details..." />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <label className="text-xs font-bold tracking-widest uppercase text-foreground/50">Output Formatting</label>
                                    <input type="text" className="input-field" placeholder="e.g., Valid JSON array, Markdown Table, Code snippet" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-secondary/20 mt-6 text-right">
                                <button className="btn-primary w-full md:w-auto shadow-lg shadow-cta/20 hover:shadow-cta/40">Compile Meta-Prompt</button>
                            </div>
                        </div>
                    )}

                    {activeMode === 'learning' && (
                        <div className="space-y-6 flex-grow z-10 animate-fade-in-up">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Interactive Learning Engine</h2>
                                <p className="text-foreground/60 mt-1">Upload an existing prompt. The Explanation Engine will deconstruct it and teach you why it fails or succeeds.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80">Your Raw Prompt</h3>
                                    <textarea className="input-field h-64 resize-none" placeholder="Paste your bad prompt here to see why it fails..." />
                                    <button className="btn-secondary w-full border-secondary/50 hover:bg-white/5">Analyze & Deconstruct &rarr;</button>
                                </div>
                                <div className="space-y-4 glass p-8 rounded-xl border-dashed border-2 border-secondary/40 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-cta/30">
                                    <div className="w-16 h-16 rounded-full bg-cta/10 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-cta opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Awaiting Input</h3>
                                    <p className="text-sm text-foreground/60 max-w-xs mx-auto">
                                        The Explanation Engine will highlight anti-patterns, map intent gaps, and suggest professional structural improvements here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
