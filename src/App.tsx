import React, { useState, useEffect } from 'react';
import { GitBranch, RefreshCw, Bell, FileText, CheckCircle2 } from 'lucide-react';
import TitleBar from './components/TitleBar';
import ActivityBar, { SidebarPanel } from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import TerminalPane from './components/TerminalPane';

import { DeveloperProfile, Project, Experience, SkillCategory, TerminalOutput } from './types';
import { defaultProfile, defaultProjects, defaultExperiences, defaultSkills, tabFiles } from './data/defaultData';

export default function App() {
  
  // Sidebar toggles
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<SidebarPanel>('explorer');

  // Multi-tab file tracking
  const [activeTab, setActiveTab] = useState<string>('index.tsx');
  const [openTabs, setOpenTabs] = useState<string[]>([
    'index.tsx', 'about.tsx', 'projects.tsx', 'package.json', 'git-history.log', 'contact.css'
  ]);

  // Main portfolio states
  const [profile, setProfile] = useState<DeveloperProfile>(defaultProfile);
  const [projects] = useState<Project[]>(defaultProjects);
  const [experiences] = useState<Experience[]>(defaultExperiences);
  const [skills] = useState<SkillCategory[]>(defaultSkills);

  // Search functionality within key values
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ fileId: string; fileName: string; snippet: string }>>([]);

  // Diff tracking for files
  const [modifiedFiles, setModifiedFiles] = useState<string[]>([]);

  // Raw editable code representations
  const [aboutRawText, setAboutRawText] = useState<string>(
    JSON.stringify(defaultProfile, null, 2)
  );
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);

  // Recruiter Contact mailbox messages (starts with 1 cozy greeting!)
  const [messages, setMessages] = useState<Array<{ id: string; name: string; email: string; message: string; timestamp: string }>>([
    {
      id: 'msg-seed-1',
      name: 'James Carter (AI Director at TechScale)',
      email: 'jcarter@techscale.ai',
      message: 'Hello Rai! Checked your CCTV Anomaly Detection Web Application component codebase on GitHub. We think your YOLOv8 model optimization and Socket.IO real-time alerts integration is top tier, and we would love to start chat processes tomorrow regarding our open AI Engineer placement.',
      timestamp: 'Today, 9:20 AM'
    }
  ]);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(true);

  // Simulated Terminal prompt outputs
  const [terminalLogs, setTerminalLogs] = useState<TerminalOutput[]>([
    {
      id: 'log-1',
      text: 'Initializing workspace environment terminal...',
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'log-2',
      text: '✓ System Node v22.14.0 container mapping healthy.',
      type: 'success',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'log-3',
      text: '✓ Dev Server mounted securely inside port 3000 volume.',
      type: 'success',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'log-4',
      text: 'Welcome to the Rai Farhan Sandbox! Type "help" to command the portfolio shell.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // Sync isModified status
  const isModified = modifiedFiles.length > 0;

  // React to tab switching internally or globally
  const handleSelectTab = (tabId: string) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs([...openTabs, tabId]);
    }
    setActiveTab(tabId);
  };

  // Run dynamic queries inside properties of the mock data on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: Array<{ fileId: string; fileName: string; snippet: string }> = [];

    // Search in index.tsx
    if (profile.name.toLowerCase().includes(query) || profile.role.toLowerCase().includes(query) || profile.location.toLowerCase().includes(query)) {
      results.push({
        fileId: 'index.tsx',
        fileName: 'index.tsx',
        snippet: `const Sarah = { name: "${profile.name}", role: "${profile.role}" }`
      });
    }

    // Search in about_me.json
    if (profile.bio.toLowerCase().includes(query) || profile.mission.toLowerCase().includes(query) || profile.coreValues.some(v => v.toLowerCase().includes(query))) {
      results.push({
        fileId: 'about.tsx',
        fileName: 'about_me.config.json',
        snippet: `mission: "${profile.mission}", core_values: "${profile.coreValues.join(', ')}"`
      });
    }

    // Search in projects.tsx
    projects.forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tools.some(t => t.toLowerCase().includes(query))) {
        results.push({
          fileId: 'projects.tsx',
          fileName: 'projects.tsx',
          snippet: `title: "${p.title}", tools: [${p.tools.join(', ')}]`
        });
      }
    });

    // Search in package.json
    skills.forEach(c => {
      if (c.category.toLowerCase().includes(query) || c.skills.some(sk => sk.toLowerCase().includes(query))) {
        results.push({
          fileId: 'package.json',
          fileName: 'package.json',
          snippet: `"${c.category}": "${c.skills.slice(0, 3).join(', ')}..."`
        });
      }
    });

    setSearchResults(results);
  }, [searchQuery, profile, projects, skills]);

  // Handle addition of modified file to git tracking
  useEffect(() => {
    const isProfileModified = JSON.stringify(profile) !== JSON.stringify(defaultProfile);
    if (isProfileModified) {
      setModifiedFiles(prev => {
        if (!prev.includes('about.tsx')) {
          return [...prev, 'about.tsx'];
        }
        return prev;
      });
    } else {
      setModifiedFiles(prev => {
        if (prev.includes('about.tsx')) {
          return prev.filter(f => f !== 'about.tsx');
        }
        return prev;
      });
    }
  }, [profile]);

  // Inbound proposer contact submissions
  const handleProposalSubmit = (name: string, email: string, msg: string) => {
    const newMsg = {
      id: Math.random().toString(),
      name,
      email,
      message: msg,
      timestamp: 'Just Now'
    };
    setMessages(prev => [newMsg, ...prev]);
    setHasNewMessageAlert(true);

    // Append a log to output and terminal
    setTerminalLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        text: `✓ [Incoming Connection Server] Recruiter "${name}" successfully transmitted proposed messages! Added to workspace Inbox storage.`,
        type: 'success',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Source Control commits
  const handleGitCommit = () => {
    // Stage and build
    setTerminalLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        text: '➜  ~ git add . && git commit -m "update: developer profile settings" && git push origin main',
        type: 'command',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Math.random().toString(),
        text: `✓ [Staging] Added ${modifiedFiles.length} files to git commit stage pipeline.`,
        type: 'success',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Math.random().toString(),
        text: '✓ Successfully committed and pushed to secondary branch github:raifarhan/portfolio-v2:main.',
        type: 'success',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setModifiedFiles([]);
  };

  const handleDiscardGitChanges = () => {
    setProfile(defaultProfile);
    setAboutRawText(JSON.stringify(defaultProfile, null, 2));
    setJsonParseError(null);
    setModifiedFiles([]);

    setTerminalLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        text: '➜  ~ git checkout -- . && git clean -fd',
        type: 'command',
        timestamp: new Date().toLocaleTimeString()
      },
      {
        id: Math.random().toString(),
        text: '✓ Cleaned local edits. Reverted workspace to original release state configurations.',
        type: 'info',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1f1f1f] overflow-hidden">
      
      {/* 1. Window top Titlebar */}
      <TitleBar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTab={activeTab} 
      />

      {/* 2. Central Layout (ActivityBar + Expanded Sidebar + Code editor window + Bottom Terminal) */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Far Left Activity Nav rail */}
        <ActivityBar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          gitBadgeCount={modifiedFiles.length}
          messageBadgeCount={messages.length}
        />

        {/* Collapsible File system Explorer / Search pane rail */}
        {sidebarOpen && (
          <Sidebar
            activePanel={activePanel}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            openTabs={openTabs}
            tabFiles={tabFiles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            isModified={isModified}
            modifiedFiles={modifiedFiles}
            onCommit={handleGitCommit}
            onDiscardChanges={handleDiscardGitChanges}
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            skillsList={skills}
          />
        )}

        {/* main coding workbench body */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          
          {/* Main Visual tab view & configuration coding field */}
          <EditorArea
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openTabs={openTabs}
            setOpenTabs={setOpenTabs}
            tabFiles={tabFiles}
            profile={profile}
            setProfile={setProfile}
            projects={projects}
            experiences={experiences}
            skills={skills}
            onSubmitProposal={handleProposalSubmit}
            aboutRawText={aboutRawText}
            setAboutRawText={setAboutRawText}
            jsonParseError={jsonParseError}
            setJsonParseError={setJsonParseError}
            onSelectTab={handleSelectTab}
          />

          {/* Bottom terminal, problems console */}
          <TerminalPane
            messages={messages}
            modifiedFiles={modifiedFiles}
            isModified={isModified}
            onPostCommand={(cmd) => {}}
            terminalLogs={terminalLogs}
            setTerminalLogs={setTerminalLogs}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            jsonParseError={jsonParseError}
          />

        </div>
      </div>

      {/* 3. Bottom blue Status Bar */}
      <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] select-none shrink-0 z-30 font-sans">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActivePanel('git')}
            className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="font-semibold">main*</span>
          </button>
          
          <div className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">
            <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
            <span>0 errors, 0 warnings</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span>Ln 14, Col 28</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          
          <button 
            onClick={() => setActiveTab('index.tsx')}
            className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            TypeScript JSX
          </button>
          
          <button 
            onClick={() => {
              setActivePanel('contacts');
              setSidebarOpen(true);
              setHasNewMessageAlert(false);
            }}
            className="relative p-1 hover:bg-white/10 rounded cursor-pointer transition-colors shrink-0"
            title="Notifications Inbox"
          >
            <Bell className="w-3.5 h-3.5" />
            {hasNewMessageAlert && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
            )}
          </button>
        </div>
      </footer>

    </div>
  );
}
