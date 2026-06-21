import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play, AlertTriangle, CheckCircle2, ChevronRight, ChevronUp, ChevronDown, Minus, Maximize2 } from 'lucide-react';
import { TerminalOutput } from '../types';

interface TerminalPaneProps {
  messages: Array<{ id: string; name: string; email: string; message: string; timestamp: string }>;
  modifiedFiles: string[];
  isModified: boolean;
  onPostCommand: (cmd: string) => void;
  terminalLogs: TerminalOutput[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<TerminalOutput[]>>;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  jsonParseError: string | null;
}

export default function TerminalPane({
  messages,
  modifiedFiles,
  isModified,
  onPostCommand,
  terminalLogs,
  setTerminalLogs,
  activeTab,
  onSelectTab,
  jsonParseError
}: TerminalPaneProps) {
  
  const [activePaneTab, setActivePaneTab] = useState<'problems' | 'output' | 'debug' | 'terminal'>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [loadingBuild, setLoadingBuild] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState<'short' | 'normal' | 'tall'>('short');
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'problems' | 'output' | 'debug' | 'terminal') => {
    setActivePaneTab(tab);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  // Auto-scroll terminal logs to bottom on update
  useEffect(() => {
    if (activePaneTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activePaneTab]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;

    // Post to log channel
    const newLog = (text: string, type: 'info' | 'success' | 'error' | 'command' = 'info') => {
      setTerminalLogs(prev => [...prev, {
        id: Math.random().toString(),
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    newLog(`➜  ~ ${command}`, 'command');

    const cmdLower = command.toLowerCase();
    
    if (cmdLower === 'help') {
      newLog('Available portfolio workspace commands:', 'info');
      newLog('  help                 Display active shell instructions', 'info');
      newLog('  about                Read Rai Farhan developer profiles', 'info');
      newLog('  projects             Preview current active portfolio projects', 'info');
      newLog('  skills               List key engineering competencies', 'info');
      newLog('  git diff             View staged additions and deletions', 'info');
      newLog('  npm run build        Bundle development profile and code modules', 'info');
      newLog('  clear                Flush terminal trace logs', 'info');
    } else if (cmdLower === 'clear') {
      setTerminalLogs([]);
    } else if (cmdLower === 'about') {
      onSelectTab('about.tsx');
      newLog('SUCCESS: Porting file workspace focus to about.tsx', 'success');
      newLog('JSON Payload:\n  "Role": "AI & Machine Learning Developer"\n  "Location": "Nankana Sahib, Pakistan"\n  "Mission": "To leverage advanced algorithmic engineering and automation skills within professional and academic ecosystems."', 'info');
    } else if (cmdLower === 'projects') {
      onSelectTab('projects.tsx');
      newLog('SUCCESS: Focused components/Portfolio/projects.tsx', 'success');
      newLog('Projects parsed:\n  • E-Commerce Analytics Dashboard\n  • Microservices Edge Gateway\n  • AI Developer Assistant Extension', 'info');
    } else if (cmdLower === 'skills') {
      onSelectTab('package.json');
      newLog('Loaded competencies package manifest (package.json).', 'success');
    } else if (cmdLower === 'git diff') {
      if (isModified) {
        newLog('diff --git a/dev_workspace b/production', 'info');
        modifiedFiles.forEach(file => {
          newLog(`--- a/src/${file}`, 'error');
          newLog(`+++ b/src/${file}`, 'success');
          newLog(`+ Edited local state for profile variable parameters in ${file}`, 'success');
        });
      } else {
        newLog('Clean status: No local diffs detected. Try changing some JSON profiles!', 'info');
      }
    } else if (cmdLower === 'npm run build' || cmdLower === 'npm run dev') {
      setLoadingBuild(true);
      newLog('Executing "npm run build" process...', 'info');
      setTimeout(() => {
        newLog('✓ [vite] Bundling files & assets configured successfully', 'success');
        newLog('✓ [esbuild] Compiling node server dependencies', 'success');
        newLog('✓ Output written into dist/ folder (0 errors, 0 warnings)', 'success');
        setLoadingBuild(false);
      }, 1500);
    } else {
      newLog(`bash: command worklog not recognized: "${command}". Type "help" for guidelines.`, 'error');
    }

    setTerminalInput('');
  };

  const dynamicHeightClass = isCollapsed 
    ? 'h-9' 
    : terminalHeight === 'short' 
      ? 'h-40' 
      : terminalHeight === 'normal' 
        ? 'h-56' 
        : 'h-72';

  return (
    <div className={`${dynamicHeightClass} bg-[#121417] border-t border-[#2d3139] flex flex-col min-w-0 shrink-0 z-10 select-none transition-all duration-200 overflow-hidden`}>
      
      {/* Header Tabs */}
      <div className="h-9 flex items-center bg-[#111417] px-4 justify-between border-b border-[#2d3139]/40 text-xs text-[#858585]">
        
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleTabClick('problems')}
            className={`py-2 px-1 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePaneTab === 'problems' ? 'text-white font-bold' : 'hover:text-gray-300'
            }`}
          >
            <span>Problems</span>
            <span className={`text-[10px] min-w-[14px] h-3.5 rounded-full flex items-center justify-center text-white scale-90 ${
              jsonParseError ? 'bg-rose-500 font-bold' : 'bg-gray-700 opacity-60'
            }`}>
              {jsonParseError ? '1' : '0'}
            </span>
            {activePaneTab === 'problems' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#007acc]" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('output')}
            className={`py-2 px-1 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePaneTab === 'output' ? 'text-white font-bold' : 'hover:text-gray-300'
            }`}
          >
            <span>Output</span>
            {activePaneTab === 'output' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#007acc]" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('debug')}
            className={`py-2 px-1 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePaneTab === 'debug' ? 'text-white font-bold' : 'hover:text-gray-300'
            }`}
          >
            <span>Debug Console</span>
            {activePaneTab === 'debug' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#007acc]" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('terminal')}
            className={`py-2 px-1 relative transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePaneTab === 'terminal' ? 'text-white font-bold' : 'hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </div>
            {activePaneTab === 'terminal' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#007acc]" />
            )}
          </button>
        </div>

        {/* Console state detail flags with Collapsible Actions */}
        <div className="flex gap-4 items-center text-[11px] text-gray-500 font-mono">
          <span className="hidden sm:inline">bash (80x24)</span>
          <span className="hidden sm:inline flex items-center gap-1 text-emerald-500 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>DevServer: 3000</span>
          </span>
          
          <div className="flex items-center gap-1.5 border-l border-[#2d3139] pl-3 ml-1 text-gray-500">
            {/* Height presets toggle */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setTerminalHeight(prev => prev === 'short' ? 'normal' : prev === 'normal' ? 'tall' : 'short')}
                className="hover:text-white p-0.5 rounded cursor-pointer flex items-center gap-1 text-[10px] uppercase font-sans font-bold bg-[#1c1f24] hover:bg-[#20252c] border border-[#2d3139] px-1.5 transition-colors"
                title="Toggle Height (Short/Normal/Large)"
              >
                Size: {terminalHeight}
              </button>
            )}
            
            {/* Minimizer action */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:text-white p-1 rounded cursor-pointer transition-colors"
              title={isCollapsed ? "Expand Terminal Window" : "Collapse Terminal Window"}
            >
              {isCollapsed ? (
                <ChevronUp className="w-4 h-4 text-[#007acc] font-bold" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pane Content Window */}
      <div className={`${isCollapsed ? 'hidden' : 'flex-1'} overflow-y-auto p-4 font-mono text-[11px] md:text-xs`}>
        
        {/* TAB: PROBLEMS */}
        {activePaneTab === 'problems' && (
          <div className="space-y-2">
            {jsonParseError ? (
              <div className="flex items-start gap-2.5 text-rose-400 bg-rose-950/10 p-3 rounded border border-rose-950/40">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">JSON Syntax Error: compilation halted</div>
                  <p className="text-[11px] text-rose-300 font-sans">{jsonParseError}</p>
                  <button 
                    onClick={() => onSelectTab('about.tsx')}
                    className="text-xs text-sky-400 font-bold hover:underline font-mono block pt-1 cursor-pointer"
                  >
                    Go fix about_me.json formatting
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#858585] py-4 text-center justify-center font-sans">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                <span>Zero system compile errors or formatting warnings detected in workspace.</span>
              </div>
            )}
          </div>
        )}

        {/* TAB: OUTPUT */}
        {activePaneTab === 'output' && (
          <div className="text-[#a5a5a5] space-y-1">
            <div className="text-gray-500 font-bold">[11:15:02 AM] [Vite] Server started on http://localhost:3000</div>
            <div>[11:15:03 AM] [HMR] Hot module replacement connected in silent production sandbox</div>
            <div>[11:15:04 AM] [Tailwind] Core style registry mounted (index.css loaded)</div>
            <div>[11:16:11 AM] [Analytics] Recruiter contact logs established</div>
            <div>[11:17:21 AM] Ready for user customization input. Active folder: PORTFOLIO-RF</div>
            {messages.length > 0 && (
              <div className="text-amber-500 font-medium">✓ [Mailbox] Received {messages.length} secure incoming contact payload notifications.</div>
            )}
          </div>
        )}

        {/* TAB: DEBUG CONSOLE */}
        {activePaneTab === 'debug' && (
          <div className="text-[#858585] space-y-3 font-sans">
            <div className="font-mono text-xs text-gray-500">Filter debug logs...</div>
            <div className="bg-[#1a1e24] p-3 rounded border border-[#2d3139]/40 space-y-1.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <strong className="text-white">Debug Session Open</strong>
              </div>
              <p className="text-gray-400 text-xs">
                Run client side runtime inspections or monitor sandbox triggers.
              </p>
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => {
                    const confirmLog = confirm("Launch diagnostic profile dump?");
                    if (confirmLog) {
                      alert("Diagnosis: Profile 'Rai Farhan' compiles successfully with zero dangling stack issues. Dev server healthy!");
                    }
                  }}
                  className="bg-[#2d3139] hover:bg-[#373d49] text-gray-200 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
                >
                  Run Diagnostics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TERMINAL */}
        {activePaneTab === 'terminal' && (
          <div className="flex flex-col min-h-full justify-between select-text selection:bg-[#264f78]">
            <div className="space-y-1 pb-4 leading-relaxed">
              <div className="text-gray-500">Microsoft Windows [Version 10.0.22631]</div>
              <div className="text-gray-500">Ported container shell environment securely mapped to workspace volume.</div>
              <div className="text-sky-400 font-bold py-1">Type "help" to list diagnostic command hooks.</div>
              <br/>

              {terminalLogs.map((log) => {
                let colorClass = 'text-gray-300';
                if (log.type === 'command') colorClass = 'text-sky-400 font-bold';
                else if (log.type === 'success') colorClass = 'text-emerald-400';
                else if (log.type === 'error') colorClass = 'text-rose-400';
                
                return (
                  <div key={log.id} className={`${colorClass} whitespace-pre-wrap`}>
                    {log.text}
                  </div>
                );
              })}
              
              {loadingBuild && (
                <div className="text-yellow-400 animate-pulse">
                  ⠋ Loading compiler dependencies... bundling codebases...
                </div>
              )}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 mt-auto border-t border-[#2d3139]/30 pt-2 shrink-0">
              <span className="text-emerald-500 shrink-0">➜</span>
              <span className="text-[#a0a0a0] shrink-0 font-medium font-sans text-xs">portfolio-workspace @ ~</span>
              <span className="text-sky-400 shrink-0 font-bold">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help' and press Enter..."
                className="flex-1 bg-transparent border-none text-[#cccccc] focus:ring-0 focus:outline-none p-0 text-xs font-mono placeholder:text-gray-700 m-0"
              />
            </form>
            <div ref={terminalEndRef} />
          </div>
        )}

      </div>
    </div>
  );
}
