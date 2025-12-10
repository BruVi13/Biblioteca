import type { Review as IReview, User, Book } from '../types';

export class Review implements IReview {
    id: string;
    userId: string;
    bookId: string;
    rating: number;
    comment: string;
    user?: User;
    book?: Book;

    constructor(data?: Partial<IReview>) {
        this.id = data?.id || '';
        this.userId = data?.userId || '';
        this.bookId = data?.bookId || '';
        this.rating = data?.rating || 0;
        this.comment = data?.comment || '';
        this.user = data?.user;
        this.book = data?.book;
    }
}
