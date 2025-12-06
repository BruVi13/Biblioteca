import api from './api';
import type { Publisher } from '../models/Publisher';

export const PublisherService = {
    getAll: async () => {
        const response = await api.get<Publisher[]>('/publishers');
        return response.data;
    }
};
