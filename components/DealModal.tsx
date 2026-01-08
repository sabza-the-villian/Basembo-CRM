
import React, { useState, useEffect } from 'react';
import { Deal, Contact, DealStage, IndustryInsight, Task, Interaction } from '../types';
import { getIndustryInsights } from '../services/geminiService';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  contacts: Contact[];
  tasks: Task[];
  interactions: Interaction[];
  onSave: (deal: Deal) => void;
  onAddTask: (task: Task) => void;
  onAddInteraction: (interaction: Interaction) => void;
}

const DealModal: React.FC<DealModalProps> = ({ 
  isOpen, 
  onClose, 
  deal, 
  contacts, 
  tasks, 
  interactions, 
  onSave,
  onAddTask,
  onAddInteraction
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'details' | 'news' | 'timeline'>('details');
  const [insights, setInsights] = useState<IndustryInsight | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newInteraction, setNewInteraction] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Deal>>({});

  useEffect(() => {
    if (deal) {
      setFormData(deal);
    } else {
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        company: '',
        value: 0,
        stage: DealStage.PROSPECTING,
        industry: '',
        description: '',
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        contactId: contacts[0]?.id || ''
      });
    }
    setActiveSubTab('details');
    setInsights(null);
  }, [deal, isOpen]);

  useEffect(() => {
    if (isOpen && activeSubTab === 'news' && formData.company && formData.industry && !insights) {
      fetchInsights();
    }
  }, [isOpen, activeSubTab, formData.company, formData.industry]);

  const fetchInsights = async () => {
    setLoadingNews(true);
    const data = await getIndustryInsights(formData.company || '', formData.industry || '');
    setInsights(data);
    setLoadingNews(false);
  };

  const handleSave = () => {
    onSave({ ...formData, lastUpdated: new Date().toISOString().split('T')[0] } as Deal);
    onClose();
  };

  const handleAddInteraction = () => {
    if (!newInteraction.trim() || !deal) return;
    onAddInteraction({
      id: Math.random().toString(36).substr(2, 9),
      entityId: deal.id,
      type: 'Note',
      content: newInteraction,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User'
    });
    setNewInteraction('');
  };

  if (!isOpen) return null;

  const dealInteractions = interactions.filter(i => i.entityId === deal?.id);
  const dealTasks = tasks.filter(t => t.relatedId === deal?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur">
          <div className="flex-1 mr-6">
            <input
              type="text"
              className="text-3xl font-black text-slate-900 bg-transparent border-none focus:ring-0 w-full p-0 tracking-tight"
              placeholder="Opportunity Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <div className="flex items-center gap-3 mt-2">
              <input
                type="text"
                className="text-sm font-bold text-indigo-600 bg-transparent border-none focus:ring-0 p-0 w-auto"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <input
                type="text"
                className="text-sm font-medium text-slate-500 bg-transparent border-none focus:ring-0 p-0"
                placeholder="Industry vertical"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2"/></svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-10 bg-white z-10">
          {[
            { id: 'details', label: 'Overview' },
            { id: 'timeline', label: 'Interactions & Tasks' },
            { id: 'news', label: 'Intelligence' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-6 py-5 text-sm font-extrabold transition-all border-b-2 relative ${
                activeSubTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {tab.id === 'timeline' && dealTasks.filter(t => t.status === 'Pending').length > 0 && (
                <span className="absolute top-4 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
          {activeSubTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Executive Summary</label>
                  <textarea
                    rows={6}
                    className="w-full bg-white border border-slate-200 rounded-3xl p-6 text-sm text-slate-600 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none resize-none shadow-sm transition-all"
                    placeholder="Provide a high-level strategic overview..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Economic Value</label>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-bold text-slate-400">$</span>
                       <input
                        type="number"
                        className="text-2xl font-black text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Deal Velocity</label>
                    <select
                      className="text-sm font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full cursor-pointer"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                    >
                      {Object.values(DealStage).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <aside className="space-y-8">
                 <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Counterparty</label>
                  <div className="p-6 bg-indigo-900 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
                    <select
                      className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-white/20 mb-6"
                      value={formData.contactId}
                      onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                    >
                      <option className="text-slate-900" value="">Assign Contact</option>
                      {contacts.map(c => <option className="text-slate-900" key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    
                    {formData.contactId && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                          {contacts.find(c => c.id === formData.contactId)?.name[0]}
                        </div>
                        <div>
                          <p className="font-bold">{contacts.find(c => c.id === formData.contactId)?.name}</p>
                          <p className="text-[10px] text-white/60 font-medium">{contacts.find(c => c.id === formData.contactId)?.role}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                
                <section>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Audit Log</label>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>ORIGINATED</span>
                      <span className="text-slate-600">{formData.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                      <span>LAST TOUCH</span>
                      <span className="text-slate-600">{formData.lastUpdated}</span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          ) : activeSubTab === 'timeline' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Timeline Section */}
               <section>
                  <div className="flex items-center justify-between mb-8">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity Stream</label>
                    <span className="text-[10px] font-bold text-indigo-500">{dealInteractions.length} logs</span>
                  </div>
                  
                  <div className="mb-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <textarea 
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm text-slate-600 focus:ring-0 placeholder:font-medium"
                      placeholder="Log a call, email, or internal note..."
                      rows={2}
                      value={newInteraction}
                      onChange={(e) => setNewInteraction(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                         {['Call', 'Email', 'Meeting'].map(type => (
                           <button key={type} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-[10px] font-bold text-slate-500 transition-colors uppercase">
                              {type}
                           </button>
                         ))}
                      </div>
                      <button 
                        onClick={handleAddInteraction}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10"
                      >
                        Log Activity
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                    {dealInteractions.map(inter => (
                      <div key={inter.id} className="relative pl-10">
                        <div className="absolute left-0 w-6 h-6 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center z-10 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
                          <div className="flex justify-between items-start mb-2">
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{inter.type}</p>
                             <p className="text-[10px] font-bold text-slate-400">{inter.date}</p>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{inter.content}</p>
                          <div className="mt-3 text-[10px] font-bold text-slate-400 flex items-center gap-1">
                             By <span className="text-slate-900">{inter.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {dealInteractions.length === 0 && <p className="text-sm text-slate-400 italic text-center py-10">No interactions logged yet.</p>}
                  </div>
               </section>

               {/* Tasks Section */}
               <section>
                  <div className="flex items-center justify-between mb-8">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Work</label>
                    <button 
                      onClick={() => {
                        const title = prompt("Task title:");
                        if (title && deal) {
                          onAddTask({
                            id: Math.random().toString(36).substr(2, 9),
                            title,
                            dueDate: new Date().toISOString().split('T')[0],
                            status: 'Pending',
                            priority: 'Medium',
                            relatedId: deal.id
                          });
                        }
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      + Create Task
                    </button>
                  </div>

                  <div className="space-y-4">
                    {dealTasks.map(task => (
                      <div key={task.id} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${
                        task.status === 'Completed' ? 'bg-emerald-50/50 border-emerald-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                             task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.priority[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{task.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Due {task.dueDate}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                          task.status === 'Completed' ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                    {dealTasks.length === 0 && (
                      <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-sm text-slate-400 italic">No tasks assigned to this deal.</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          ) : (
            <div className="space-y-12">
              {loadingNews ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Synthesizing Market Data</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium mt-2">Gemini is searching for real-time signals on {formData.company} and {formData.industry}.</p>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500 rounded-2xl">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Investment Thesis Signal</h3>
                      </div>
                      <p className="text-lg font-bold text-indigo-50 leading-relaxed italic pr-12">
                        "{insights?.summary || "Configure company vertical to generate signal summary."}"
                      </p>
                    </div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-700"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {insights?.news.length ? insights.news.map((item, idx) => (
                      <a 
                        key={idx} 
                        href={item.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-6 bg-white border border-slate-200 rounded-[32px] hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col justify-between group"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                             <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-black uppercase tracking-widest">{item.source || "External Source"}</span>
                             <span className="text-[10px] font-bold text-slate-400">Latest</span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight mb-3">{item.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium mb-4 flex-grow">
                            {item.snippet}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between pt-4 border-t border-slate-50">
                           <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{item.uri}</span>
                           <svg className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </a>
                    )) : !loadingNews && (
                      <div className="col-span-full py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Intel Feed Idle</p>
                        <p className="text-xs text-slate-400 mt-1">Specify company details to populate automated intelligence.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center z-10">
           <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Encrypted Session
           </div>
           <div className="flex gap-4">
              <button onClick={onClose} className="px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-2xl transition-all">
                Close View
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {deal ? 'Sync Records' : 'Initialize Deal'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DealModal;
