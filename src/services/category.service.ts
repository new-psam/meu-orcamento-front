import {api} from './api';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types';

export const CategoryService = {
    list: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },
    create: async (data: CreateCategoryDTO) => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },
    update: async (id: string, data: UpdateCategoryDTO) => {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
}