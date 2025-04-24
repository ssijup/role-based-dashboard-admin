
import axios from 'axios';

const BASE_URL = '/api';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: number;
  category_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const categoryApi = {
  getAll: async () => {
    const response = await axios.get<Category[]>(`${BASE_URL}/categories/`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get<Category>(`${BASE_URL}/categories/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Category>) => {
    const response = await axios.post<Category>(`${BASE_URL}/categories/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<Category>) => {
    const response = await axios.put<Category>(`${BASE_URL}/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${BASE_URL}/categories/${id}/`);
  }
};

export const subcategoryApi = {
  getAll: async () => {
    const response = await axios.get<SubCategory[]>(`${BASE_URL}/subcategories/`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get<SubCategory>(`${BASE_URL}/subcategories/${id}/`);
    return response.data;
  },

  create: async (data: Partial<SubCategory>) => {
    const response = await axios.post<SubCategory>(`${BASE_URL}/subcategories/`, data);
    return response.data;
  },

  update: async (id: number, data: Partial<SubCategory>) => {
    const response = await axios.put<SubCategory>(`${BASE_URL}/subcategories/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${BASE_URL}/subcategories/${id}/`);
  }
};
