import type { Category as ICategory } from '../types';

export class Category implements ICategory {
    id: string;
    name: string;
    description: string;

    constructor(data?: Partial<ICategory>) {
        this.id = data?.id || '';
        this.name = data?.name || '';
        this.description = data?.description || '';
    }
}
