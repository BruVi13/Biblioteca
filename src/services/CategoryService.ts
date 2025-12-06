import api from './api';
import type { Category } from '../models/Category';

export const CategoryService = {
    getAll: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    }
};
