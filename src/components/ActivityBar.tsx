import React from 'react';
import { Files, Search, GitBranch, Box, Mail, Github, Linkedin, Settings, User } from 'lucide-react';

export type SidebarPanel = 'explorer' | 'search' | 'git' | 'extensions' | 'contacts';

interface ActivityBarProps {
  activePanel: SidebarPanel;
  setActivePanel: (panel: SidebarPanel) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  gitBadgeCount: number;
  messageBadgeCount: number;
}

export default function ActivityBar({
  activePanel,
  setActivePanel,
  sidebarOpen,
  setSidebarOpen,
  gitBadgeCount,
  messageBadgeCount
}: ActivityBarProps) {
  
  const handlePanelClick = (panel: SidebarPanel) => {
    if (activePanel === panel && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActivePanel(panel);
      setSidebarOpen(true);
    }
  };

  const navItems = [
    { 
      id: 'explorer' as SidebarPanel, 
      icon: Files, 
      label: 'Explorer',
      badge: 0
    },
    { 
      id: 'search' as SidebarPanel, 
      icon: Search, 
      label: 'Search (Ctrl+Shift+F)',
      badge: 0
    },
    { 
      id: 'git' as SidebarPanel, 
      icon: GitBranch, 
      label: 'Source Control',
      badge: gitBadgeCount
    },
    { 
      id: 'extensions' as SidebarPanel, 
      icon: Box, 
      label: 'Extensions (Skills)',
      badge: 0
    },
    { 
      id: 'contacts' as SidebarPanel, 
      icon: Mail, 
      label: 'Contact Submissions',
      badge: messageBadgeCount
    },
  ];

  return (
    <aside className="w-12 bg-[#121417] flex flex-col items-center py-2.5 gap-1.5 border-r border-[#1c1f24] shrink-0 z-20 h-full select-none">
      {/* Navigation Panels */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePanel === item.id && sidebarOpen;
        return (
          <button
            key={item.id}
            onClick={() => handlePanelClick(item.id)}
            title={item.label}
            className={`w-full h-11 flex items-center justify-center relative transition-colors focus:outline-none cursor-pointer group ${
              isActive ? 'text-white' : 'text-[#858585] hover:text-gray-300'
            }`}
          >
            {/* Active left bar */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc]" />
            )}
            
            <Icon className="w-5 h-5 group-hover:scale-105 transition-transform" />
            
            {/* Badges */}
            {item.badge > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#007acc] text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-sans font-bold px-1 scale-90 border border-[#121417]">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer System Links */}
      <div className="flex flex-col items-center gap-2 w-full pt-4 border-t border-[#1c1f24]/50">
        <a
          href="https://github.com/raifarhan"
          target="_blank"
          rel="noreferrer"
          title="GitHub Profile"
          className="w-10 h-10 flex items-center justify-center text-[#858585] hover:text-white hover:bg-[#1f232a] rounded-lg transition-all"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://linkedin.com/in/raifarhan"
          target="_blank"
          rel="noreferrer"
          title="LinkedIn Profile"
          className="w-10 h-10 flex items-center justify-center text-[#858585] hover:text-white hover:bg-[#1f232a] rounded-lg transition-all"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        
        <div
          title="Recruiter Account Status: Verified"
          className="w-10 h-10 flex items-center justify-center text-emerald-500 hover:text-emerald-400 rounded-lg cursor-help scale-110"
        >
          <User className="w-4.5 h-4.5" />
        </div>
        
        <div
          title="IDE Settings"
          className="w-10 h-10 flex items-center justify-center text-[#858585] hover:text-white hover:bg-[#1f232a] rounded-lg cursor-pointer"
        >
          <Settings className="w-4.5 h-4.5" />
        </div>
      </div>
    </aside>
  );
}
