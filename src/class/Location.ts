import type { Location as ILocation } from '../types';

export class Location implements ILocation {
    id: string;
    code: string;
    description: string;

    constructor(data?: Partial<ILocation>) {
        this.id = data?.id || '';
        this.code = data?.code || '';
        this.description = data?.description || '';
    }
}
