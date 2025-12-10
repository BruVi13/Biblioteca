import type { Copy as ICopy, CopyStatus, Book, Location } from '../types';

export class Copy implements ICopy {
    id: string;
    bookId: string;
    locationId: string;
    barcode: string;
    status: CopyStatus;
    book?: Book;
    location?: Location;

    constructor(data?: Partial<ICopy>) {
        this.id = data?.id || '';
        this.bookId = data?.bookId || '';
        this.locationId = data?.locationId || '';
        this.barcode = data?.barcode || '';
        this.status = data?.status || 'available';
        this.book = data?.book;
        this.location = data?.location;
    }
}
