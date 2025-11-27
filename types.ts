
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ROADMAP_ENGINE = 'ROADMAP_ENGINE',
  RESOURCE_EXPLORER = 'RESOURCE_EXPLORER',
  SALARY_ESTIMATOR = 'SALARY_ESTIMATOR',
  CODE_AUDITOR = 'CODE_AUDITOR',
  ERROR_DECODER = 'ERROR_DECODER',
  GIT_CHEAT_SHEET = 'GIT_CHEAT_SHEET',
  LINUX_COMMANDS = 'LINUX_COMMANDS',
}

export interface ResourceItem {
  name: string;
  description: string;
  url: string;
  tags: string[];
  category: ResourceCategory;
}

export enum ResourceCategory {
  PUBLIC_API = 'Public APIs',
  AI_MODEL = 'AI Models',
  UI_COMPONENTS = 'UI Components',
  DESIGN_TOOLS = 'Design Tools',
  DEVOPS = 'DevOps Assets',
  LIBRARIES = 'Libraries & Utils',
  BOILERPLATES = 'Boilerplates',
  LEARNING = 'Learning & Docs',
}

export interface RoadmapResponse {
  critique: string;
  verdict: 'APPROVED' | 'REJECTED' | 'NEEDS_REFINEMENT';
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    ai?: string[];
  };
  architecture: {
    pattern: string;
    description: string;
    keyComponents: string[];
  };
  implementationSteps: {
    phase: string;
    tasks: string[];
  }[];
  apiRecommendations: string[];
  securityConsiderations: string[];
}

export interface AuditResponse {
  score: number;
  securityIssues: string[];
  performanceIssues: string[];
  codeQuality: string;
  refactoredSnippet?: string;
}

export interface SalaryResponse {
  monthlyRate: string;
  currency: string;
  annualTotal: string;
  level: string;
  marketOutlook: string;
  topTierCompanies: string[];
}

export interface ErrorAnalysisResponse {
  explanation: string;
  rootCause: string;
  correctedCode: string;
  fixDescription: string;
}

// Icon mapping type
export type IconName = 'Cpu' | 'Database' | 'Layout' | 'Server' | 'Code' | 'Box' | 'Terminal' | 'Zap' | 'Shield' | 'GitBranch' | 'DollarSign' | 'FileText' | 'AlertTriangle' | 'Search' | 'Bell' | 'Menu' | 'ArrowRight' | 'ArrowLeft' | 'ExternalLink' | 'BrainCircuit' | 'Play' | 'ChevronRight' | 'Layers' | 'ListOrdered' | 'Activity' | 'Bug' | 'BookOpen' | 'Palette' | 'LayoutGrid' | 'Bot' | 'Workflow' | 'Copy' | 'Check' | 'Filter' | 'PenTool' | 'BarChart' | 'Clock' | 'Star' | 'History' | 'X' | 'Command';
