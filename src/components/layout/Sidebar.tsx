'use client';

import { useAppStore } from '@/lib/store/useAppStore';
import { usePathname, useRouter } from 'next/navigation';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  Compass,
  BookOpen,
  Plus,
  Clock,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeMode, setActiveMode } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleModeSwitch = (mode: 'quick' | 'architect') => {
    setActiveMode(mode);
    router.push(mode === 'quick' ? '/app/quick' : '/app/architect');
  };

  return (
    <aside
      className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </button>

      {sidebarOpen && (
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Zap size={20} className="text-cta" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">Prompt Architect</h2>
              <p className="text-[10px] text-foreground/40 uppercase tracking-widest">v1.0</p>
            </div>
          </div>

          {/* New Session */}
          <button className="sidebar-new-session">
            <Plus size={16} />
            <span>New Session</span>
          </button>

          {/* Mode Selector */}
          <div className="sidebar-section">
            <p className="sidebar-section-label">Mode</p>
            <button
              onClick={() => handleModeSwitch('quick')}
              className={`sidebar-mode-btn ${activeMode === 'quick' || pathname === '/app/quick' ? 'sidebar-mode-active' : ''}`}
            >
              <Zap size={16} />
              <span>Quick Prompt</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => handleModeSwitch('architect')}
              className={`sidebar-mode-btn ${activeMode === 'architect' || pathname === '/app/architect' ? 'sidebar-mode-active' : ''}`}
            >
              <Compass size={16} />
              <span>Prompt Architect</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Saved Prompts */}
          <div className="sidebar-section">
            <p className="sidebar-section-label">Library</p>
            <button
              onClick={() => router.push('/app/library')}
              className={`sidebar-mode-btn ${pathname === '/app/library' ? 'sidebar-mode-active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Saved Prompts</span>
            </button>
          </div>

          {/* Recent Sessions */}
          <div className="sidebar-section mt-auto">
            <p className="sidebar-section-label">Recent</p>
            <div className="sidebar-recent-empty">
              <Clock size={14} className="text-foreground/30" />
              <span className="text-xs text-foreground/30">No recent sessions</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
