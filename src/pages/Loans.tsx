import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Loan, User, Copy } from '../types';

const Loans = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [copies, setCopies] = useState<Copy[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
    const [formData, setFormData] = useState({
        userId: '',
        copyId: '',
        loanDate: '',
        dueDate: '',
        returnDate: '',
        status: 'active'
    });

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const [loansRes, usersRes, copiesRes] = await Promise.all([
                api.get<Loan[]>('/loans'),
                api.get<User[]>('/users'),
                api.get<Copy[]>('/copies')
            ]);

            const usersMap = new Map(usersRes.data.map((u) => [u.id, u]));
            const copiesMap = new Map(copiesRes.data.map((c) => [c.id, c]));

            const joinedLoans = loansRes.data.map((loan) => ({
                ...loan,
                user: usersMap.get(loan.userId),
                copy: copiesMap.get(loan.copyId)
            }));

            setLoans(joinedLoans);
            setUsers(usersRes.data);
            setCopies(copiesRes.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentLoan) {
                await api.put(`/loans/${currentLoan.id}`, formData);
            } else {
                await api.post('/loans', formData);
            }
            fetchLoans();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving loan:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este préstamo?')) {
            try {
                await api.delete(`/loans/${id}`);
                fetchLoans();
            } catch (error) {
                console.error('Error deleting loan:', error);
            }
        }
    };

    const handleEdit = (loan: Loan) => {
        setCurrentLoan(loan);
        setFormData({
            userId: loan.userId,
            copyId: loan.copyId,
            loanDate: loan.loanDate,
            dueDate: loan.dueDate,
            returnDate: loan.returnDate || '',
            status: loan.status as string // Handle type mismatch if any, assuming string is fine for select
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentLoan(null);
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        setFormData({
            userId: '',
            copyId: '',
            loanDate: today,
            dueDate: nextWeek,
            returnDate: '',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLoan(null);
    };

    const columns = [
        { key: 'user', label: 'Usuario', render: (loan: Loan) => loan.user?.fullName || 'N/A' },
        { key: 'copy', label: 'Ejemplar', render: (loan: Loan) => loan.copy?.barcode || 'N/A' },
        { key: 'loanDate', label: 'Fecha Préstamo' },
        { key: 'dueDate', label: 'Fecha Vencimiento' },
        {
            key: 'status', label: 'Estado', render: (loan: Loan) => (
                <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    backgroundColor: loan.status === 'active' ? '#dbeafe' : '#f3f4f6',
                    color: loan.status === 'active' ? '#1e40af' : '#374151'
                }}>
                    {loan.status === 'active' ? 'Activo' : 'Devuelto'}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Préstamos</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nuevo Préstamo
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={loans}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentLoan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <select
                            className="form-input"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Usuario</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ejemplar</label>
                        <select
                            className="form-input"
                            value={formData.copyId}
                            onChange={(e) => setFormData({ ...formData, copyId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Ejemplar</option>
                            {copies.map(c => (
                                <option key={c.id} value={c.id}>{c.barcode}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha Préstamo</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.loanDate}
                            onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha Vencimiento</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha Devolución</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.returnDate}
                            onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select
                            className="form-input"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Activo</option>
                            <option value="returned">Devuelto</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Loans;
