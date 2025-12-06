import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData } from '../models/Book';
import type { Author } from '../models/Author';
import type { Publisher } from '../models/Publisher';
import type { Category } from '../models/Category';
import { BookService } from '../services/BookService';
import { AuthorService } from '../services/AuthorService';
import { PublisherService } from '../services/PublisherService';
import { CategoryService } from '../services/CategoryService';

export const useBooksController = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await BookService.getAll();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError('Error fetching books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDependencies = useCallback(async () => {
        try {
            const [authorsData, publishersData, categoriesData] = await Promise.all([
                AuthorService.getAll(),
                PublisherService.getAll(),
                CategoryService.getAll(),
            ]);
            setAuthors(authorsData);
            setPublishers(publishersData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching dependencies', err);
        }
    }, []);

    const addBook = async (data: BookFormData) => {
        try {
            await BookService.create(data);
            await fetchBooks();
            return true;
        } catch (err) {
            console.error('Error adding book', err);
            return false;
        }
    };

    const updateBook = async (id: string, data: BookFormData) => {
        try {
            await BookService.update(id, data);
            await fetchBooks();
            return true;
        } catch (err) {
            console.error('Error updating book', err);
            return false;
        }
    };

    const deleteBook = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este libro?')) {
            try {
                await BookService.delete(id);
                await fetchBooks();
                return true;
            } catch (err) {
                console.error('Error deleting book', err);
                return false;
            }
        }
        return false;
    };

    useEffect(() => {
        fetchBooks();
        fetchDependencies();
    }, [fetchBooks, fetchDependencies]);

    return {
        books,
        authors,
        publishers,
        categories,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        refresh: fetchBooks
    };
};
