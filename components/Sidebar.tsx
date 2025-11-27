import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ViewState, ResourceCategory } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: string; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 
      ${active 
        ? 'border-neon-blue bg-zinc-900 text-white' 
        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
      }`}
  >
    <Icon name={icon} size={18} className={active ? 'text-neon-blue' : 'text-zinc-500'} />
    <span>{label}</span>
  </button>
);

interface SidebarProps {
  view: ViewState;
  activeCategory: ResourceCategory | null;
  onNavigate: (view: ViewState, category?: ResourceCategory) => void;
  onBackToDashboard: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, activeCategory, onNavigate, onBackToDashboard, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tighter flex items-center gap-2 cursor-pointer" onClick={onBackToDashboard}>
            <div className="w-3 h-3 bg-neon-blue rounded-sm" />
            SnipBase
          </h1>
          <button onClick={onClose} className="md:hidden text-zinc-500 hover:text-white">
            <Icon name="X" size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon="LayoutGrid" 
            label="Dashboard" 
            active={view === ViewState.DASHBOARD} 
            onClick={onBackToDashboard}
          />
          
          <div className="pt-6 pb-2 px-6 text-xs font-mono text-zinc-600 uppercase tracking-widest font-bold">Tools</div>
          <SidebarItem 
            icon="Cpu" 
            label="Roadmap Engine" 
            active={view === ViewState.ROADMAP_ENGINE} 
            onClick={() => onNavigate(ViewState.ROADMAP_ENGINE)}
          />
          <SidebarItem 
            icon="DollarSign" 
            label="Salary Estimator" 
            active={view === ViewState.SALARY_ESTIMATOR} 
            onClick={() => onNavigate(ViewState.SALARY_ESTIMATOR)}
          />
          <SidebarItem 
            icon="Activity" 
            label="Code Auditor" 
            active={view === ViewState.CODE_AUDITOR} 
            onClick={() => onNavigate(ViewState.CODE_AUDITOR)}
          />
          <SidebarItem 
            icon="Bug" 
            label="Error Decoder" 
            active={view === ViewState.ERROR_DECODER} 
            onClick={() => onNavigate(ViewState.ERROR_DECODER)}
          />
          
          <div className="pt-6 pb-2 px-6 text-xs font-mono text-zinc-600 uppercase tracking-widest font-bold">Resources</div>
          <SidebarItem 
            icon="Palette" 
            label="UI Components" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.UI_COMPONENTS} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.UI_COMPONENTS)}
          />
          <SidebarItem 
            icon="PenTool" 
            label="Design Tools" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.DESIGN_TOOLS} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.DESIGN_TOOLS)}
          />
          <SidebarItem 
            icon="Box" 
            label="DevOps Assets" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.DEVOPS} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.DEVOPS)}
          />
          <SidebarItem 
            icon="Database" 
            label="Public APIs" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.PUBLIC_API} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.PUBLIC_API)}
          />
          <SidebarItem 
            icon="BookOpen" 
            label="Libraries" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.LIBRARIES} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.LIBRARIES)}
          />
          <SidebarItem 
            icon="Bot" 
            label="AI Models" 
            active={view === ViewState.RESOURCE_EXPLORER && activeCategory === ResourceCategory.AI_MODEL} 
            onClick={() => onNavigate(ViewState.RESOURCE_EXPLORER, ResourceCategory.AI_MODEL)}
          />

          <div className="pt-6 pb-2 px-6 text-xs font-mono text-zinc-600 uppercase tracking-widest font-bold">Knowledge Base</div>
          <SidebarItem 
            icon="GitBranch" 
            label="Git Cheat Sheet" 
            active={view === ViewState.GIT_CHEAT_SHEET} 
            onClick={() => onNavigate(ViewState.GIT_CHEAT_SHEET)}
          />
          <SidebarItem 
            icon="Terminal" 
            label="Linux Commands" 
            active={view === ViewState.LINUX_COMMANDS} 
            onClick={() => onNavigate(ViewState.LINUX_COMMANDS)}
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center justify-center p-3 bg-zinc-900/50 rounded border border-zinc-800">
            <div className="text-xs text-zinc-500 font-mono">
              Powered by: <a href="https://abdellahseid.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-neon-blue font-bold hover:underline hover:text-white transition-colors">Abdellah</a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;