
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { RESOURCES } from '../data';
import { ResourceCategory, ViewState } from '../types';

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

interface DashboardProps {
  onNavigate: (view: ViewState, category?: ResourceCategory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Resources Indexed', value: RESOURCES.length, icon: 'Database', color: 'text-neon-blue' },
    { label: 'Models Active', value: RESOURCES.filter(r => r.category === ResourceCategory.AI_MODEL).length, icon: 'Cpu', color: 'text-neon-purple' },
  ];

  const recentActivity = [
    { action: 'Audit Completed', subject: 'auth_service.ts', time: '2m ago', icon: 'Activity', color: 'text-neon-red' },
    { action: 'Roadmap Generated', subject: 'E-commerce Platform', time: '15m ago', icon: 'Workflow', color: 'text-neon-purple' },
    { action: 'Salary Estimated', subject: 'Senior Dev, London', time: '1h ago', icon: 'DollarSign', color: 'text-neon-green' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-neon-blue/10 transition-all duration-700"></div>
          <h2 className="text-3xl font-bold text-white mb-2 relative z-10">System Online.</h2>
          <p className="text-zinc-400 max-w-lg relative z-10 text-lg">
             Ready for task execution. All subsystems operational. 
             Access tools via the command palette or sidebar.
          </p>
          <div className="mt-8 flex gap-4 relative z-10">
             <button onClick={() => onNavigate(ViewState.ROADMAP_ENGINE)} className="px-6 py-2 bg-white text-black font-bold font-mono text-sm hover:bg-zinc-200 transition-colors">NEW ROADMAP</button>
             <button onClick={() => onNavigate(ViewState.CODE_AUDITOR)} className="px-6 py-2 border border-zinc-700 text-white font-bold font-mono text-sm hover:bg-zinc-800 transition-colors">AUDIT CODE</button>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col justify-between">
           <div>
             <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">System Health</h3>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-xs text-zinc-400 mb-1">
                     <span>CPU Load</span>
                     <span>12%</span>
                   </div>
                   <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-neon-green h-full w-[12%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs text-zinc-400 mb-1">
                     <span>Memory</span>
                     <span>34%</span>
                   </div>
                   <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-neon-blue h-full w-[34%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs text-zinc-400 mb-1">
                     <span>API Latency</span>
                     <span>45ms</span>
                   </div>
                   <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-neon-purple h-full w-[10%]"></div>
                   </div>
                </div>
             </div>
           </div>
           <div className="flex items-center gap-2 mt-4 text-xs font-mono text-zinc-600">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             GATEWAY CONNECTED
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icon name="BarChart" className="text-zinc-500" /> Database Stats
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 p-4">
                   <Icon name={s.icon} className={`${s.color} mb-2`} size={20} />
                   <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
                   <div className="text-xs text-zinc-500 uppercase">{s.label}</div>
                </div>
              ))}
           </div>
           
           <div className="bg-zinc-900/30 border border-zinc-800 p-6">
              <h3 className="text-zinc-400 font-bold font-mono text-xs uppercase mb-4">Daily Developer Tip</h3>
              <p className="text-zinc-300 text-sm italic border-l-2 border-neon-amber pl-3">
                 "Premature optimization is the root of all evil. Measure first, then optimize where the bottleneck actually exists."
              </p>
              <div className="text-right mt-2 text-xs text-zinc-600">— Donald Knuth</div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Icon name="Clock" className="text-zinc-500" /> Recent Activity
            </h3>
            <div className="bg-zinc-900 border border-zinc-800">
               {recentActivity.map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700`}>
                          <Icon name={item.icon} className={item.color} size={16} />
                       </div>
                       <div>
                          <div className="text-white text-sm font-medium">{item.action}</div>
                          <div className="text-zinc-500 text-xs">{item.subject}</div>
                       </div>
                    </div>
                    <div className="text-zinc-600 font-mono text-xs">{item.time}</div>
                 </div>
               ))}
               <div className="p-4 text-center">
                  <button className="text-xs font-mono text-zinc-500 hover:text-white uppercase tracking-widest">View System Logs</button>
               </div>
            </div>
        </div>
      </div>
      
      {/* Featured Resources (Mini) */}
      <div>
         <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Icon name="Star" className="text-neon-amber" /> Trending Tools
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {RESOURCES.slice(0, 4).map(r => (
               <div key={r.name} className="bg-zinc-900/50 border border-zinc-800 p-4 hover:border-zinc-600 transition-colors">
                  <div className="flex justify-between mb-2">
                     <span className="text-zinc-200 font-bold text-sm truncate pr-2">{r.name}</span>
                     <Icon name="ExternalLink" size={12} className="text-zinc-600"/>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {r.tags.slice(0, 1).map(t => <Badge key={t} color="zinc">{t}</Badge>)}
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
