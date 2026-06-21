import React from 'react';
import { Layout, Search, Sidebar, RefreshCw, X } from 'lucide-react';

interface TitleBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
}

export default function TitleBar({ sidebarOpen, setSidebarOpen, activeTab }: TitleBarProps) {
  return (
    <header className="h-9 bg-[#111417] flex items-center justify-between px-3 select-none text-xs border-b border-[#1c1f24] shrink-0 relative z-50">
      <div className="flex items-center gap-4 overflow-hidden">
        {/* macOS Window dots */}
        <div className="flex gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-75 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-75 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-75 cursor-pointer"></div>
        </div>
        <span className="text-[#858585] truncate font-sans text-[11px] md:text-xs">
          Rai Farhan — Portfolio Workspace — <strong className="text-gray-300 font-normal">{activeTab}</strong>
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-[#858585]">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hover:text-white cursor-pointer focus:outline-none transition-colors p-1 ${sidebarOpen ? 'text-white' : ''}`}
          title="Toggle Side Bar"
        >
          <Sidebar className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
