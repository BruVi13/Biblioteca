export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'librarian' | 'member';
  fullName: string;
  email: string;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
}

export interface Publisher {
  id: string;
  name: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Location {
  id: string;
  code: string;
  description: string;
}

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

export type CopyStatus = 'available' | 'loaned' | 'maintenance' | 'lost';

export interface Copy {
  id: string;
  bookId: string;
  locationId: string;
  barcode: string;
  status: CopyStatus;
  book?: Book;
  location?: Location;
}

export type LoanStatus = 'active' | 'returned';

export interface Loan {
  id: string;
  userId: string;
  copyId: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  user?: User;
  copy?: Copy;
}

export type ReservationStatus = 'pending' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string;
  status: ReservationStatus;
  user?: User;
  book?: Book;
}

export type FineStatus = 'unpaid' | 'paid';

export interface Fine {
  id: string;
  userId: string;
  loanId: string;
  amount: number;
  reason: string;
  status: FineStatus;
  user?: User;
  loan?: Loan;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  user?: User;
  book?: Book;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}
