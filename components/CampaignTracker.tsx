
import React from 'react';
import { Campaign } from '../types';

interface CampaignTrackerProps {
  campaigns: Campaign[];
}

const CampaignTracker: React.FC<CampaignTrackerProps> = ({ campaigns }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Growth Campaigns</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all">
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-indigo-300 transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {c.status}
              </span>
              <button className="p-1 hover:bg-slate-50 rounded">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeWidth="2"/></svg>
              </button>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{c.name}</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Starts {c.startDate}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Target</p>
                <p className="text-sm font-bold text-slate-800">{c.leadsTarget} Leads</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
                <p className="text-sm font-bold text-slate-800">${c.budget.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Reach</span>
                <span>65%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignTracker;
