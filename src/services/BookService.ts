import api from './api';
import type { Book, BookFormData } from '../models/Book';

import { AuthorService } from './AuthorService';
import { PublisherService } from './PublisherService';
import { CategoryService } from './CategoryService';

export const BookService = {
    getAll: async () => {
        const [booksRes, authors, publishers, categories] = await Promise.all([
            api.get<Book[]>('/books'),
            AuthorService.getAll(),
            PublisherService.getAll(),
            CategoryService.getAll(),
        ]);

        const books = booksRes.data.map(book => ({
            ...book,
            author: authors.find(a => a.id === book.authorId),
            publisher: publishers.find(p => p.id === book.publisherId),
            category: categories.find(c => c.id === book.categoryId)
        }));

        return books;
    },

    getById: async (id: string) => {
        const response = await api.get<Book>(`/books/${id}`);
        // We might want to expand here too if used for details view
        return response.data;
    },

    create: async (data: BookFormData) => {
        const payload = {
            ...data,
            publicationYear: Number(data.publicationYear),
        };
        const response = await api.post<Book>('/books', payload);
        return response.data;
    },

    update: async (id: string, data: BookFormData) => {
        const payload = {
            ...data,
            publicationYear: Number(data.publicationYear),
        };
        const response = await api.put<Book>(`/books/${id}`, payload);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/books/${id}`);
    }
};
