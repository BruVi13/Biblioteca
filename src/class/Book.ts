import type { Book as IBook, Author, Publisher, Category } from '../types';

export class Book implements IBook {
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

    constructor(data?: Partial<IBook>) {
        this.id = data?.id || '';
        this.title = data?.title || '';
        this.authorId = data?.authorId || '';
        this.publisherId = data?.publisherId || '';
        this.categoryId = data?.categoryId || '';
        this.isbn = data?.isbn || '';
        this.publicationYear = data?.publicationYear || 0;
        this.description = data?.description || '';
        this.author = data?.author;
        this.publisher = data?.publisher;
        this.category = data?.category;
    }
}
