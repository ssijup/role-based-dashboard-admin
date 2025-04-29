
import axios from 'axios';
import { Warehouse } from '@/lib/types';

// Create axios instance with authentication header
const api = axios.create({
  baseURL: 'https://role-based-dashboard-admin.onrender.com/api',
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const warehouseApi = {
  getAll: async (): Promise<Warehouse[]> => {
    const response = await api.get('/warehouses/');
    return response.data;
  },

  getById: async (id: string): Promise<Warehouse> => {
    const response = await api.get(`/warehouses/${id}/`);
    return response.data;
  },

  create: async (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> => {
    const response = await api.post('/warehouses/', warehouse);
    return response.data;
  },

  update: async (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await api.put(`/warehouses/${id}/`, warehouse);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/warehouses/${id}/`);
  }
};
