
import React, { useState } from 'react';
import { Deal, DealStage, Contact, Task, Interaction } from '../types';
import DealModal from './DealModal';

interface PipelineProps {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  interactions: Interaction[];
  onUpdateDeal: (deal: Deal) => void;
  onAddDeal: (deal: Deal) => void;
  onAddTask: (task: Task) => void;
  onAddInteraction: (interaction: Interaction) => void;
}

const Pipeline: React.FC<PipelineProps> = ({ 
  deals, 
  contacts, 
  tasks, 
  interactions, 
  onUpdateDeal, 
  onAddDeal,
  onAddTask,
  onAddInteraction
}) => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stages = Object.values(DealStage);

  const handleCardClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh] items-start">
      {stages.map((stage) => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const totalStageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div key={stage} className="flex-shrink-0 w-80 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="mb-6 flex items-center justify-between px-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">{stage}</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{stageDeals.length} ENTITIES • ${ (totalStageValue / 1000000).toFixed(1) }M</p>
              </div>
              <button 
                onClick={handleCreateNew}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-sm flex items-center justify-center text-slate-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="space-y-4 bg-slate-200/40 p-3 rounded-2xl min-h-[500px]">
              {stageDeals.map((deal) => {
                const contact = contacts.find(c => c.id === deal.contactId);
                const dealTasks = tasks.filter(t => t.relatedId === deal.id && t.status === 'Pending');
                return (
                  <div
                    key={deal.id}
                    onClick={() => handleCardClick(deal)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-extrabold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">{deal.industry}</span>
                      <span className="text-sm font-bold text-slate-900">${(deal.value / 1000).toFixed(0)}k</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">{deal.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{deal.company}</p>
                    
                    {dealTasks.length > 0 && (
                      <div className="mt-4 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">{dealTasks.length} Pending Tasks</span>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 border-2 border-white ring-1 ring-slate-100">
                          {contact?.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{contact?.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <DealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
        contacts={contacts}
        tasks={tasks}
        interactions={interactions}
        onSave={selectedDeal ? onUpdateDeal : onAddDeal}
        onAddTask={onAddTask}
        onAddInteraction={onAddInteraction}
      />
    </div>
  );
};

export default Pipeline;
