import type { Language as ILanguage } from '../types';

export class Language implements ILanguage {
    id: string;
    name: string;
    code: string;

    constructor(data?: Partial<ILanguage>) {
        this.id = data?.id || '';
        this.name = data?.name || '';
        this.code = data?.code || '';
    }
}
