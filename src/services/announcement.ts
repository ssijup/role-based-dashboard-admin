
import axios from 'axios';
import { Announcement } from '@/lib/types';

// Use the same axios instance with auth interceptor from warehouse service
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const announcementApi = {
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements/');
    return response.data;
  },

  getById: async (id: string): Promise<Announcement> => {
    const response = await api.get(`/announcements/${id}/`);
    return response.data;
  },

  create: async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Announcement> => {
    const response = await api.post('/announcements/', announcement);
    return response.data;
  },

  update: async (id: string, announcement: Partial<Announcement>): Promise<Announcement> => {
    const response = await api.put(`/announcements/${id}/`, announcement);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}/`);
  }
};
