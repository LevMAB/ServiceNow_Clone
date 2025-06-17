// backend/src/mock-db/data.ts

import { generateUuid } from './utils';

// Mock Data Interfaces (mirroring your Supabase schema)
export interface MockUser {
  id: string;
  email: string;
  password?: string; // Optional as it's not always selected
  created_at: string;
}

export interface MockRole {
  user_id: string;
  role: 'admin' | 'agent' | 'requester';
}

export interface MockCategory {
  id: number;
  name: string;
}

export interface MockPriority {
  id: number;
  name: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MockTicket {
  id: string;
  title: string;
  description: string;
  category_id: number;
  priority_id: number;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created_by: string;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockComment {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface MockTicketHistory {
  id: number;
  ticket_id: string;
  changed_by: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  changed_at: string;
}

// --- Seed Data ---
// These UUIDs match the seeded data in your Supabase migrations for consistency
export const MOCK_USER_ADMIN_ID = 'd7bed82c-5f89-4d49-9fde-10c35d304783';
export const MOCK_USER_AGENT1_ID = 'b9c9c8d2-efb9-4a77-a9f3-c53c1e5f3c81';
export const MOCK_USER_AGENT2_ID = 'f1c5b83a-99c8-4d29-b89d-71a4d740f004';
export const MOCK_USER_REQUESTER1_ID = 'e4a79e67-d751-4c47-93c7-2c3c60c938d9';
export const MOCK_USER_REQUESTER2_ID = 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0c2e';

export const MOCK_TICKET1_ID = '123e4567-e89b-12d3-a456-426614174000';
export const MOCK_TICKET2_ID = '223e4567-e89b-12d3-a456-426614174001';
export const MOCK_TICKET3_ID = '323e4567-e89b-12d3-a456-426614174002';

export const mockUsers: MockUser[] = [
  { id: MOCK_USER_ADMIN_ID, email: 'admin@test.com', password: '$2a$10$YaB6xpBcJe8Nc7rtUJCAFOO7KJoD1B3F4pHoG7XMxhX2b5HCDHzne', created_at: new Date().toISOString() },
  { id: MOCK_USER_AGENT1_ID, email: 'agent1@test.com', password: '$2a$10$YaB6xpBcJe8Nc7rtUJCAFOO7KJoD1B3F4pHoG7XMxhX2b5HCDHzne', created_at: new Date().toISOString() },
  { id: MOCK_USER_AGENT2_ID, email: 'agent2@test.com', password: '$2a$10$YaB6xpBcJe8Nc7rtUJCAFOO7KJoD1B3F4pHoG7XMxhX2b5HCDHzne', created_at: new Date().toISOString() },
  { id: MOCK_USER_REQUESTER1_ID, email: 'user1@test.com', password: '$2a$10$YaB6xpBcJe8Nc7rtUJCAFOO7KJoD1B3F4pHoG7XMxhX2b5HCDHzne', created_at: new Date().toISOString() },
  { id: MOCK_USER_REQUESTER2_ID, email: 'user2@test.com', password: '$2a$10$YaB6xpBcJe8Nc7rtUJCAFOO7KJoD1B3F4pHoG7XMxhX2b5HCDHzne', created_at: new Date().toISOString() },
];

export const mockRoles: MockRole[] = [
  { user_id: MOCK_USER_ADMIN_ID, role: 'admin' },
  { user_id: MOCK_USER_AGENT1_ID, role: 'agent' },
  { user_id: MOCK_USER_AGENT2_ID, role: 'agent' },
  { user_id: MOCK_USER_REQUESTER1_ID, role: 'requester' },
  { user_id: MOCK_USER_REQUESTER2_ID, role: 'requester' },
];

export const mockCategories: MockCategory[] = [
  { id: 1, name: 'IT Support' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'Facilities' },
  { id: 4, name: 'Finance' },
  { id: 5, name: 'Security' },
];

export const mockPriorities: MockPriority[] = [
  { id: 1, name: 'Low' },
  { id: 2, name: 'Medium' },
  { id: 3, name: 'High' },
  { id: 4, name: 'Critical' },
];

export const mockTickets: MockTicket[] = [
  {
    id: MOCK_TICKET1_ID,
    title: 'Cannot access email',
    description: 'Getting error when trying to login to email client',
    category_id: 1,
    priority_id: 2,
    status: 'Open',
    created_by: MOCK_USER_REQUESTER1_ID,
    assigned_to: MOCK_USER_AGENT1_ID,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: MOCK_TICKET2_ID,
    title: 'New laptop request',
    description: 'Need a laptop for new employee starting next week',
    category_id: 1,
    priority_id: 3,
    status: 'In Progress',
    created_by: MOCK_USER_REQUESTER2_ID,
    assigned_to: MOCK_USER_AGENT2_ID,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: MOCK_TICKET3_ID,
    title: 'Printer not working',
    description: 'Office printer showing error code 501',
    category_id: 3,
    priority_id: 1,
    status: 'Resolved',
    created_by: MOCK_USER_REQUESTER1_ID,
    assigned_to: MOCK_USER_AGENT1_ID,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

export const mockComments: MockComment[] = [
  {
    id: '423e4567-e89b-12d3-a456-426614174000',
    ticket_id: MOCK_TICKET1_ID,
    author_id: MOCK_USER_AGENT1_ID,
    content: 'Looking into this issue. Please provide your email client version.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '523e4567-e89b-12d3-a456-426614174001',
    ticket_id: MOCK_TICKET1_ID,
    author_id: MOCK_USER_REQUESTER1_ID,
    content: 'Using Outlook version 16.0.',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '623e4567-e89b-12d3-a456-426614174002',
    ticket_id: MOCK_TICKET2_ID,
    author_id: MOCK_USER_AGENT2_ID,
    content: 'Laptop has been ordered. Expected delivery in 2 days.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '723e4567-e89b-12d3-a456-426614174003',
    ticket_id: MOCK_TICKET3_ID,
    author_id: MOCK_USER_AGENT1_ID,
    content: 'Printer has been fixed. Paper jam was causing the error.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockTicketHistory: MockTicketHistory[] = [
  {
    id: 1,
    ticket_id: MOCK_TICKET2_ID,
    changed_by: MOCK_USER_AGENT2_ID,
    field_changed: 'status',
    old_value: 'Open',
    new_value: 'In Progress',
    changed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    ticket_id: MOCK_TICKET3_ID,
    changed_by: MOCK_USER_AGENT1_ID,
    field_changed: 'status',
    old_value: 'In Progress',
    new_value: 'Resolved',
    changed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    ticket_id: MOCK_TICKET3_ID,
    changed_by: MOCK_USER_AGENT1_ID,
    field_changed: 'assigned_to',
    old_value: null,
    new_value: MOCK_USER_AGENT1_ID,
    changed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Centralized mock database object
export const mockDatabase = {
  users: mockUsers,
  roles: mockRoles,
  categories: mockCategories,
  priorities: mockPriorities,
  tickets: mockTickets,
  comments: mockComments,
  ticket_history: mockTicketHistory,
};