import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Fine, User, Loan } from '../types';

const Fines = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFine, setCurrentFine] = useState<Fine | null>(null);
    const [formData, setFormData] = useState({
        userId: '',
        loanId: '',
        amount: '',
        reason: '',
        status: 'unpaid'
    });

    useEffect(() => {
        fetchFines();
    }, []);

    const fetchFines = async () => {
        try {
            const [finesRes, usersRes, loansRes] = await Promise.all([
                api.get<Fine[]>('/fines'),
                api.get<User[]>('/users'),
                api.get<Loan[]>('/loans')
            ]);

            const usersMap = new Map(usersRes.data.map((u) => [u.id, u]));
            const loansMap = new Map(loansRes.data.map((l) => [l.id, l]));

            const joinedFines = finesRes.data.map((fine) => ({
                ...fine,
                user: usersMap.get(fine.userId),
                loan: loansMap.get(fine.loanId)
            }));

            setFines(joinedFines);
            setUsers(usersRes.data);
            setLoans(loansRes.data);
        } catch (error) {
            console.error('Error fetching fines:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentFine) {
                await api.put(`/fines/${currentFine.id}`, formData);
            } else {
                await api.post('/fines', formData);
            }
            fetchFines();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving fine:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta multa?')) {
            try {
                await api.delete(`/fines/${id}`);
                fetchFines();
            } catch (error) {
                console.error('Error deleting fine:', error);
            }
        }
    };

    const handleEdit = (fine: Fine) => {
        setCurrentFine(fine);
        setFormData({
            userId: fine.userId,
            loanId: fine.loanId,
            amount: String(fine.amount),
            reason: fine.reason,
            status: fine.status
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentFine(null);
        setFormData({
            userId: '',
            loanId: '',
            amount: '',
            reason: '',
            status: 'unpaid'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentFine(null);
    };

    const columns = [
        { key: 'user', label: 'Usuario', render: (fine: Fine) => fine.user?.fullName || 'N/A' },
        { key: 'amount', label: 'Monto', render: (fine: Fine) => `$${fine.amount}` },
        { key: 'reason', label: 'Motivo' },
        {
            key: 'status', label: 'Estado', render: (fine: Fine) => (
                <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    backgroundColor: fine.status === 'paid' ? '#dcfce7' : '#fee2e2',
                    color: fine.status === 'paid' ? '#166534' : '#991b1b'
                }}>
                    {fine.status === 'paid' ? 'Pagada' : 'Pendiente'}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Multas</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Multa
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={fines}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentFine ? 'Editar Multa' : 'Nueva Multa'}
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
                        <label className="form-label">Préstamo (ID)</label>
                        <select
                            className="form-input"
                            value={formData.loanId}
                            onChange={(e) => setFormData({ ...formData, loanId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Préstamo</option>
                            {loans.map(l => (
                                <option key={l.id} value={l.id}>Préstamo #{l.id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Monto</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Motivo</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select
                            className="form-input"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="unpaid">Pendiente</option>
                            <option value="paid">Pagada</option>
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

export default Fines;
