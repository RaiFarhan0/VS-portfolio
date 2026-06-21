import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText, Search, RefreshCw, GitCommit, Play, Star, AlertCircle, Trash2 } from 'lucide-react';
import { SidebarPanel } from './ActivityBar';
import { TabFile } from '../types';

interface SidebarProps {
  activePanel: SidebarPanel;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  openTabs: string[];
  tabFiles: TabFile[];
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{ fileId: string; fileName: string; snippet: string }>;
  
  // Git state
  isModified: boolean;
  modifiedFiles: string[];
  onCommit: () => void;
  onDiscardChanges: () => void;
  
  // Contacts State
  messages: Array<{ id: string; name: string; email: string; message: string; timestamp: string }>;
  onDeleteMessage: (id: string) => void;
  
  // Extension filter helper
  skillsList: Array<{ category: string; skills: string[] }>;
}

export default function Sidebar({
  activePanel,
  activeTab,
  onSelectTab,
  openTabs,
  tabFiles,
  
  searchQuery,
  setSearchQuery,
  searchResults,
  
  isModified,
  modifiedFiles,
  onCommit,
  onDiscardChanges,
  
  messages,
  onDeleteMessage,
  skillsList
}: SidebarProps) {
  
  // Folder collapse states
  const [srcExpanded, setSrcExpanded] = useState(true);
  const [componentsExpanded, setComponentsExpanded] = useState(true);
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);

  // Helper extension installation rating states
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([
    'tailwind', 'react', 'motion', 'gemini'
  ]);

  const toggleExtension = (extId: string) => {
    if (installedExtensions.includes(extId)) {
      setInstalledExtensions(installedExtensions.filter(id => id !== extId));
    } else {
      setInstalledExtensions([...installedExtensions, extId]);
    }
  };

  const getIcon = (type: string, active: boolean) => {
    switch (type) {
      case 'tsx':
      case 'ts':
        return <span className={`${active ? 'text-cyan-400' : 'text-[#519aba]'} text-xs font-bold shrink-0 w-3.5 text-center`}>TS</span>;
      case 'json':
        return <span className="text-yellow-400 text-xs shrink-0 w-3.5 text-center">{`{}`}</span>;
      case 'css':
        return <span className="text-blue-400 text-xs shrink-0 w-3.5 text-center">#</span>;
      case 'git':
        return <span className="text-orange-500 text-xs shrink-0 w-3.5 text-center font-bold">G</span>;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <aside className="w-64 bg-[#181c20] flex flex-col border-r border-[#2d3139] min-h-0 select-none h-full overflow-hidden">
      
      {/* Search Header or standard */}
      <div className="h-9 px-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#a0a0a0] shrink-0 border-b border-[#2d3139]/30">
        <span>
          {activePanel === 'explorer' && 'Explorer'}
          {activePanel === 'search' && 'Search'}
          {activePanel === 'git' && 'Source Control'}
          {activePanel === 'extensions' && 'Extensions'}
          {activePanel === 'contacts' && 'Inbox Messages'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden text-[13px] sidebar-scroll">
        
        {/* ================= PANELS ================= */}
        
        {/* PANEL: EXPLORER */}
        {activePanel === 'explorer' && (
          <div className="flex flex-col select-none py-1.5">
            {/* Folder: OPEN EDITORS */}
            <div>
              <button 
                onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
                className="w-full px-2 py-1 flex items-center gap-1 hover:bg-[#20252c] text-[#bbbbbb] font-sans font-bold text-[11px] uppercase tracking-wider text-left cursor-pointer"
              >
                {openEditorsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>Open Editors</span>
              </button>
              
              {openEditorsExpanded && (
                <div className="flex flex-col py-0.5">
                  {tabFiles.filter(f => openTabs.includes(f.id)).map(file => {
                    const active = activeTab === file.id;
                    return (
                      <button
                        key={`opened-${file.id}`}
                        onClick={() => onSelectTab(file.id)}
                        className={`w-full py-1 pl-6 pr-4 flex items-center gap-2 text-left text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer transition-colors ${
                          active ? 'bg-[#2a2d35] text-white font-medium' : 'hover:bg-[#1a1e24] text-[#a5a5a5]'
                        }`}
                      >
                        {getIcon(file.iconType, active)}
                        <span className="truncate">{file.name}</span>
                        {modifiedFiles.includes(file.id) && (
                          <div className="w-2 h-2 rounded-full bg-amber-400 ml-auto shrink-0" title="Modified" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Folder: PORTFOLIO-V2 ROOT */}
            <div className="mt-4">
              <div className="w-full px-2 py-1 flex items-center gap-1 text-[#cccccc] font-bold text-xs uppercase tracking-wider">
                <ChevronDown className="w-4 h-4 shrink-0" />
                <span className="truncate">PORTFOLIO-RF</span>
              </div>

              {/* Sub folder src */}
              <div className="ml-2">
                <button
                  onClick={() => setSrcExpanded(!srcExpanded)}
                  className="w-full py-1 px-1.5 flex items-center gap-1.5 text-left text-ellipsis overflow-hidden text-gray-300 hover:bg-[#20252c] cursor-pointer"
                >
                  {srcExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  {srcExpanded ? <FolderOpen className="w-4 h-4 text-sky-400 shrink-0" /> : <Folder className="w-4 h-4 text-sky-400 shrink-0" />}
                  <span>src</span>
                </button>

                {srcExpanded && (
                  <div className="ml-3 flex flex-col border-l border-[#2d3139]/50 pl-1 py-0.5">
                    {/* Components Folder */}
                    <div>
                      <button
                        onClick={() => setComponentsExpanded(!componentsExpanded)}
                        className="w-full py-1 px-1.5 flex items-center gap-1.5 text-left text-[#b5b5b5] hover:bg-[#20252c] cursor-pointer"
                      >
                        {componentsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                        {componentsExpanded ? <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" /> : <Folder className="w-4 h-4 text-amber-500 shrink-0" />}
                        <span>components</span>
                      </button>

                      {componentsExpanded && (
                        <div className="ml-3 flex flex-col border-l border-[#2d3139]/40 pl-1 py-0.5">
                          {tabFiles.filter(f => f.id === 'index.tsx' || f.id === 'projects.tsx' || f.id === 'contact.css').map(file => {
                            const active = activeTab === file.id;
                            return (
                              <button
                                key={`explorer-${file.id}`}
                                onClick={() => onSelectTab(file.id)}
                                className={`w-full py-1 px-2 flex items-center gap-2 text-left truncate cursor-pointer transition-colors ${
                                  active ? 'bg-[#2a2d35] text-white font-medium' : 'hover:bg-[#1a1e24] text-[#a5a5a5]'
                                }`}
                              >
                                {getIcon(file.iconType, active)}
                                <span className="truncate">{file.name}</span>
                                {modifiedFiles.includes(file.id) && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Files inside src */}
                    {tabFiles.filter(f => f.id === 'about.tsx' || f.id === 'git-history.log').map(file => {
                      const active = activeTab === file.id;
                      return (
                        <button
                          key={`explorer-${file.id}`}
                          onClick={() => onSelectTab(file.id)}
                          className={`w-full py-1 px-2 flex items-center gap-2 text-left truncate cursor-pointer transition-colors ${
                            active ? 'bg-[#2a2d35] text-white font-medium' : 'hover:bg-[#1a1e24] text-[#a5a5a5]'
                          }`}
                        >
                          {getIcon(file.iconType, active)}
                          <span className="truncate">{file.name}</span>
                          {modifiedFiles.includes(file.id) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* package.json inside root */}
              <div className="ml-2">
                {tabFiles.filter(f => f.id === 'package.json').map(file => {
                  const active = activeTab === file.id;
                  return (
                    <button
                      key={`explorer-${file.id}`}
                      onClick={() => onSelectTab(file.id)}
                      className={`w-full py-1 pl-[25px] pr-2 flex items-center gap-2 text-left truncate cursor-pointer transition-colors ${
                        active ? 'bg-[#2a2d35] text-white font-medium' : 'hover:bg-[#1a1e24] text-[#a5a5a5]'
                      }`}
                    >
                      {getIcon(file.iconType, active)}
                      <span className="truncate">{file.name}</span>
                      {modifiedFiles.includes(file.id) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: SEARCH */}
        {activePanel === 'search' && (
          <div className="p-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matching code keys..."
                className="w-full bg-[#111417] text-gray-200 border border-[#2d3139] px-2 py-1.5 focus:border-[#007acc] focus:outline-none rounded text-xs pl-8 placeholder:text-gray-600 font-mono"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500 pointer-events-none" />
            </div>

            <div className="space-y-4 text-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                {searchQuery ? `${searchResults.length} results found` : 'Type to search code properties'}
              </span>

              <div className="space-y-2">
                {searchResults.map((result, idx) => (
                  <button
                    key={`search-${idx}-${result.fileId}`}
                    onClick={() => onSelectTab(result.fileId)}
                    className="w-full p-2 bg-[#20252c]/50 hover:bg-[#20252c] rounded border border-transparent hover:border-[#2d3139] text-left block cursor-pointer transition-colors space-y-1 block"
                  >
                    <div className="flex items-center justify-between text-[#858585] text-[10px]">
                      <span className="font-bold text-gray-300 font-mono">{result.fileName}</span>
                      <span>result #{idx + 1}</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#ce9178] truncate">
                      ...<span className="bg-yellow-500/20 px-0.5 text-yellow-200 font-semibold">{searchQuery}</span>{result.snippet.split(searchQuery)[1] || ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL: GIT / SOURCE CONTROL */}
        {activePanel === 'git' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Changes</span>
              {isModified && (
                <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-400/20 px-1 py-0.2 rounded font-bold">
                  {modifiedFiles.length} files modified
                </span>
              )}
            </div>

            {isModified ? (
              <div className="space-y-4">
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {modifiedFiles.map(fileId => (
                    <div 
                      key={`git-mod-${fileId}`}
                      className="flex items-center justify-between py-1 px-2 hover:bg-[#20252c] rounded group"
                    >
                      <button 
                        onClick={() => onSelectTab(fileId)}
                        className="flex items-center gap-2 text-left text-xs text-amber-500 truncate cursor-pointer hover:underline"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{fileId}</span>
                      </button>
                      <span className="text-[10px] text-amber-500 font-bold font-sans pr-1">M</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onCommit}
                    className="w-full bg-[#007acc] hover:bg-[#0063a5] text-white p-2 rounded text-xs font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors shadow"
                  >
                    <GitCommit className="w-4 h-4" />
                    <span>Commit & Deploy Live</span>
                  </button>
                  
                  <button
                    onClick={onDiscardChanges}
                    className="w-full border border-[#2d3139] hover:bg-[#20252c] text-rose-400 hover:text-rose-300 p-2 rounded text-xs font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard Local Diff</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 font-sans space-y-2">
                <p>No changes detected in workspace.</p>
                <div className="text-[10px] italic">Try editing contact data or json profile tabs to stage custom code.</div>
              </div>
            )}

            <div className="border-t border-[#2d3139]/40 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase block">GitHub Synchronizer</span>
              <div className="bg-[#111417] p-2.5 rounded border border-[#2d3139]/50 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Repository</span>
                  <span className="text-gray-300">raifarhan/portfolio-v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sync Status</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-bold">● Up to date</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch</span>
                  <span className="text-sky-400">main*</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: EXTENSIONS (SKILLS CATEGORIZED) */}
        {activePanel === 'extensions' && (
          <div className="p-3 space-y-4">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">Developer Core Extensions</span>
            
            <div className="space-y-3">
              {/* Tailwind Ext */}
              <div className="p-2.5 bg-[#20252c]/50 rounded border border-[#2d3139] relative flex gap-3">
                <div className="w-9 h-9 rounded bg-[#111417] flex items-center justify-center text-sky-400 shrink-0 font-bold text-sm">
                  TW
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-gray-200">Tailwind CSS 4.0</div>
                  <div className="text-[#858585] text-[10px] leading-tight">Fast-styling dynamic utility engines.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-400/20 px-1 py-0.2 rounded font-bold">v4.0.0</span>
                    <button 
                      onClick={() => toggleExtension('tailwind')}
                      className="text-[10px] text-[#007acc] hover:underline font-bold"
                    >
                      {installedExtensions.includes('tailwind') ? 'Uninstall' : 'Install'}
                    </button>
                  </div>
                </div>
              </div>

              {/* React Hooks Ext */}
              <div className="p-2.5 bg-[#20252c]/50 rounded border border-[#2d3139] relative flex gap-3">
                <div className="w-9 h-9 rounded bg-[#111417] flex items-center justify-center text-cyan-400 shrink-0 font-bold text-sm">
                  RE
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-gray-200">React 19 System</div>
                  <div className="text-[#858585] text-[10px] leading-tight">Virtual DOM state sync & reactive components.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 px-1 py-0.2 rounded font-bold">v19.0.1</span>
                    <button 
                      onClick={() => toggleExtension('react')}
                      className="text-[10px] text-[#007acc] hover:underline font-bold"
                    >
                      {installedExtensions.includes('react') ? 'Uninstall' : 'Install'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Framer Motion Ext */}
              <div className="p-2.5 bg-[#20252c]/50 rounded border border-[#2d3139] relative flex gap-3">
                <div className="w-9 h-9 rounded bg-[#111417] flex items-center justify-center text-pink-500 shrink-0 font-bold text-sm">
                  MO
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-gray-200">Motion Layout</div>
                  <div className="text-[#858585] text-[10px] leading-tight">Fluid animations & interactive gesture triggers.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] bg-pink-500/10 text-pink-400 border border-pink-400/20 px-1 py-0.2 rounded font-bold">v12.2.0</span>
                    <button 
                      onClick={() => toggleExtension('motion')}
                      className="text-[10px] text-[#007acc] hover:underline font-bold"
                    >
                      {installedExtensions.includes('motion') ? 'Uninstall' : 'Install'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Google Gemini Ext */}
              <div className="p-2.5 bg-[#20252c]/50 rounded border border-[#2d3139] relative flex gap-3">
                <div className="w-9 h-9 rounded bg-[#111417] flex items-center justify-center text-[#ff5f56] shrink-0 font-semibold text-sm">
                  Gem
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-gray-200">Google GenAI Pro</div>
                  <div className="text-[#858585] text-[10px] leading-tight">Intelligent content analysis & dynamic summaries.</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-400/20 px-1 py-0.2 rounded font-bold">v2.4.0</span>
                    <button 
                      onClick={() => toggleExtension('gemini')}
                      className="text-[10px] text-[#007acc] hover:underline font-bold"
                    >
                      {installedExtensions.includes('gemini') ? 'Uninstall' : 'Install'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: INBOX / CONTACTS SUBMISSIONS */}
        {activePanel === 'contacts' && (
          <div className="p-4 space-y-4">
            <span className="text-[11px] font-bold text-gray-500 uppercase block">Submitted Proposals</span>
            
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 bg-[#20252c]/50 rounded border border-[#2d3139] transition-colors hover:border-[#007acc] relative group"
                  >
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-rose-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-xs space-y-1 font-mono">
                      <div className="font-bold text-gray-200 truncate">{msg.name}</div>
                      <div className="text-[10px] text-[#858585] truncate">{msg.email}</div>
                      <p className="text-[#cccccc] text-[11px] font-sans pt-1 font-normal line-clamp-3 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <div className="text-[9px] text-[#858585] pt-1.5 text-right font-sans">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600 font-sans space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto stroke-[1.5] text-gray-700" />
                <p className="text-xs">Incoming mailbox is currently empty.</p>
                <div className="text-[10px] italic max-w-[200px] mx-auto">Use the contact.css Bash console to submit a message to Rai Farhan!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
