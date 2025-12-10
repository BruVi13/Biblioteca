import type { Author as IAuthor } from '../types';

export class Author implements IAuthor {
    id: string;
    name: string;
    nationality: string;
    birthYear: number;

    constructor(data?: Partial<IAuthor>) {
        this.id = data?.id || '';
        this.name = data?.name || '';
        this.nationality = data?.nationality || '';
        this.birthYear = data?.birthYear || 0;
    }
}
