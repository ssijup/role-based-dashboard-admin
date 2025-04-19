
import axios from 'axios';
import { Warehouse } from '@/lib/types';

const API_URL = 'http://localhost:8000/api/warehouses';

export const warehouseApi = {
  getAll: async (): Promise<Warehouse[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warehouse> => {
    const response = await axios.post(API_URL, warehouse);
    return response.data;
  },

  update: async (id: string, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    const response = await axios.patch(`${API_URL}/${id}/`, warehouse);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}/`);
  }
};
