'use client';

import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { useAppStore } from '@/lib/store/useAppStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, rightPanelOpen } = useAppStore();

  return (
    <div className="app-shell">
      <Sidebar />
      <main
        className={`app-main ${!sidebarOpen ? 'sidebar-collapsed' : ''} ${!rightPanelOpen ? 'right-collapsed' : ''}`}
      >
        {children}
      </main>
      <RightPanel />
    </div>
  );
}
