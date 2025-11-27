
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { RESOURCES } from '../data';
import { ResourceCategory } from '../types';

const Icon = ({ name, className, size = 16 }: { name: string; className?: string; size?: number }) => {
  // @ts-ignore
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon className={className} size={size} /> : null;
};

const Badge: React.FC<{children: React.ReactNode, color?: string}> = ({ children, color = 'zinc' }) => (
  <span className="px-2 py-0.5 text-xs font-mono border rounded bg-zinc-800 text-zinc-400 border-zinc-700">
    {children}
  </span>
);

const ResourceExplorer = ({ category, onBack }: { category: ResourceCategory; onBack: () => void }) => {
  const [filter, setFilter] = useState('');
  
  const filtered = RESOURCES.filter(r => 
    r.category === category && 
    (r.name.toLowerCase().includes(filter.toLowerCase()) || 
     r.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())))
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-10 duration-300 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 sticky top-0 bg-zinc-950/95 backdrop-blur z-10 pt-2 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-900 rounded-full">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-widest">{category}</h2>
            <div className="text-xs font-mono text-zinc-500 mt-1">{filtered.length} ITEMS FOUND</div>
          </div>
        </div>
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
          <input 
            type="text" 
            placeholder="Filter by name or tag..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm pl-9 pr-4 py-2 w-full md:w-64 focus:outline-none focus:border-zinc-600 rounded-sm font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.name} className="group bg-zinc-900/50 border border-zinc-800 p-5 hover:border-zinc-600 transition-all hover:-translate-y-1 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-bold text-zinc-200 group-hover:text-neon-blue transition-colors line-clamp-1">{item.name}</h3>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <Icon name="ExternalLink" size={14} />
              </a>
            </div>
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
            <div className="flex gap-2 flex-wrap mt-auto">
              {item.tags.slice(0, 3).map(tag => (
                <Badge key={tag} color="zinc">{tag}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceExplorer;
