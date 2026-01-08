
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import Contacts from './components/Contacts';
import TaskManager from './components/TaskManager';
import CampaignTracker from './components/CampaignTracker';
import SignUp from './components/SignUp';
import LicenseManager from './components/LicenseManager';
import { Deal, Contact, DealStage, Task, Interaction, Campaign, User } from './types';

// Initial Mock Data
const INITIAL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sarah Jenkins', role: 'CEO', email: 'sarah@fintechflow.com', phone: '+1 (555) 123-4567', company: 'FintechFlow', industry: 'Financial Technology' },
  { id: 'c2', name: 'Marcus Thorne', role: 'Founder', email: 'marcus@greenpulse.io', phone: '+1 (555) 987-6543', company: 'GreenPulse', industry: 'Renewable Energy' },
  { id: 'c3', name: 'Elena Rodriguez', role: 'CTO', email: 'elena@cyberguard.ai', phone: '+1 (555) 246-8135', company: 'CyberGuard', industry: 'Cybersecurity' },
];

const INITIAL_DEALS: Deal[] = [
  { id: 'd1', title: 'Series A Investment', company: 'FintechFlow', value: 2500000, stage: DealStage.DUE_DILIGENCE, contactId: 'c1', industry: 'Financial Technology', description: 'Expanding B2B payment infrastructure across SEA.', createdAt: '2024-01-15', lastUpdated: '2024-02-10' },
  { id: 'd2', title: 'Seed Round', company: 'GreenPulse', value: 750000, stage: DealStage.PROSPECTING, contactId: 'c2', industry: 'Renewable Energy', description: 'Next-gen solar storage solutions.', createdAt: '2024-02-01', lastUpdated: '2024-02-05' },
  { id: 'd3', title: 'Late Seed Extension', company: 'CyberGuard', value: 1200000, stage: DealStage.PROPOSAL, contactId: 'c3', industry: 'Cybersecurity', description: 'AI-driven threat detection for mid-market enterprises.', createdAt: '2023-12-20', lastUpdated: '2024-01-25' },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Review FintechFlow Cap Table', dueDate: '2024-03-20', status: 'Pending', priority: 'High', relatedId: 'd1' },
  { id: 't2', title: 'Schedule meeting with GreenPulse CTO', dueDate: '2024-03-22', status: 'Pending', priority: 'Medium', relatedId: 'd2' },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'cam1', name: 'Q1 Fintech Outreach', status: 'Active', leadsTarget: 50, budget: 5000, startDate: '2024-01-01' },
  { id: 'cam2', name: 'Sustainable Energy Summit', status: 'Draft', leadsTarget: 200, budget: 15000, startDate: '2024-05-15' },
];

const INITIAL_INTERACTIONS: Interaction[] = [
  { id: 'i1', entityId: 'd1', type: 'Meeting', content: 'Initial pitch was strong. Sarah is very focused on user growth metrics.', date: '2024-02-10', author: 'Associate One' },
];

type View = 'dashboard' | 'pipeline' | 'contacts' | 'tasks' | 'campaigns' | 'governance';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [activeTab, setActiveTab] = useState<View>('dashboard');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [interactions, setInteractions] = useState<Interaction[]>(INITIAL_INTERACTIONS);

  const handleSignUp = (userData: { name: string; email: string; role: string }) => {
    setCurrentUser({
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      licenseTier: 'Enterprise',
      status: 'Active',
      permissions: ['All']
    });
  };

  const handleSignOut = () => setCurrentUser(null);

  if (!currentUser) {
    return <SignUp onSignUp={handleSignUp} />;
  }

  const addDeal = (newDeal: Deal) => setDeals([...deals, newDeal]);
  const updateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };
  
  const addContact = (newContact: Contact) => setContacts([...contacts, newContact]);

  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const updateTaskStatus = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  const addInteraction = (interaction: Interaction) => setInteractions([interaction, ...interactions]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab: View) => setActiveTab(tab)} 
        onSignOut={handleSignOut}
        userName={currentUser.name || ''}
      />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <header className="sticky top-0 z-10 flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Basembo Intelligence Engine</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-2">
              <p className="text-sm font-black text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{currentUser.role}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-600/20">
              {currentUser.name?.[0]}
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              deals={deals} 
              contacts={contacts} 
              tasks={tasks.filter(t => t.status === 'Pending')}
              campaigns={campaigns}
            />
          )}
          {activeTab === 'pipeline' && (
            <Pipeline 
              deals={deals} 
              contacts={contacts} 
              tasks={tasks}
              interactions={interactions}
              onUpdateDeal={updateDeal} 
              onAddDeal={addDeal}
              onAddTask={addTask}
              onAddInteraction={addInteraction}
            />
          )}
          {activeTab === 'contacts' && <Contacts contacts={contacts} onAddContact={addContact} />}
          {activeTab === 'tasks' && (
            <TaskManager 
              tasks={tasks} 
              onAddTask={addTask} 
              onToggleTask={updateTaskStatus} 
              deals={deals}
            />
          )}
          {activeTab === 'campaigns' && <CampaignTracker campaigns={campaigns} />}
          {activeTab === 'governance' && <LicenseManager />}
        </div>
      </main>
    </div>
  );
};

export default App;
