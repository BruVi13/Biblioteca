import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus, Star } from 'lucide-react';
import type { Review, User, Book } from '../types';

const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState<Review | null>(null);
    const [formData, setFormData] = useState({
        userId: '',
        bookId: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const [reviewsRes, usersRes, booksRes] = await Promise.all([
                api.get<Review[]>('/reviews'),
                api.get<User[]>('/users'),
                api.get<Book[]>('/books')
            ]);

            const usersMap = new Map(usersRes.data.map((u) => [u.id, u]));
            const booksMap = new Map(booksRes.data.map((b) => [b.id, b]));

            const joinedReviews = reviewsRes.data.map((rev) => ({
                ...rev,
                user: usersMap.get(rev.userId),
                book: booksMap.get(rev.bookId)
            }));

            setReviews(joinedReviews);
            setUsers(usersRes.data);
            setBooks(booksRes.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentReview) {
                await api.put(`/reviews/${currentReview.id}`, formData);
            } else {
                await api.post('/reviews', formData);
            }
            fetchReviews();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving review:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
            try {
                await api.delete(`/reviews/${id}`);
                fetchReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    const handleEdit = (review: Review) => {
        setCurrentReview(review);
        setFormData({
            userId: review.userId,
            bookId: review.bookId,
            rating: review.rating,
            comment: review.comment
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentReview(null);
        setFormData({
            userId: '',
            bookId: '',
            rating: 5,
            comment: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentReview(null);
    };

    const columns = [
        { key: 'user', label: 'Usuario', render: (rev: Review) => rev.user?.fullName || 'N/A' },
        { key: 'book', label: 'Libro', render: (rev: Review) => rev.book?.title || 'N/A' },
        {
            key: 'rating', label: 'Puntuación', render: (rev: Review) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>{rev.rating}</span>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                </div>
            )
        },
        { key: 'comment', label: 'Comentario' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Reseñas</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Reseña
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={reviews}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentReview ? 'Editar Reseña' : 'Nueva Reseña'}
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
                        <label className="form-label">Puntuación (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            className="form-input"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value ? e.target.value : "0") })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Comentario</label>
                        <textarea
                            className="form-input"
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            rows={3}
                            required
                        />
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

export default Reviews;
