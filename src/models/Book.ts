import type { Author } from './Author';
import type { Publisher } from './Publisher';
import type { Category } from './Category';

export interface Book {
    id: string;
    title: string;
    authorId: string;
    publisherId: string;
    categoryId: string;
    isbn: string;
    publicationYear: number;
    description: string;
    author?: Author;
    publisher?: Publisher;
    category?: Category;
}

export interface BookFormData {
    title: string;
    authorId: string;
    publisherId: string;
    categoryId: string;
    isbn: string;
    publicationYear: string;
    description: string;
}
