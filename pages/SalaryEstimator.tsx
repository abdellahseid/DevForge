
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { estimateSalary } from '../services/geminiService';
import { SalaryResponse } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const Badge: React.FC<{children: React.ReactNode, color?: string}> = ({ children, color = 'zinc' }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-950/30 text-blue-400 border-blue-900',
    green: 'bg-green-950/30 text-green-400 border-green-900',
    zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-mono border rounded ${colors[color] || colors.zinc}`}>
      {children}
    </span>
  );
};

const SalaryEstimator = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [stack, setStack] = useState('');
  const [industry, setIndustry] = useState('');
  const [education, setEducation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalaryResponse | null>(null);

  const handleEstimate = async () => {
    if(!role || !location || !experience) return;
    setLoading(true);
    try {
      const res = await estimateSalary(role, location, parseInt(experience), stack, industry, education);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
       <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
          <Icon name="DollarSign" className="text-neon-green" />
          MARKET_VALUE_ESTIMATOR
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Side: Inputs (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-zinc-900/30 p-6 border border-zinc-800 space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-zinc-800 pb-2 mb-4">Parameters</h3>
            <div>
              <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Role Title</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Backend Eng"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Location</label>
               <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
            <div>
               <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Years Experience</label>
               <input 
                type="number" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
            <div>
               <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Tech Stack</label>
               <input 
                type="text" 
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="e.g. Rust, AWS"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
            <div>
               <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Industry / Sector</label>
               <input 
                type="text" 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, Healthtech"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
            <div>
               <label className="text-zinc-500 text-xs font-mono mb-1 block uppercase">Education / Certs</label>
               <input 
                type="text" 
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Masters, AWS Solutions Arch"
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-3 py-3 focus:outline-none focus:border-neon-green font-mono text-sm transition-colors"
              />
            </div>
          </div>
          
          <button 
            onClick={handleEstimate}
            disabled={loading || !role || !location}
            className="w-full py-4 bg-neon-green text-black font-black font-mono hover:bg-green-500 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {loading ? 'CALCULATING MARKET RATES...' : 'ESTIMATE SALARY'}
          </button>
        </div>

        {/* Right Side: Output (8 cols) */}
        <div className="col-span-12 lg:col-span-8 h-full">
          {result ? (
            <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right-4">
              <div className="bg-zinc-900 border border-zinc-700 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-10 text-neon-green opacity-5 transform rotate-12 scale-150 pointer-events-none"><Icon name="DollarSign" size={200} /></div>
                 <div className="text-zinc-400 text-xs font-mono uppercase tracking-[0.3em] mb-4">Monthly Compensation Estimate</div>
                 <div className="text-7xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{result.monthlyRate}</div>
                 <div className="text-zinc-400 text-base font-mono mt-4 bg-zinc-950/50 px-4 py-2 rounded-full border border-zinc-800">Annual Total: <span className="text-neon-green font-bold">{result.annualTotal}</span></div>
                 
                 <div className="mt-8 flex gap-3">
                    <Badge color="blue">{result.level}</Badge>
                    <Badge color="zinc">{result.currency}</Badge>
                    <Badge color="green">High Demand</Badge>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 flex-1">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                  <h3 className="text-zinc-400 font-bold font-mono text-xs uppercase mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <Icon name="Activity" size={14} /> Market Outlook
                  </h3>
                  <p className="text-zinc-300 text-sm leading-7">{result.marketOutlook}</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                  <h3 className="text-zinc-400 font-bold font-mono text-xs uppercase mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <Icon name="Database" size={14} /> Top Paying Employers
                  </h3>
                  <div className="flex flex-wrap gap-2 content-start">
                    {result.topTierCompanies.map(c => (
                      <span key={c} className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs font-bold hover:border-zinc-500 transition-colors cursor-default">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/20">
              <Icon name="Search" size={64} className="opacity-20 mb-4" />
              <p className="text-sm font-mono uppercase tracking-widest">Enter data to estimate value</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryEstimator;
