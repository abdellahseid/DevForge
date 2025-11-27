
import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { generateRoadmap } from '../services/geminiService';
import { RoadmapResponse } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const StackCard = ({ title, items, icon }: { title: string, items: string[], icon: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4">
    <div className="flex items-center gap-2 mb-3 text-zinc-500">
      <Icon name={icon} size={14} />
      <span className="text-xs font-mono uppercase">{title}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {items?.map(item => (
        <span key={item} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded border border-zinc-700">
          {typeof item === 'string' ? item : JSON.stringify(item)}
        </span>
      ))}
    </div>
  </div>
);

interface HistoryItem {
  idea: string;
  result: RoadmapResponse;
  timestamp: number;
}

const RoadmapEngine = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('devforge_roadmap_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration check: ensure items are objects, not strings
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
           localStorage.removeItem('roadmap_history'); // Clear old format
           setHistory([]);
        } else {
           setHistory(parsed);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (newIdea: string, newResult: RoadmapResponse) => {
    const newItem: HistoryItem = { 
        idea: newIdea, 
        result: newResult, 
        timestamp: Date.now() 
    };
    
    // Filter duplicates by idea to keep list fresh
    const updated = [newItem, ...history.filter(h => h.idea !== newIdea)].slice(0, 12);
    setHistory(updated);
    localStorage.setItem('devforge_roadmap_history', JSON.stringify(updated));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateRoadmap(idea);
      setResult(data);
      saveToHistory(idea, data);
    } catch (err: any) {
      setError(err.message || 'System Failure. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setIdea(item.idea);
    setResult(item.result);
    setShowHistory(false);
  };

  // --- HISTORY VIEW ---
  if (showHistory) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
            <Icon name="History" className="text-neon-blue" />
            GENERATION_ARCHIVES
          </h2>
          <button 
            onClick={() => setShowHistory(false)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors font-mono text-xs uppercase"
          >
            <Icon name="ArrowLeft" size={14} /> Back to Generator
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border border-zinc-800 border-dashed bg-zinc-900/20">
              <Icon name="History" size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-mono uppercase tracking-widest">No archives found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => loadFromHistory(item)}
                  className="group bg-zinc-900/50 border border-zinc-800 p-6 cursor-pointer hover:border-neon-purple hover:bg-zinc-900 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="ArrowRight" className="text-neon-purple" size={16} />
                  </div>
                  <div className="flex justify-between items-start mb-3">
                     <div className="text-xs font-mono text-zinc-500">LOG_ID_{String(i + 1).padStart(3, '0')}</div>
                     <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        item.result.verdict === 'APPROVED' ? 'border-green-900 bg-green-950/30 text-green-400' :
                        item.result.verdict === 'REJECTED' ? 'border-red-900 bg-red-950/30 text-red-400' :
                        'border-amber-900 bg-amber-950/30 text-amber-400'
                     }`}>
                        {item.result.verdict}
                     </span>
                  </div>
                  
                  <p className="text-zinc-200 text-sm font-medium line-clamp-3 leading-relaxed group-hover:text-white flex-grow mb-4">
                    {item.idea}
                  </p>
                  
                  <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center mt-auto">
                     <span className="text-[10px] font-mono text-zinc-600">{new Date(item.timestamp).toLocaleDateString()}</span>
                     <span className="text-[10px] font-mono text-neon-blue uppercase group-hover:underline">Restore</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- GENERATOR VIEW ---
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in pb-12 w-full h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-2">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 sticky top-0 bg-zinc-950/95 backdrop-blur z-10 pt-2">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
          <Icon name="Workflow" className="text-neon-purple" />
          ROADMAP_GENERATOR_V3.1
        </h2>
        <div className="flex items-center gap-4">
            {result && (
            <button 
              onClick={() => setResult(null)} 
              className="text-xs text-zinc-500 hover:text-white underline font-mono"
            >
              CLEAR CONTEXT
            </button>
          )}
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded transition-colors text-xs font-mono uppercase"
            title="View History"
          >
            <Icon name="History" size={16} /> History
          </button>
        </div>
      </div>

      {/* Input Section - Top */}
      {!result && (
        <div className="w-full">
            <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-lg shadow-purple-900/10">
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm mb-2">
                <span className="text-neon-green">architect@system</span>
                <span>~/roadmap-requests $</span>
              </div>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your software concept clearly. Vague inputs will be rejected."
                  className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none font-mono text-lg h-32 terminal-cursor border-b border-zinc-900 focus:border-neon-purple/50 transition-colors"
                  autoFocus
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-zinc-600 font-mono">MODEL: GEMINI-3-PRO-PREVIEW</span>
                  <button 
                    type="submit" 
                    disabled={loading || !idea}
                    className={`px-8 py-3 font-bold font-mono text-sm transition-all flex items-center gap-2
                      ${loading ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-neon-blue text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
                    `}
                  >
                    {loading ? 'COMPILING...' : 'GENERATE ROADMAP'} <Icon name="ChevronRight" size={14} />
                  </button>
                </div>
              </form>
            </div>
        </div>
      )}

      {error && (
          <div className="p-4 border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-sm flex items-center gap-3">
            <Icon name="AlertTriangle" /> {error}
          </div>
      )}

      {result && (
        <div className="space-y-8 pb-10 w-full animate-in slide-in-from-bottom-10">
          {/* Status Bar */}
          <div className="flex flex-wrap gap-4">
            <div className={`px-4 py-2 border font-bold font-mono flex items-center gap-2
              ${result.verdict === 'APPROVED' ? 'border-green-500/50 bg-green-950/20 text-green-400' : 
                result.verdict === 'REJECTED' ? 'border-red-500/50 bg-red-950/20 text-red-400' : 
                'border-amber-500/50 bg-amber-950/20 text-amber-400'
              }`}>
              VERDICT: {result.verdict}
            </div>
            <div className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono text-sm">
              ARCH: {result.architecture.pattern.toUpperCase()}
            </div>
          </div>

          {/* Critique Panel */}
          <div className="bg-zinc-900/50 border-l-4 border-l-zinc-700 p-6">
            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Technical Critique</h3>
            <p className="text-zinc-200 leading-relaxed font-sans text-lg">{result.critique}</p>
          </div>

          {/* Tech Stack Grid */}
          <div>
            <h3 className="text-white font-bold font-mono mb-4 flex items-center gap-2">
              <Icon name="Layers" className="text-neon-blue" />
              RECOMMENDED STACK
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StackCard title="Frontend" items={result.techStack.frontend} icon="Layout" />
              <StackCard title="Backend" items={result.techStack.backend} icon="Server" />
              <StackCard title="Database" items={result.techStack.database} icon="Database" />
              <StackCard title="DevOps" items={result.techStack.devops} icon="Box" />
            </div>
          </div>

            {/* Implementation Plan */}
            <div>
            <h3 className="text-white font-bold font-mono mb-4 flex items-center gap-2">
              <Icon name="ListOrdered" className="text-neon-purple" />
              EXECUTION PHASES
            </h3>
            <div className="space-y-4">
              {result.implementationSteps.map((step, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 font-mono text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-zinc-200 font-bold mb-3">{step.phase}</h4>
                      <ul className="space-y-2">
                        {step.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-zinc-400 text-sm flex items-start gap-2">
                            <span className="text-zinc-600 mt-1">▹</span> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>

            {/* APIs & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/30 border border-zinc-800 p-5">
                <h4 className="text-zinc-300 font-bold font-mono text-sm mb-3 uppercase">Required APIs</h4>
                <ul className="space-y-2">
                  {result.apiRecommendations.map((api, i) => (
                    <li key={i} className="text-neon-blue text-sm font-mono">{api}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-900/30 border border-red-900/30 p-5">
                <h4 className="text-red-400 font-bold font-mono text-sm mb-3 uppercase flex items-center gap-2">
                  <Icon name="Shield" size={14} /> Security Protocols
                </h4>
                <ul className="space-y-2">
                  {result.securityConsiderations.map((sec, i) => (
                    <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                        <span className="text-red-500/50">!</span> {sec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapEngine;
