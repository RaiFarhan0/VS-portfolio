import { DeveloperProfile, Project, Experience, SkillCategory, TabFile } from '../types';

export const defaultProfile: DeveloperProfile = {
  name: "Rai Farhan",
  role: "AI & Machine Learning Developer",
  location: "Nankana Sahib, Pakistan",
  status: "Open to Opportunities",
  bio: "Highly motivated and disciplined AI/ML Developer with a profound interest in Computer Science, software architecture, and automated workflows. Proven track record of building intelligent systems, optimizing computer vision models, and engineering robust web-scraping pipelines. Adept at translating complex theoretical problems into scalable, production-ready applications.",
  mission: "To leverage advanced algorithmic engineering and automation skills within professional and academic ecosystems.",
  coreValues: ["Intelligent Workflows", "Model Optimization", "Data Scraping Pipelines", "System Architectures"],
  socials: {
    github: "https://github.com/raifarhan",
    linkedin: "https://linkedin.com/in/raifarhan",
    email: "raifarhan003@gmail.com"
  }
};

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "CCTV Anomaly Detection Web Application",
    description: "Designed and built a high-performance computer vision web application to analyze live CCTV feeds and detect anomalies autonomously. Includes integrated Socket.IO for low-latency live streaming overlays and fine-tuned YOLOv8 models for reduced false-positive rates in automated security monitoring.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
    tools: ["Python", "YOLOv8", "Flask", "Socket.IO", "Computer Vision"],
    githubUrl: "https://github.com/raifarhan/cctv-anomaly-detection"
  },
  {
    id: "2",
    title: "AI-Driven Text-to-Handwriting Generation Model",
    description: "Developed a custom neural network using TensorFlow to synthesize realistic human-like handwriting from digital text, optimized to handle diverse writing variations with deep learning pipelines.",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600",
    tools: ["Python", "TensorFlow", "Computer Vision", "Neural Networks"],
    githubUrl: "https://github.com/raifarhan/ai-text-to-handwriting"
  },
  {
    id: "3",
    title: "Wikipedia NRHP Image Scraper",
    description: "Robust multi-threaded Python scraping script engineered to extract National Register of Historic Places (NRHP) images and metadata dynamically with fail-safe request logic and structural parsing.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    tools: ["Python", "Dynamic Scraping", "Data Workflows", "Automation"],
    githubUrl: "https://github.com/raifarhan/wikipedia-nrhp-scraper"
  }
];

export const defaultExperiences: Experience[] = [
  {
    id: "exp-1",
    role: "Lead AI & Backend Developer",
    company: "CCTV Anomaly Detection",
    period: "2023 - 2024",
    commitHash: "e3f4a1c",
    bullets: [
      "Built a high-performance computer vision web application to analyze live CCTV feeds and detect anomalies autonomously.",
      "Integrated Socket.IO for low-latency, real-time communication, providing instant visual alerts on the user dashboard upon anomaly trigger.",
      "Fine-tuned YOLOv8 for specific environment challenges, reducing false-positive rates in automated security monitoring."
    ]
  },
  {
    id: "exp-2",
    role: "Lead Developer",
    company: "AI Text-to-Handwriting",
    period: "2022 - 2023",
    commitHash: "7b8c2d1",
    bullets: [
      "Developed a custom neural network using TensorFlow to synthesize realistic human-like handwriting from digital text.",
      "Optimized the model architecture to handle diverse writing variations and seamlessly integrated it with automated generation pipelines."
    ]
  },
  {
    id: "exp-3",
    role: "Automation Script Engineer",
    company: "NRHP Image Scraper Project",
    period: "2021 - 2022",
    commitHash: "a9b8c7d",
    bullets: [
      "Engineered a robust, multi-threaded Python scraping script to extract National Register of Historic Places (NRHP) images and metadata dynamically.",
      "Implemented fail-safe request logic and structural parsing to bypass layout anomalies, delivering high-quality structured data for client utilization."
    ]
  },
  {
    id: "exp-4",
    role: "FSc Pre-Engineering",
    company: "Pak Garrison Education System",
    period: "2019 - 2021",
    commitHash: "f1a2b3c",
    bullets: [
      "Graduated under European Qualifications Framework (EQF) Level 4 in Nankana Sahib, Pakistan.",
      "Core Focus: Advanced Mathematics, Physics, and Engineering Principles."
    ]
  }
];

export const defaultSkills: SkillCategory[] = [
  {
    category: "AI & Computer Vision",
    skills: ["TensorFlow", "YOLOv8", "Neural Networks", "Image Processing", "Object Detection", "Anomaly Detection"]
  },
  {
    category: "Automation & Backend",
    skills: ["Python (Advanced)", "C++ (Core)", "Flask", "Socket.IO", "Robotic Process Automation", "Web Scraping", "Script Optimization", "System Logic Architecture"]
  },
  {
    category: "Data Management & SQL",
    skills: ["JSON", "SQL", "System Architecture", "Custom Pipelines"]
  },
  {
    category: "Language Competencies",
    skills: ["Urdu (Native)", "English (C2 Proficient)", "Europass Framework"]
  }
];

export const tabFiles: TabFile[] = [
  { id: "index.tsx", name: "index.tsx", path: "src/components/Portfolio/index.tsx", lang: "typescript", iconType: "tsx" },
  { id: "about.tsx", name: "about.tsx", path: "src/data/about_me.json", lang: "json", iconType: "json" },
  { id: "projects.tsx", name: "projects.tsx", path: "src/components/Portfolio/projects.tsx", lang: "typescript", iconType: "tsx" },
  { id: "package.json", name: "package.json", path: "package.json", lang: "json", iconType: "json" },
  { id: "git-history.log", name: "git-history.log", path: "git l -n 5", lang: "log", iconType: "git" },
  { id: "contact.css", name: "contact.css", path: "src/styles/contact.css", lang: "css", iconType: "css" }
];
