import type { Reservation as IReservation, ReservationStatus, User, Book } from '../types';

export class Reservation implements IReservation {
    id: string;
    userId: string;
    bookId: string;
    reservationDate: string;
    status: ReservationStatus;
    user?: User;
    book?: Book;

    constructor(data?: Partial<IReservation>) {
        this.id = data?.id || '';
        this.userId = data?.userId || '';
        this.bookId = data?.bookId || '';
        this.reservationDate = data?.reservationDate || '';
        this.status = data?.status || 'pending';
        this.user = data?.user;
        this.book = data?.book;
    }
}
