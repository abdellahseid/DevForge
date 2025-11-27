
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { decodeError } from '../services/geminiService';
import { ErrorAnalysisResponse } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const ErrorDecoder = () => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [result, setResult] = useState<ErrorAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDecode = async () => {
    if(!codeSnippet) return;
    setLoading(true);
    try {
      const res = await decodeError(codeSnippet);
      setResult(res);
    } catch(e) { console.error(e) } finally { setLoading(false) }
  };

  const copyToClipboard = () => {
    if (result?.correctedCode) {
      navigator.clipboard.writeText(result.correctedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
     <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
       <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-3">
          <Icon name="Bug" className="text-neon-amber" />
          STACK_TRACE_DECODER
        </h2>
      </div>
      
      <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
        {/* Left Side: Inputs (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2">
           <div className="flex-1 min-h-[200px] flex flex-col">
              <label className="text-zinc-500 text-xs font-mono mb-2 uppercase">Broken Code</label>
              <textarea 
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste the broken code here..."
                className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs p-4 focus:outline-none focus:border-neon-amber resize-none"
              />
           </div>
           
           <button onClick={handleDecode} disabled={loading} className="w-full py-4 bg-neon-amber text-black font-bold font-mono text-sm hover:bg-amber-500 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            {loading ? 'ANALYZING CRASH...' : 'DECODE & FIX'}
           </button>
        </div>
        
        {/* Right Side: Output (8 cols) */}
        <div className="col-span-12 lg:col-span-8 h-full bg-zinc-900/30 border border-zinc-800 flex flex-col">
          {result ? (
            <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
               <div className="bg-amber-950/20 border-l-4 border-neon-amber p-6">
                <h3 className="text-amber-500 font-bold font-mono text-sm uppercase mb-3 flex items-center gap-2">
                   <Icon name="AlertTriangle" size={16}/> Diagnostic Analysis
                </h3>
                <p className="text-zinc-200 text-lg leading-relaxed">{result.explanation}</p>
              </div>

              <div className="bg-[#0d1117] border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                 <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                   <h4 className="text-neon-green font-bold font-mono text-xs uppercase flex items-center gap-2">
                      <Icon name="Terminal" size={14} /> Patched Code
                   </h4>
                   <button 
                    onClick={copyToClipboard}
                    className="text-zinc-400 hover:text-white flex items-center gap-2 text-xs font-mono uppercase transition-colors px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
                   >
                     {copied ? <Icon name="Check" size={14} className="text-green-500"/> : <Icon name="Copy" size={14} />}
                     {copied ? 'Copied' : 'Copy'}
                   </button>
                 </div>
                 {/* VSCode-like horizontal scrolling container */}
                 <div className="overflow-x-auto custom-scrollbar p-4 w-full">
                   <pre className="text-zinc-300 text-sm font-mono whitespace-pre w-max">
                     <code>{result.correctedCode}</code>
                   </pre>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 border border-zinc-800 bg-zinc-900/50">
                    <span className="text-xs font-mono text-zinc-500 uppercase block mb-2 font-bold">Root Cause</span>
                    <p className="text-sm text-zinc-300 leading-relaxed">{result.rootCause}</p>
                 </div>
                 <div className="p-5 border border-zinc-800 bg-zinc-900/50">
                    <span className="text-xs font-mono text-zinc-500 uppercase block mb-2 font-bold">Fix Description</span>
                    <p className="text-sm text-zinc-300 leading-relaxed">{result.fixDescription}</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700">
              <Icon name="Bug" size={64} className="opacity-20 mb-4" />
              <p className="text-sm font-mono uppercase tracking-widest">Waiting for crash dump</p>
            </div>
          )}
        </div>
      </div>
     </div>
  );
};

export default ErrorDecoder;
