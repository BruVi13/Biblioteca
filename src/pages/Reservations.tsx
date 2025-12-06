import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Reservation, User, Book } from '../types';

const Reservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
    const [formData, setFormData] = useState({
        userId: '',
        bookId: '',
        reservationDate: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const [reservationsRes, usersRes, booksRes] = await Promise.all([
                api.get<Reservation[]>('/reservations'),
                api.get<User[]>('/users'),
                api.get<Book[]>('/books')
            ]);

            const usersMap = new Map(usersRes.data.map((u) => [u.id, u]));
            const booksMap = new Map(booksRes.data.map((b) => [b.id, b]));

            const joinedReservations = reservationsRes.data.map((res) => ({
                ...res,
                user: usersMap.get(res.userId),
                book: booksMap.get(res.bookId)
            }));

            setReservations(joinedReservations);
            setUsers(usersRes.data);
            setBooks(booksRes.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentReservation) {
                await api.put(`/reservations/${currentReservation.id}`, formData);
            } else {
                await api.post('/reservations', formData);
            }
            fetchReservations();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving reservation:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
            try {
                await api.delete(`/reservations/${id}`);
                fetchReservations();
            } catch (error) {
                console.error('Error deleting reservation:', error);
            }
        }
    };

    const handleEdit = (reservation: Reservation) => {
        setCurrentReservation(reservation);
        setFormData({
            userId: reservation.userId,
            bookId: reservation.bookId,
            reservationDate: reservation.reservationDate,
            status: reservation.status as string
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentReservation(null);
        const today = new Date().toISOString().split('T')[0];
        setFormData({
            userId: '',
            bookId: '',
            reservationDate: today,
            status: 'pending'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentReservation(null);
    };

    const columns = [
        { key: 'user', label: 'Usuario', render: (res: Reservation) => res.user?.fullName || 'N/A' },
        { key: 'book', label: 'Libro', render: (res: Reservation) => res.book?.title || 'N/A' },
        { key: 'reservationDate', label: 'Fecha Reserva' },
        {
            key: 'status', label: 'Estado', render: (res: Reservation) => (
                <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    backgroundColor: res.status === 'pending' ? '#fef3c7' : '#dcfce7',
                    color: res.status === 'pending' ? '#92400e' : '#166534'
                }}>
                    {res.status === 'pending' ? 'Pendiente' : 'Completada'}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Reservas</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Reserva
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={reservations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentReservation ? 'Editar Reserva' : 'Nueva Reserva'}
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
                        <label className="form-label">Libro</label>
                        <select
                            className="form-input"
                            value={formData.bookId}
                            onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Libro</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha Reserva</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.reservationDate}
                            onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
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
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
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

export default Reservations;
