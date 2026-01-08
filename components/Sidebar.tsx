
import React from 'react';

type View = 'dashboard' | 'pipeline' | 'contacts' | 'tasks' | 'campaigns' | 'governance';

interface SidebarProps {
  activeTab: View;
  setActiveTab: (tab: View) => void;
  onSignOut: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onSignOut, userName }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Intelligence', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'pipeline', label: 'Deal Pipeline', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'contacts', label: 'Network', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'tasks', label: 'Task Center', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'campaigns', label: 'Campaigns', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
  ];

  const adminItems = [
    { id: 'governance', label: 'Governance', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-white/5 relative z-20">
      <div className="p-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-2xl shadow-indigo-600/30">B</div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white tracking-tighter leading-none">Basembo</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Capital</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
        <section>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Core Platform</p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 translate-x-1' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </section>

        <section>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Administration</p>
          <nav className="space-y-1.5">
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 translate-x-1' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </section>
      </div>

      <div className="p-8">
        <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-bold text-white">
              {userName[0]}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-black text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Tier</p>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
          >
            End Session
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
