export interface Socials {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface DeveloperProfile {
  name: string;
  role: string;
  location: string;
  status: string;
  bio: string;
  mission: string;
  coreValues: string[];
  socials: Socials;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tools: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
  commitHash: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface TerminalOutput {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'command';
  timestamp: string;
}

export interface TabFile {
  id: string;
  name: string;
  path: string;
  lang: 'typescript' | 'json' | 'log' | 'css';
  iconType: 'ts' | 'tsx' | 'json' | 'git' | 'css';
}
