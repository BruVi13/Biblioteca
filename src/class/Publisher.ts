import type { Publisher as IPublisher } from '../types';

export class Publisher implements IPublisher {
    id: string;
    name: string;
    country: string;

    constructor(data?: Partial<IPublisher>) {
        this.id = data?.id || '';
        this.name = data?.name || '';
        this.country = data?.country || '';
    }
}
