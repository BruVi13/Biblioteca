import type { Fine as IFine, FineStatus, User, Loan } from '../types';

export class Fine implements IFine {
    id: string;
    userId: string;
    loanId: string;
    amount: number;
    reason: string;
    status: FineStatus;
    user?: User;
    loan?: Loan;

    constructor(data?: Partial<IFine>) {
        this.id = data?.id || '';
        this.userId = data?.userId || '';
        this.loanId = data?.loanId || '';
        this.amount = data?.amount || 0;
        this.reason = data?.reason || '';
        this.status = data?.status || 'unpaid';
        this.user = data?.user;
        this.loan = data?.loan;
    }
}
