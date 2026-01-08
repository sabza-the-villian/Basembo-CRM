
import React, { useState } from 'react';
import { User } from '../types';

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'James Wilson', email: 'wilson@basembo.cap', role: 'Partner', licenseTier: 'Enterprise', status: 'Active', permissions: ['All'] },
  { id: 'u2', name: 'Clara Oswald', email: 'oswald@basembo.cap', role: 'Associate', licenseTier: 'Pro', status: 'Active', permissions: ['Write Deal', 'Search Intel'] },
  { id: 'u3', name: 'Ben Chen', email: 'ben@basembo.cap', role: 'Analyst', licenseTier: 'Standard', status: 'Pending', permissions: ['Read Only'] },
];

const LicenseManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Revoked' : 'Active' };
      }
      return u;
    }));
  };

  const removeUser = (id: string) => {
    if (confirm('Permanently remove this user license seat?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Governance & Access</h2>
          <p className="text-slate-500 text-sm font-medium">Manage corporate licenses and administrative permissions.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
          Provision New Seat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Corporate Identity</th>
                <th className="px-8 py-5">License Tier</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold border-2 border-white ring-1 ring-slate-100">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      user.licenseTier === 'Enterprise' ? 'bg-indigo-100 text-indigo-700' :
                      user.licenseTier === 'Pro' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.licenseTier}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-emerald-500' : 
                        user.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></div>
                      <span className="text-xs font-bold text-slate-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600 transition-all"
                        title="Toggle Access"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button 
                        onClick={() => removeUser(user.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 text-slate-400 hover:text-rose-600 transition-all"
                        title="Delete Seat"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            <h3 className="text-lg font-bold mb-4 relative z-10">License Summary</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Seats</p>
                <p className="text-2xl font-black">12 / 20</p>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[60%]"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Enterprise</p>
                  <p className="text-xl font-black">4</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Pro/Std</p>
                  <p className="text-xl font-black">8</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">Security Policy</h3>
            <ul className="space-y-4">
              {[
                'Single Sign-On (SSO) Active',
                'Device Trust Verification',
                '24h Audit Log Retention',
              ].map(policy => (
                <li key={policy} className="flex items-center gap-3 text-xs font-bold text-indigo-700/70">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {policy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseManager;
