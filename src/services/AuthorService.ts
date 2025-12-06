import api from './api';
import type { Author } from '../models/Author';

export const AuthorService = {
    getAll: async () => {
        const response = await api.get<Author[]>('/authors');
        return response.data;
    }
};
