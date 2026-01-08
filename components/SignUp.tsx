
import React, { useState } from 'react';

interface SignUpProps {
  onSignUp: (userData: { name: string; email: string; role: string }) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Associate' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSignUp(formData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-600/40 mb-6">
            B
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Basembo Capital</h1>
          <p className="text-slate-400 mt-2 font-medium">Internal Intelligence Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 font-medium"
              placeholder="e.g. Alexander Vance"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
            <input 
              required
              type="email" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 font-medium"
              placeholder="vance@basembo.capital"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Role</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="Associate" className="bg-slate-900">Investment Associate</option>
              <option value="Partner" className="bg-slate-900">Managing Partner</option>
              <option value="Analyst" className="bg-slate-900">Portfolio Analyst</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            Access Terminal
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Access restricted to Basembo Capital employees.<br/> 
          <span className="text-indigo-400 cursor-pointer hover:underline">Contact System Admin</span> if lost.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
