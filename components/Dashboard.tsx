
import React from 'react';
import { Deal, Contact, DealStage, Task, Campaign } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface DashboardProps {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  campaigns: Campaign[];
}

const Dashboard: React.FC<DashboardProps> = ({ deals, contacts, tasks, campaigns }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = deals.filter(d => d.stage !== DealStage.CLOSED_WON && d.stage !== DealStage.CLOSED_LOST).length;
  
  const stageData = Object.values(DealStage).map(stage => ({
    name: stage,
    value: deals.filter(d => d.stage === stage).length,
    amount: deals.filter(d => d.stage === stage).reduce((sum, d) => sum + d.value, 0)
  }));

  const COLORS = ['#6366f1', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#34d399', '#94a3b8'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* High-level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AUM / Pipeline</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">${(totalValue / 1000000).toFixed(2)}M</p>
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[65%]"></div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Velocity</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{activeDeals}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
            +2 this week
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Tasks</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{tasks.filter(t => t.priority === 'High').length}</p>
          <p className="text-xs text-slate-400 mt-2">Needs immediate review</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leads in Pipeline</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{contacts.length * 12}</p>
          <p className="text-xs text-indigo-500 font-semibold mt-2">Up 14% vs LY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Deal Pipeline Liquidity</h3>
            <select className="text-xs font-semibold bg-slate-50 border-none rounded-lg px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stageData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Tasks Sidebar */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Action Items</h3>
          <div className="flex-1 space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-start gap-3 group">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                  task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-indigo-400'
                }`}></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-0.5">Due {task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Active Campaigns */}
         <div className="p-6 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Campaigns</h3>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Live</span>
          </div>
          <div className="space-y-6">
            {campaigns.filter(c => c.status === 'Active').map(c => (
              <div key={c.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm font-bold text-white">{c.name}</p>
                    <p className="text-xs text-slate-400">Targeting {c.leadsTarget} leads</p>
                  </div>
                  <p className="text-xs font-bold text-indigo-400">72% Goal</p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[72%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Distribution */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Network Diversity</h3>
          <div className="h-[180px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {stageData.slice(0, 4).map((s, i) => (
               <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
