import React, { useState, useCallback } from 'react';
import { ViewState, ResourceCategory } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RoadmapEngine from './pages/RoadmapEngine';
import SalaryEstimator from './pages/SalaryEstimator';
import CodeAuditor from './pages/CodeAuditor';
import ErrorDecoder from './pages/ErrorDecoder';
import ResourceExplorer from './pages/ResourceExplorer';
import KnowledgeBase from './pages/KnowledgeBase';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const App = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = useCallback((newView: ViewState, category?: ResourceCategory) => {
    setView(newView);
    if (category) setActiveCategory(category);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setView(ViewState.DASHBOARD);
    setActiveCategory(null);
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex font-sans bg-black selection:bg-neon-blue selection:text-white overflow-x-hidden">
      <Sidebar 
        view={view} 
        activeCategory={activeCategory} 
        onNavigate={handleNavigate} 
        onBackToDashboard={handleBackToDashboard} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-zinc-950 min-h-screen transition-all duration-300">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
          <div className="md:hidden flex items-center gap-3 text-white font-bold cursor-pointer hover:text-neon-blue transition-colors" onClick={toggleSidebar}>
             <Icon name="Menu" size={24} /> 
             <span className="tracking-tight">DevForge</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-zinc-500 text-sm font-mono">
            <span>SYSTEM_STATUS:</span>
            <span className="text-neon-green">OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-6">
             <button className="text-zinc-400 hover:text-white transition-colors">
                <Icon name="Search" size={18} />
             </button>
             <button className="text-zinc-400 hover:text-white transition-colors">
                <Icon name="Bell" size={18} />
             </button>
             <div className="w-px h-6 bg-zinc-800 hidden md:block"></div>
             <div className="text-xs font-mono text-zinc-500 hidden md:block">v4.3.0</div>
          </div>
        </header>

        <div className="p-4 md:p-8 w-full max-w-[1920px] mx-auto">
          {view === ViewState.DASHBOARD && <Dashboard onNavigate={handleNavigate} />}
          {view === ViewState.RESOURCE_EXPLORER && activeCategory && (
            <ResourceExplorer category={activeCategory} onBack={handleBackToDashboard} />
          )}
          {view === ViewState.ROADMAP_ENGINE && <RoadmapEngine />}
          {view === ViewState.CODE_AUDITOR && <CodeAuditor />}
          {view === ViewState.SALARY_ESTIMATOR && <SalaryEstimator />}
          {view === ViewState.ERROR_DECODER && <ErrorDecoder />}
          {(view === ViewState.GIT_CHEAT_SHEET || view === ViewState.LINUX_COMMANDS) && (
            <KnowledgeBase view={view} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;