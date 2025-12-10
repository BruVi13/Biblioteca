import type { User as IUser } from '../types';

export class User implements IUser {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'librarian' | 'member';
    fullName: string;
    email: string;

    constructor(data?: Partial<IUser>) {
        this.id = data?.id || '';
        this.username = data?.username || '';
        this.password = data?.password || '';
        this.role = data?.role || 'member';
        this.fullName = data?.fullName || '';
        this.email = data?.email || '';
    }
}
