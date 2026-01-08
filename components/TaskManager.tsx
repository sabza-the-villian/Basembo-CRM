
import React, { useState } from 'react';
import { Task, Deal } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  deals: Deal[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onToggleTask, deals }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('Pending');

  const filteredTasks = tasks.filter(t => filter === 'All' || t.status === filter);

  const handleAddQuickTask = () => {
    const title = prompt("Task title:");
    if (title) {
      onAddTask({
        id: Math.random().toString(36).substr(2, 9),
        title,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        priority: 'Medium'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['Pending', 'Completed', 'All'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button 
          onClick={handleAddQuickTask}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all"
        >
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTasks.map(task => {
            const relatedDeal = deals.find(d => d.id === task.relatedId);
            return (
              <div key={task.id} className="p-5 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                      task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {task.status === 'Completed' && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p className={`text-sm font-bold transition-all ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.dueDate}</span>
                      {relatedDeal && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-bold uppercase tracking-tighter">
                          {relatedDeal.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    task.priority === 'High' ? 'bg-rose-100 text-rose-600' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-slate-400 italic">No tasks found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2">Automate your workflow</h4>
            <p className="text-sm text-indigo-200 max-w-md">Basembo Capital AI can analyze your pipeline news and suggest next steps automatically.</p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-50 transition-all">
            Analyze Pipeline
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      </div>
    </div>
  );
};

export default TaskManager;
