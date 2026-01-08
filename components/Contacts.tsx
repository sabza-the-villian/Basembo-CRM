
import React, { useState } from 'react';
import { Contact, IndustryInsight } from '../types';
import { getIndustryInsights } from '../services/geminiService';

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, onAddContact }) => {
  const [selectedContactInsight, setSelectedContactInsight] = useState<{ id: string, data: IndustryInsight | null, loading: boolean } | null>(null);

  const fetchContactNews = async (contact: Contact) => {
    setSelectedContactInsight({ id: contact.id, data: null, loading: true });
    const insight = await getIndustryInsights(contact.company, contact.industry);
    setSelectedContactInsight({ id: contact.id, data: insight, loading: false });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Network Directory</h3>
          <button 
            onClick={() => {
              const name = prompt("Enter contact name:");
              const company = prompt("Enter company:");
              const industry = prompt("Enter industry:");
              if (name && company && industry) {
                onAddContact({
                  id: Math.random().toString(36).substr(2, 9),
                  name,
                  role: "Executive",
                  company,
                  email: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`,
                  phone: "+1 (555) 000-0000",
                  industry
                });
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Contact
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/50">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{contact.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{contact.role} at {contact.company}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-6 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="1.5"/></svg>
                  {contact.email}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="1.5"/></svg>
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500">{contact.industry}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => fetchContactNews(contact)}
                  className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  Network Insight
                </button>
              </div>

              {/* Expanded Insight View */}
              {selectedContactInsight?.id === contact.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {selectedContactInsight.loading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      Searching live market data...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-600 italic leading-relaxed bg-slate-50 p-2 rounded">
                        {selectedContactInsight.data?.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedContactInsight.data?.news.slice(0, 2).map((item, i) => (
                          <a key={i} href={item.uri} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline font-medium truncate max-w-full">
                            → {item.title}
                          </a>
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedContactInsight(null)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                      >
                        Close Insight
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
