import type { Loan as ILoan, LoanStatus, User, Copy } from '../types';

export class Loan implements ILoan {
    id: string;
    userId: string;
    copyId: string;
    loanDate: string;
    dueDate: string;
    returnDate: string | null;
    status: LoanStatus;
    user?: User;
    copy?: Copy;

    constructor(data?: Partial<ILoan>) {
        this.id = data?.id || '';
        this.userId = data?.userId || '';
        this.copyId = data?.copyId || '';
        this.loanDate = data?.loanDate || '';
        this.dueDate = data?.dueDate || '';
        this.returnDate = data?.returnDate || null;
        this.status = data?.status || 'active';
        this.user = data?.user;
        this.copy = data?.copy;
    }
}
