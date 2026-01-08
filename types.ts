
export enum DealStage {
  PROSPECTING = 'Prospecting',
  QUALIFICATION = 'Qualification',
  DUE_DILIGENCE = 'Due Diligence',
  PROPOSAL = 'Proposal',
  CLOSING = 'Closing',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  licenseTier: 'Standard' | 'Pro' | 'Enterprise';
  permissions: string[];
  status: 'Active' | 'Pending' | 'Revoked';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  linkedin?: string;
}

export interface Interaction {
  id: string;
  entityId: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  content: string;
  date: string;
  author: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  relatedId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Completed';
  leadsTarget: number;
  budget: number;
  startDate: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  contactId: string;
  industry: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
}

export interface NewsItem {
  title: string;
  uri: string;
  snippet?: string;
  source?: string;
}

export interface IndustryInsight {
  summary: string;
  news: NewsItem[];
}
