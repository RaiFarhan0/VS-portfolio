import React, { useState } from 'react';
import { X, Code, Eye, Terminal, Mail, Github, Linkedin, Twitter, ArrowRight, CheckCircle2, ChevronRight, Download, Server, Play, ExternalLink } from 'lucide-react';
import { TabFile, DeveloperProfile, Project, Experience, SkillCategory } from '../types';

interface EditorAreaProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  openTabs: string[];
  setOpenTabs: (tabs: string[]) => void;
  tabFiles: TabFile[];
  
  // Custom states that keep track of changes
  profile: DeveloperProfile;
  setProfile: React.Dispatch<React.SetStateAction<DeveloperProfile>>;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  
  // Contact Submissions
  onSubmitProposal: (name: string, email: string, msg: string) => void;
  
  // Code Raw texts
  aboutRawText: string;
  setAboutRawText: (text: string) => void;
  jsonParseError: string | null;
  setJsonParseError: (err: string | null) => void;
  
  // Theme styling helpers
  onSelectTab: (tabId: string) => void;
}

export default function EditorArea({
  activeTab,
  setActiveTab,
  openTabs,
  setOpenTabs,
  tabFiles,
  profile,
  setProfile,
  projects,
  experiences,
  skills,
  onSubmitProposal,
  aboutRawText,
  setAboutRawText,
  jsonParseError,
  setJsonParseError,
  onSelectTab
}: EditorAreaProps) {
  
  // Choose to view Preview vs Code representation inside the editor
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  
  // Contact Form Internal states
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Active project category filters
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('All');

  const activeFile = tabFiles.find(f => f.id === activeTab) || tabFiles[0];

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tid => tid !== id);
    setOpenTabs(newTabs);
    
    // Choose active tab
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactName.trim() || !contactMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      onSubmitProposal(contactName, contactEmail, contactMessage);
      setIsSending(false);
      setSendSuccess(true);
      setContactMessage('');
      
      // reset success message after showing
      setTimeout(() => {
        setSendSuccess(false);
      }, 5000);
    }, 1200);
  };

  const handleJSONCodeChange = (text: string) => {
    setAboutRawText(text);
    try {
      const parsed = JSON.parse(text);
      if (parsed.name && parsed.role) {
        setProfile(parsed);
        setJsonParseError(null);
      } else {
        setJsonParseError('Missing required config fields "name" or "role".');
      }
    } catch (err: any) {
      setJsonParseError(err.message || 'JSON parse syntax error');
    }
  };

  // Extract unique tools for filters
  const allTools = ['All', ...Array.from(new Set(projects.flatMap(p => p.tools)))];

  const filteredProjects = selectedToolFilter === 'All' 
    ? projects 
    : projects.filter(p => p.tools.includes(selectedToolFilter));


  const handleScrollOrTabSelect = (sectionId: string, fallbackTab: string) => {
    if (activeTab === 'index.tsx' && viewMode === 'preview') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    onSelectTab(fallbackTab);
  };

  const getBreadcrumbPath = () => {
    switch (activeTab) {
      case 'index.tsx': return 'src › components › Portfolio › index.tsx';
      case 'about.tsx': return 'src › data › about_me.json';
      case 'projects.tsx': return 'src › components › Portfolio › projects.tsx';
      case 'package.json': return 'package.json';
      case 'git-history.log': return 'git-history.log';
      case 'contact.css': return 'src › styles › contact.css';
      default: return 'src › index.tsx';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#1f1f1f] select-text">
      
      {/* Tab bar header */}
      <div className="h-9 flex bg-[#161a1f] overflow-x-auto text-[13px] shrink-0 border-b border-[#2d3139]/30 scrollbar-none items-center">
        {tabFiles.filter(f => openTabs.includes(f.id)).map(file => {
          const isActive = activeTab === file.id;
          return (
            <button
              key={`tab-bar-${file.id}`}
              onClick={() => setActiveTab(file.id)}
              className={`px-3 py-2 flex items-center gap-2 border-r border-[#2d3139]/30 cursor-pointer min-w-[124px] max-w-[200px] select-none group focus:outline-none transition-colors text-ellipsis ${
                isActive 
                  ? 'bg-[#1f1f1f] text-white border-t-[2px] border-t-[#007acc] font-medium' 
                  : 'bg-[#161a1f] text-gray-500 hover:bg-[#1d2127] hover:text-gray-300'
              }`}
            >
              <span className={`text-[10px] uppercase font-bold shrink-0 ${
                isActive ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {file.iconType === 'tsx' ? 'TSX' : file.iconType}
              </span>
              <span className="truncate text-xs">{file.name}</span>
              <X 
                className="w-3.5 h-3.5 ml-auto rounded hover:bg-[#2d3139] p-0.5 opacity-40 group-hover:opacity-100 transition-opacity" 
                onClick={(e) => handleCloseTab(file.id, e)}
              />
            </button>
          );
        })}
      </div>

      {/* Breadcrumbs & Preview-Code Toggle */}
      <div className="h-7 px-4 bg-[#1f1f1f] flex items-center justify-between border-b border-[#2c313a]/30 shrink-0 select-none text-[11px] text-gray-500 font-mono">
        <div className="flex items-center gap-1">
          <span>workspace</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-400 font-sans">{getBreadcrumbPath()}</span>
        </div>

        {/* Preview toggle mode buttons (only for files where it makes sense, e.g. index/about/projects) */}
        {(activeTab === 'index.tsx' || activeTab === 'about.tsx' || activeTab === 'projects.tsx' || activeTab === 'package.json') && (
          <div className="flex bg-[#111417] p-0.5 rounded border border-[#2d3139]/50 overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer font-sans font-medium text-[10px] ${
                viewMode === 'preview' 
                  ? 'bg-[#007acc] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Interactive UI</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer font-sans font-medium text-[10px] ${
                viewMode === 'code' 
                  ? 'bg-[#007acc] text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-3 text-xs" />
              <span>Raw Code View</span>
            </button>
          </div>
        )}
      </div>

      {/* Main text area scroll viewport */}
      <div className="flex-1 overflow-y-auto ide-scroll p-6 md:p-8 relative bg-[#1f1f1f]">
        
        {/* ===================== VIEW METHOD IMPLEMENTATIONS ===================== */}

        {/* 1. FILE: index.tsx (Introduction & Hero screen mockup card) */}
        {activeTab === 'index.tsx' && (
          <div>
            {viewMode === 'preview' ? (
              <div className="max-w-3xl space-y-12 animate-fade-in pb-16">
                <div className="text-gray-500 font-mono text-xs">// config/developer_profile.ts</div>
                <div>
                  <span className="text-violet-400">const</span> <span className="text-sky-400">RaiFarhan</span> = {'{'}
                  
                  <div className="pl-6 border-l border-[#2d3139] ml-1.5 my-2 space-y-1 text-xs">
                    <div><span className="text-[#9cdcfe]">Role</span>: <span className="text-[#ce9178]">"{profile.role}"</span>,</div>
                    <div><span className="text-[#9cdcfe]">Location</span>: <span className="text-[#ce9178]">"{profile.location}"</span>,</div>
                    <div><span className="text-[#9cdcfe]">Current_Status</span>: <span className="text-[#e2c08d]">"{profile.status}"</span>,</div>
                  </div>
                  {'};'}
                </div>

                {/* 1. Hero / Introduction Card */}
                <div id="portfolio-hero-section" className="bg-[#181c20] rounded-xl border border-[#2d3139] p-6 md:p-8 shadow-xl mt-6 space-y-6 scroll-mt-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#2d3139]/40">
                    <div className="space-y-1">
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                        Hello, I'm <span className="text-[#007acc] block sm:inline">{profile.name}</span>.
                      </h1>
                      <p className="text-base font-medium text-gray-400 font-sans">
                        {profile.role} based in {profile.location}
                      </p>
                    </div>
                    {/* Badge */}
                    <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {profile.status}
                    </span>
                  </div>

                  <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button 
                      onClick={() => handleScrollOrTabSelect('portfolio-projects-section', 'projects.tsx')}
                      className="bg-[#007acc] hover:bg-[#0063a5] text-white px-6 py-2.5 rounded font-sans text-xs font-semibold shadow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Explore Projects</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleScrollOrTabSelect('portfolio-contact-section', 'contact.css')}
                      className="border border-[#2d3139] hover:bg-[#20252c] text-gray-300 px-6 py-2.5 rounded font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-[#007acc]" />
                      <span>Hire Work Proposals</span>
                    </button>
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="border border-[#2d3139] hover:bg-[#20252c] text-gray-300 px-6 py-2.5 rounded font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download Resume CV</span>
                    </a>
                  </div>

                  {/* Icon Social footer */}
                  <div className="flex gap-4 pt-4 border-t border-[#2d3139]/30 text-gray-400">
                    <a 
                      href={profile.socials.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-white transition-colors"
                      title="GitHub Workspace"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href={profile.socials.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-sky-400 transition-colors"
                      title="LinkedIn Connections"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={profile.socials.twitter} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-blue-400 transition-colors"
                      title="Twitter / X"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Accent Decorative Separator */}
                <div className="py-2 flex items-center justify-between text-gray-500 font-mono text-[10px] select-none">
                  <span>// ABOUT & MISSION MODULE</span>
                  <div className="flex-1 h-[1px] bg-[#2d3139]/40 mx-4" />
                  <span>SCROLL DEEPER</span>
                </div>

                {/* 2. About / Values Section */}
                <div id="portfolio-about-section" className="bg-[#181c20] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-6 shadow-xl scroll-mt-6">
                  <div className="pb-4 border-b border-[#2d3139]/40 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white font-sans">Profile Values & Mission</h2>
                      <p className="text-xs text-gray-500 font-sans">Rendered view of active JSON state configuration</p>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-sans font-bold text-[#007acc] bg-[#007acc]/10 border border-[#007acc]/25 rounded">
                      Config Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block font-sans">Our Mission</span>
                      <p className="text-[#cccccc] font-sans text-base leading-relaxed italic border-l-2 border-[#007acc] pl-4">
                        "{profile.mission}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block font-sans">Core Programming Tenures</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {profile.coreValues.map((val, i) => (
                          <div 
                            key={`index-core-val-${i}`}
                            className="bg-[#121417] p-3 rounded-lg border border-[#2d3139]/60 text-center font-sans hover:border-[#007acc] transition-colors"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#007acc]/10 text-[#007acc] font-bold text-xs inline-flex items-center justify-center mb-1">
                              {i + 1}
                            </span>
                            <div className="text-white text-xs font-semibold">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accent Decorative Separator */}
                <div className="py-2 flex items-center justify-between text-gray-500 font-mono text-[10px] select-none">
                  <span>// ENGINE ARTIFACTS INTERACTIVE MODULE</span>
                  <div className="flex-1 h-[1px] bg-[#2d3139]/40 mx-4" />
                  <span>FILTER ENGINE ACCESSIBLE</span>
                </div>

                {/* 3. Engineered Artifacts & Filter Panel */}
                <div id="portfolio-projects-section" className="space-y-6 scroll-mt-6">
                  {/* Visual Filter Option */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2d3139]/30">
                    <div className="space-y-0.5">
                      <h2 className="text-xl font-bold text-white font-sans">Engineered Artifacts</h2>
                      <p className="text-xs text-gray-500 font-sans">Filter through custom builds built by the client</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-1.5 bg-[#111417] p-1 rounded-lg border border-[#2d3139]/40">
                      {allTools.map(tool => (
                        <button
                          key={`index-filter-pill-${tool}`}
                          onClick={() => setSelectedToolFilter(tool)}
                          className={`px-2.5 py-1 text-xs rounded-md font-sans transition-colors cursor-pointer font-bold ${
                            selectedToolFilter === tool 
                              ? 'bg-[#007acc] text-white' 
                              : 'text-[#858585] hover:text-white hover:bg-[#1f232a]'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cards list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {filteredProjects.map((project, idx) => (
                      <div 
                        key={`index-proj-card-${project.id}`}
                        className="bg-[#181c20] border border-[#2d3139] hover:border-[#007acc] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group relative"
                      >
                        <span className="absolute top-4 left-4 text-[#858585]/15 font-mono text-3xl font-extrabold group-hover:scale-110 transition-transform">
                          0{idx + 1}
                        </span>
                        
                        <div className="h-40 bg-[#111417] overflow-hidden relative border-b border-[#2d3139]/40 shrink-0">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity filter grayscale group-hover:grayscale-0 duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181c20] via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-[#ce9178] hover:text-orange-300 text-base font-bold font-sans cursor-pointer">
                              "{project.title}"
                            </h3>
                            <p className="text-gray-400 font-sans text-xs leading-relaxed min-h-[50px]">
                              {project.description}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3">
                            <div className="flex flex-wrap gap-1">
                              {project.tools.map((tag) => (
                                <span 
                                  key={`index-tag-${project.id}-${tag}`}
                                  className="bg-[#111417] text-[#9cdcfe] text-[10px] font-bold px-2 py-0.5 rounded border border-[#2d3139]/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-4 pt-3 border-t border-[#2d3139]/30 text-xs font-bold font-sans">
                              {project.githubUrl && (
                                <a 
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  <span>Repo</span>
                                </a>
                              )}
                              {project.demoUrl && (
                                <a 
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 ml-auto"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Demo</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500 font-sans space-y-2">
                      <p>No projects matched target filter "{selectedToolFilter}".</p>
                      <button 
                        onClick={() => setSelectedToolFilter('All')}
                        className="text-sky-400 hover:underline font-bold text-xs"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Accent Decorative Separator */}
                <div className="py-2 flex items-center justify-between text-gray-500 font-mono text-[10px] select-none">
                  <span>// DEPENDENCY COMPETENCIES SKILL MANIFEST</span>
                  <div className="flex-1 h-[1px] bg-[#2d3139]/40 mx-4" />
                  <span>COMPILE VERIFIED</span>
                </div>

                {/* 4. Engineering Skills Manifest */}
                <div id="portfolio-skills-section" className="bg-[#181c20] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-6 shadow-xl scroll-mt-6">
                  <div className="pb-4 border-b border-[#2d3139]/40">
                    <h2 className="text-xl font-bold text-white font-sans">Engineering Skills Manifest</h2>
                    <p className="text-xs text-gray-500 font-sans">A comprehensive view of active skillset dependencies</p>
                  </div>

                  <div className="space-y-6">
                    {skills.map((category) => (
                      <div key={`index-skill-cat-${category.category}`} className="space-y-2">
                        <span className="text-[11px] font-bold text-[#e2c08d] uppercase tracking-wider block font-mono">
                          "{category.category}"
                        </span>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {category.skills.map((skill) => (
                            <div 
                              key={`index-skill-item-${skill}`}
                              className="bg-[#111417] px-3 py-1.5 rounded border border-[#2d3139]/50 flex items-center gap-2 font-mono text-xs text-gray-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Decorative Separator */}
                <div className="py-2 flex items-center justify-between text-gray-500 font-mono text-[10px] select-none">
                  <span>// COMMIT HISTORY TIMELINE EXPERIENCE LOGS</span>
                  <div className="flex-1 h-[1px] bg-[#2d3139]/40 mx-4" />
                  <span>GET COMMIT LOGS</span>
                </div>

                {/* 5. Professional Timeline Log Section */}
                <div id="portfolio-experience-section" className="space-y-6 scroll-mt-6">
                  <div className="pb-2 border-b border-[#2d3139]/30">
                    <h2 className="text-xl font-bold text-white font-sans">Professional Work Timeline</h2>
                    <p className="text-xs text-gray-500 font-sans">Commit ledger representing experience, projects & milestones</p>
                  </div>

                  <div className="pl-4 relative border-l border-[#2d3139] space-y-8 my-6">
                    {experiences.map((exp, idx) => (
                      <div key={`index-experience-${exp.id}`} className="relative group pl-6">
                        <div className={`absolute -left-[22.5px] top-1 w-3 h-3 rounded-full border-2 border-[#1f1f1f] group-hover:scale-125 transition-transform ${
                          idx === 0 ? 'bg-[#007acc]' : 'bg-gray-500'
                        }`} />

                        <div className="bg-[#181c20] p-5 rounded-lg border border-[#2d3139] space-y-3 shadow group-hover:border-[#007acc]/60 transition-colors">
                          <div className="flex flex-wrap items-baseline gap-2 pb-2 border-b border-[#2d3139]/40">
                            <span className="text-[#e2c08d] font-bold text-xs font-mono">
                              commit {exp.commitHash}
                            </span>
                            {idx === 0 && (
                              <span className="text-[9px] bg-sky-500/10 text-[#007acc] border border-[#007acc]/20 px-1.5 py-0.2 rounded font-bold font-mono">
                                HEAD-&gt;main
                              </span>
                            )}
                            <h3 className="text-white font-sans font-bold text-sm">
                              {exp.role} @ <span className="text-sky-400">{exp.company}</span>
                            </h3>
                            <span className="text-gray-500 text-[11px] font-sans bg-[#111417] px-2 py-0.5 rounded ml-auto">
                              {exp.period}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-gray-300 leading-relaxed font-sans">
                            {exp.bullets.map((bullet, bIdx) => (
                              <div key={`index-bullet-${exp.id}-${bIdx}`} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 font-mono font-bold mt-0.5">+</span>
                                <p>{bullet}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Decorative Separator */}
                <div className="py-2 flex items-center justify-between text-gray-500 font-mono text-[10px] select-none">
                  <span>// ESTABLISH CONNECTION HANDSHAKE PAYLOAD</span>
                  <div className="flex-1 h-[1px] bg-[#2d3139]/40 mx-4" />
                  <span>INIT CONNECTION</span>
                </div>

                {/* 6. Recruitment Contact Terminal Shell */}
                <div id="portfolio-contact-section" className="space-y-6 scroll-mt-6">
                  <div className="pb-2 border-b border-[#2d3139]/30">
                    <h2 className="text-xl font-bold text-white font-sans">Console Handshake Request</h2>
                    <p className="text-xs text-gray-400 font-sans">Send secure work proposals directly into system memory buffer</p>
                  </div>

                  <div className="bg-[#111417] border border-[#2d3139] rounded-lg shadow-2xl overflow-hidden relative">
                    <div className="bg-[#161a1f] px-4 py-2.5 flex items-center justify-between border-b border-[#2d3139]/40 select-none">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-gray-500 font-mono text-[11px]">proposal_payload.sh — bash shell (3000)</span>
                      <span className="w-4" />
                    </div>

                    <div className="p-6 md:p-8 font-mono text-xs space-y-6">
                      <div>
                        <span className="text-emerald-500">➜</span> <span className="text-sky-400">~/contact-buffer</span> <span className="text-gray-300 font-bold">git checkout -b recruit</span>
                      </div>

                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-gray-500 text-[10px] font-bold uppercase">$ sender_name</label>
                            <input 
                              type="text"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Your Name"
                              required
                              className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-gray-500 text-[10px] font-bold uppercase">$ sender_email</label>
                            <input 
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="name@company.com"
                              required
                              className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-gray-500 text-[10px] font-bold uppercase">$ proposal_payload_body</label>
                          <textarea 
                            rows={4}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Type secure contact message payload here..."
                            required
                            className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono resize-none leading-relaxed"
                          />
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <button
                            type="submit"
                            disabled={isSending}
                            className="bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-400 px-6 py-2 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                          >
                            <span>{isSending ? '>>> PIPING PAYLOAD...' : '>>> EXECUTE BIND'}</span>
                            <span className="typing-cursor" />
                          </button>

                          {sendSuccess && (
                            <div className="text-emerald-400 text-[11px] font-bold font-mono animate-pulse flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>Transmission succeeded: bound to console.</span>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl font-mono text-xs md:text-sm text-gray-300 space-y-4">
                <div className="text-gray-500 font-mono">// Raw Code representation of index.tsx components</div>
                <div className="bg-[#121417] p-5 rounded border border-[#2d3139]/40 overflow-x-auto leading-relaxed whitespace-pre font-mono">
                  <span className="text-[#c586c0]">import</span>{' '}
                  <span className="text-[#9cdcfe]">React</span>{' '}
                  <span className="text-[#c586c0]">from</span>{' '}
                  <span className="text-[#ce9178]">"react"</span>;<br />
                  <span className="text-[#c586c0]">import</span>{' '}{'{'}{' '}
                  <span className="text-[#9cdcfe]">Github, Linkedin, Mail</span>{' '}{'}'}{' '}
                  <span className="text-[#c586c0]">from</span>{' '}
                  <span className="text-[#ce9178]">"lucide-react"</span>;<br />
                  <br />
                  <span className="text-[#c586c0]">export default</span>{' '}
                  <span className="text-[#569cd6]">function</span>{' '}
                  <span className="text-[#dcdcaa]">IntroductionCard</span>() {'{'}<br />
                  <span className="text-[#c586c0]">  return</span> (<br />
                  <span className="text-[#569cd6]">    &lt;div</span>{' '}
                  <span className="text-[#9cdcfe]">className</span>=
                  <span className="text-[#ce9178]">"bg-[#181c20] p-6 rounded shadow"</span>
                  <span className="text-[#569cd6]">&gt;</span><br />
                  <span className="text-[#569cd6]">      &lt;h1</span>{' '}
                  <span className="text-[#9cdcfe]">className</span>=
                  <span className="text-[#ce9178]">"text-3xl font-bold"</span>
                  <span className="text-[#569cd6]">&gt;</span>
                  Hello, I'm {profile.name}
                  <span className="text-[#569cd6]">&lt;/h1&gt;</span><br />
                  <span className="text-[#569cd6]">      &lt;p</span>
                  <span className="text-[#569cd6]">&gt;</span>
                  {profile.bio}
                  <span className="text-[#569cd6]">&lt;/p&gt;</span><br />
                  <span className="text-[#569cd6]">    &lt;/div&gt;</span><br />
                  {'  );'}<br />
                  {'}'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. FILE: about.tsx (about_me.json with real editable state!) */}
        {activeTab === 'about.tsx' && (
          <div className="space-y-6">
            <div className="text-gray-500 font-mono text-xs">// data/about_me.config.json</div>

            {viewMode === 'preview' ? (
              <div className="max-w-3xl space-y-6">
                
                {/* Visual Representation Card */}
                <div className="bg-[#181c20] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div className="pb-4 border-b border-[#2d3139]/40 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white font-sans">Profile Values & Mission</h2>
                      <p className="text-xs text-gray-500 font-sans">Rendered view of updated configuration state parameters</p>
                    </div>
                    {/* Status badge */}
                    <span className="px-2 py-1 text-[11px] font-sans font-bold text-[#007acc] bg-[#007acc]/10 border border-[#007acc]/25 rounded">
                      Config Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block font-sans">Our Mission</span>
                      <p className="text-[#cccccc] font-sans text-base leading-relaxed italic border-l-2 border-[#007acc] pl-4">
                        "{profile.mission}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block font-sans">Core Programming Tenures</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {profile.coreValues.map((val, i) => (
                          <div 
                            key={`core-val-${i}`}
                            className="bg-[#121417] p-3 rounded-lg border border-[#2d3139]/60 text-center font-sans hover:border-[#007acc] transition-colors"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#007acc]/10 text-[#007acc] font-bold text-xs inline-flex items-center justify-center mb-1">
                              {i + 1}
                            </span>
                            <div className="text-white text-xs font-semibold">{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/5 p-4 rounded-lg border border-yellow-500/20 text-xs text-yellow-300 font-mono space-y-1 leading-relaxed">
                  <div className="font-bold flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                    <span>Hacker Mode Interactive Warning</span>
                  </div>
                  <p className="font-sans">
                    Toggle to <strong>Raw Code View</strong> to edit this configuration's live raw JSON properties. Any valid change instantly populates onto the index.tsx preview screen!
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase font-sans">JSON Code Editor input - about_me.json</span>
                  {jsonParseError ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1 font-sans">
                      ⚠️ Out of sync!
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                      ✓ Valid active parameters
                    </span>
                  )}
                </div>

                {/* Simulated text editor textarea container */}
                <div className="relative">
                  <textarea
                    value={aboutRawText}
                    onChange={(e) => handleJSONCodeChange(e.target.value)}
                    rows={16}
                    className="w-full bg-[#111417] text-[#ce9178] border border-[#2d3139] rounded-lg p-5 font-mono text-xs md:text-sm focus:ring-1 focus:ring-[#007acc] focus:outline-none focus:border-transparent selection:bg-[#264f78]"
                  />
                  {jsonParseError && (
                    <div className="absolute bottom-4 left-4 right-4 bg-rose-950 px-3 py-2 rounded text-xs text-rose-300 border border-rose-800 font-mono">
                      <strong>Syntax Error:</strong> {jsonParseError}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. FILE: projects.tsx (Projects component rendered visual cards list with filters) */}
        {activeTab === 'projects.tsx' && (
          <div className="space-y-6">
            <div className="text-gray-500 font-mono text-xs">// src/components/Portfolio/projects.tsx</div>

            {viewMode === 'preview' ? (
              <div className="max-w-4xl space-y-6">
                
                {/* Visual filter options */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2d3139]/30">
                  <div className="space-y-0.5">
                    <h2 className="text-xl font-bold text-white font-sans">Engineered Artifacts</h2>
                    <p className="text-xs text-gray-500 font-sans">Click categories to filter by technical execution tag</p>
                  </div>

                  {/* Filter pills */}
                  <div className="flex flex-wrap gap-1.5 bg-[#111417] p-1 rounded-lg border border-[#2d3139]/40">
                    {allTools.map(tool => (
                      <button
                        key={`filter-pill-${tool}`}
                        onClick={() => setSelectedToolFilter(tool)}
                        className={`px-3 py-1 text-xs rounded-md font-sans transition-colors cursor-pointer font-bold ${
                          selectedToolFilter === tool 
                            ? 'bg-[#007acc] text-white' 
                            : 'text-[#858585] hover:text-white hover:bg-[#1f232a]'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {filteredProjects.map((project, idx) => (
                    <div 
                      key={project.id}
                      className="bg-[#181c20] border border-[#2d3139] hover:border-[#007acc] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group relative"
                    >
                      {/* Code line count mockup decoration on hover */}
                      <span className="absolute top-4 left-4 text-[#858585]/20 font-mono text-3xl font-extrabold group-hover:scale-110 transition-transform">
                        0{idx + 1}
                      </span>
                      
                      {/* Thumbnail container */}
                      <div className="h-44 bg-[#111417] overflow-hidden relative border-b border-[#2d3139]/40 shrink-0">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity filter grayscale group-hover:grayscale-0 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181c20] via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Content panel */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-[#ce9178] hover:text-orange-300 text-lg font-bold tracking-tight font-sans cursor-pointer">
                            "{project.title}"
                          </h3>
                          <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed font-normal min-h-[64px]">
                            {project.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {project.tools.map((tag) => (
                              <span 
                                key={`tag-${tag}`}
                                className="bg-[#111417] text-[#9cdcfe] text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded border border-[#2d3139]/60 hover:border-gray-500 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action Hooks */}
                          <div className="flex gap-4 pt-4 border-t border-[#2d3139]/30 text-xs font-bold font-sans">
                            {project.githubUrl && (
                              <a 
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1"
                              >
                                <Github className="w-4 h-4" />
                                <span>Source Repo</span>
                              </a>
                            )}
                            {project.demoUrl && (
                              <a 
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 ml-auto"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12 text-gray-500 font-sans space-y-2">
                    <p>No projects matched the filtered selection key "{selectedToolFilter}".</p>
                    <button 
                      onClick={() => setSelectedToolFilter('All')}
                      className="text-sky-400 hover:underline font-bold text-xs focus:outline-none"
                    >
                      Clear tool filters
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="max-w-4xl font-mono text-xs text-gray-300 space-y-4">
                <div className="text-gray-500">// TypeScript React Code rendering loop for projects.tsx</div>
                <div className="bg-[#121417] p-5 rounded border border-[#2d3139]/40 overflow-x-auto leading-relaxed whitespace-pre font-mono">
                  <span className="text-[#9cdcfe]">const</span>{' '}
                  <span className="text-[#dcdcaa]">ProjectDetails</span> = [{'{\n'}
                  {'    title: "E-Commerce Analytics Dashboard",\n'}
                  {'    description: "A real-time dashboard featuring heatmaps..."\n'}
                  {'    tools: ["React", "TypeScript", "TailwindCSS"]\n'}
                  {'  }, {\n'}
                  {'    title: "Microservices Edge Gateway",\n'}
                  {'    tools: ["Go", "Docker", "Redis"]\n'}
                  {'  }, {\n'}
                  {'    title: "AI Developer Assistant Extension",\n'}
                  {'    tools: ["TypeScript", "Python", "Google GenAI SDK"]\n'}
                  {'  }'}];
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. FILE: package.json (Represent competence packages style with checkboxes) */}
        {activeTab === 'package.json' && (
          <div className="space-y-6">
            <div className="text-gray-500 font-mono text-xs">// package.json</div>

            {viewMode === 'preview' ? (
              <div className="max-w-3xl space-y-6">
                
                {/* Package representation card */}
                <div className="bg-[#181c20] border border-[#2d3139] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                  <div className="pb-4 border-b border-[#2d3139]/40">
                    <h2 className="text-xl font-bold text-white font-sans">Engineering Skills Manifest</h2>
                    <p className="text-xs text-gray-500 font-sans">All competencies declared as project dependencies</p>
                  </div>

                  <div className="space-y-6">
                    {skills.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <span className="text-[11px] font-bold text-[#e2c08d] uppercase tracking-wider block font-mono">
                          "{category.category}"
                        </span>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {category.skills.map((skill) => (
                            <div 
                              key={`p-skill-${skill}`}
                              className="bg-[#111417] px-3 py-2 rounded border border-[#2d3139]/50 flex items-center gap-2 font-mono text-xs text-gray-300 hover:border-sky-500/50 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="max-w-3xl space-y-4">
                <span className="text-xs text-gray-500 font-bold uppercase block">json representation (package.json)</span>
                <div className="bg-[#111417] p-5 rounded border border-[#2d3139]/40 text-[#c586c0] font-mono text-xs md:text-sm overflow-x-auto leading-relaxed">
                  {'{'}<br />
                  <span className="text-[#9cdcfe] pl-4">"name"</span>: <span className="text-[#ce9178]">"rai-farhan-portfolio"</span>,<br />
                  <span className="text-[#9cdcfe] pl-4">"version"</span>: <span className="text-[#ce9178]">"2.4.0"</span>,<br />
                  <span className="text-[#9cdcfe] pl-4">"dependencies"</span>: {'{'}<br />
                  {skills.map((cat, i) => (
                    <div key={`p-json-cat-${i}`} className="pl-8 text-xs font-mono">
                      <span className="text-gray-500">// {cat.category}</span><br />
                      {cat.skills.map((sk, j) => (
                        <div key={`p-json-sk-${j}`}>
                          <span className="text-[#9cdcfe]">"{sk.replace(/\s+/g, '-').toLowerCase()}"</span>: <span className="text-[#ce9178]">"^1.0.0"</span>
                          {j < cat.skills.length - 1 || i < skills.length - 1 ? ',' : ''}
                        </div>
                      ))}
                    </div>
                  ))}<br />
                  <span className="text-[#9cdcfe] pl-4">{'}'}</span><br />
                  {'}'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. FILE: git-history.log (Professional Experience git history timelines) */}
        {activeTab === 'git-history.log' && (
          <div className="space-y-6">
            <div className="text-gray-500 font-mono text-xs">// Terminal - git log --graph --oneline</div>

            <div className="max-w-3xl space-y-8 pl-4 relative border-l border-[#2d3139] my-6">
              
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="relative group pl-6">
                  {/* Git branch node circle timeline marker */}
                  <div className={`absolute -left-[22.5px] top-1 w-3 h-3 rounded-full border-2 border-[#1f1f1f] group-hover:scale-125 transition-transform ${
                    idx === 0 ? 'bg-[#007acc]' : 'bg-gray-500'
                  }`} />

                  <div className="bg-[#181c20] p-5 rounded-lg border border-[#2d3139] space-y-4 shadow transition-all group-hover:border-sky-500/50">
                    <div className="flex flex-wrap items-baseline gap-2.5 pb-2 border-b border-[#2d3139]/40">
                      <span className="text-[#e2c08d] font-bold text-xs shrink-0 font-mono">
                        commit {exp.commitHash}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-sky-500/10 text-[#007acc] border border-[#007acc]/20 px-1.5 py-0.2 rounded font-bold font-mono">
                          HEAD -&gt; main
                        </span>
                      )}
                      
                      <h3 className="text-white font-bold font-sans text-base">
                        {exp.role} @ <span className="text-sky-400">{exp.company}</span>
                      </h3>
                      
                      <span className="text-gray-500 text-xs font-sans font-medium bg-[#111417] px-2 py-0.5 rounded border border-[#2d3139]/30 ml-auto md:shrink-0">
                        {exp.period}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans text-xs md:text-sm text-gray-300 font-normal leading-relaxed">
                      {exp.bullets.map((bullet, BulletIdx) => (
                        <div key={`bullet-${BulletIdx}`} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-mono font-bold select-none shrink-0 pointer-events-none mt-0.5">+</span>
                          <p>{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Infinite Git genesis node */}
              <div className="relative pl-6 opacity-60">
                <div className="absolute -left-[22.5px] top-1 w-3 h-3 rounded-full bg-gray-700 border-2 border-[#1f1f1f]" />
                <div className="text-xs text-gray-500 font-mono italic">
                  * commit genesis0_launch: Initial profile release established.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. FILE: contact.css (Bash Terminal Styled Recruitment Contact Form) */}
        {activeTab === 'contact.css' && (
          <div className="space-y-6">
            <div className="text-gray-500 font-mono text-xs">// src/styles/contact.css (Recruitment Payload Form)</div>

            <div className="max-w-2xl bg-[#111417] border border-[#2d3139] rounded-lg shadow-2xl overflow-hidden animate-fade-in relative">
              
              {/* Fake Terminal Header bar decoration */}
              <div className="bg-[#161a1f] px-4 py-2.5 flex items-center justify-between border-b border-[#2d3139]/40 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-gray-500 font-mono text-xs font-semibold">initiate_contact.exe — bash shell (3000)</span>
                <span className="w-4" />
              </div>

              {/* Form viewport */}
              <div className="p-6 md:p-8 font-mono text-xs md:text-sm space-y-6">
                <div>
                  <span className="text-emerald-500">➜</span> <span className="text-sky-400">~/contact-form</span> <span className="text-gray-300 font-bold">git checkout -b proposal</span>
                  <div className="text-gray-500 text-[11px] pt-1">Switched to diagnostic connection protocols. Fill parameters below:</div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        $ recruiter_name
                      </label>
                      <input 
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2.5 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono selection:bg-[#264f78]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        $ recruiter_email
                      </label>
                      <input 
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="john.doe@company.com"
                        required
                        className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2.5 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono selection:bg-[#264f78]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                      $ proposal_message_payload
                    </label>
                    <textarea 
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Let's build something fantastic together... Looking forward!"
                      required
                      className="w-full bg-[#1c1f24] border border-[#2d3139] focus:border-[#007acc] focus:outline-none focus:ring-0 p-2.5 rounded text-xs text-gray-200 placeholder:text-gray-700 font-mono leading-relaxed resize-none selection:bg-[#264f78]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-400 px-6 py-2.5 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-50 tracking-wider w-full sm:w-auto"
                    >
                      <span>{isSending ? '>>> SUBMITTING...' : '>>> EXECUTE SEND'}</span>
                      <span className="typing-cursor" />
                    </button>

                    {sendSuccess && (
                      <div className="text-emerald-400 text-xs font-bold font-mono animate-pulse flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Transmission complete! Copied to sidebar Contacts.</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
