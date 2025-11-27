
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { auditCode } from '../services/geminiService';
import { AuditResponse } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const Badge: React.FC<{children: React.ReactNode, color?: string}> = ({ children, color = 'zinc' }) => {
  const colors: Record<string, string> = {
    green: 'bg-green-950/30 text-green-400 border-green-900',
    red: 'bg-red-950/30 text-red-400 border-red-900',
    amber: 'bg-amber-950/30 text-amber-400 border-amber-900',
    zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-mono border rounded ${colors[color] || colors.zinc}`}>
      {children}
    </span>
  );
};

const CodeAuditor = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);

  const handleAudit = async () => {
    if(!code.trim()) return;
    setLoading(true);
    try {
      const res = await auditCode(code);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
          <Icon name="Activity" className="text-neon-red" />
          SECURE_CODE_AUDITOR
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 h-full">
        {/* Left Side: Input (Smaller: 4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
           <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste code snippet here for security & performance audit..."
            className="flex-1 bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:border-neon-red/50 resize-none terminal-cursor custom-scrollbar"
          />
          <button
            onClick={handleAudit}
            disabled={loading || !code}
            className="py-4 bg-neon-red text-black font-bold font-mono hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'RUNNING DEEP ANALYSIS...' : 'RUN AUDIT'}
          </button>
        </div>

        {/* Right Side: Output (Larger: 8 cols) */}
        <div className="col-span-12 lg:col-span-8 h-full flex flex-col gap-4">
          {result ? (
            <div className="h-full overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {/* Verdict Card */}
              <div className="bg-zinc-900 border border-zinc-700 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-black/50 relative overflow-hidden group">
                 <div className={`absolute inset-0 opacity-10 ${result.score > 80 ? 'bg-green-500' : 'bg-red-500'}`} />
                 <div className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-2 font-bold">Audit Score</div>
                 <div className={`text-6xl font-black font-mono tracking-tighter mb-2 ${result.score > 80 ? 'text-neon-green' : result.score > 50 ? 'text-neon-amber' : 'text-neon-red'}`}>
                    {result.score}
                 </div>
                 <Badge color={result.score > 80 ? 'green' : result.score > 50 ? 'amber' : 'red'}>
                    {result.codeQuality}
                 </Badge>
              </div>

              <div className="p-4 border border-red-900/40 bg-red-950/10 backdrop-blur-sm">
                <h3 className="text-red-400 font-bold text-xs uppercase mb-3 flex items-center gap-2 tracking-wider">
                  <Icon name="Shield" className="animate-pulse" /> Security
                </h3>
                <ul className="space-y-3">
                  {result.securityIssues.length ? result.securityIssues.map((issue, i) => (
                    <li key={i} className="text-zinc-300 text-sm flex gap-3 items-start leading-tight">
                      <span className="text-red-500 font-bold">✕</span> {issue}
                    </li>
                  )) : <li className="text-zinc-500 text-sm italic flex gap-2"><Icon name="Check" size={14} className="text-green-500"/> System Secure</li>}
                </ul>
              </div>

              <div className="p-4 border border-amber-900/40 bg-amber-950/10 backdrop-blur-sm">
                <h3 className="text-amber-400 font-bold text-xs uppercase mb-3 flex items-center gap-2 tracking-wider">
                  <Icon name="Zap" /> Performance
                </h3>
                <ul className="space-y-3">
                  {result.performanceIssues.length ? result.performanceIssues.map((issue, i) => (
                    <li key={i} className="text-zinc-300 text-sm flex gap-3 items-start leading-tight">
                      <span className="text-amber-500 font-bold">⚠</span> {issue}
                    </li>
                  )) : <li className="text-zinc-500 text-sm italic flex gap-2"><Icon name="Check" size={14} className="text-green-500"/> Optimized</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full border border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <Icon name="Activity" size={48} className="opacity-20" />
              <p className="text-sm font-mono uppercase tracking-widest">Awaiting Input</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeAuditor;
