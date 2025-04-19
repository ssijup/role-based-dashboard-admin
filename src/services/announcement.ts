
import axios from 'axios';
import { Announcement } from '@/lib/types';

const API_URL = 'http://localhost:8000/api/announcements';

export const announcementApi = {
  getAll: async (): Promise<Announcement[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Announcement> => {
    const response = await axios.post(API_URL, announcement);
    return response.data;
  },

  update: async (id: string, announcement: Partial<Announcement>): Promise<Announcement> => {
    const response = await axios.patch(`${API_URL}/${id}/`, announcement);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}/`);
  }
};
