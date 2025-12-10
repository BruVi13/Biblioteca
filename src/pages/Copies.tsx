import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Copy, Book, Location } from '../types';

const Copies = () => {
    const [copies, setCopies] = useState<Copy[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCopy, setCurrentCopy] = useState<Copy | null>(null);
    const [formData, setFormData] = useState({
        bookId: '',
        locationId: '',
        barcode: '',
        status: 'available'
    });

    useEffect(() => {
        fetchCopies();
    }, []);

    const fetchCopies = async () => {
        try {
            const [copiesRes, booksRes, locationsRes] = await Promise.all([
                api.get<Copy[]>('/copies'),
                api.get<Book[]>('/books'),
                api.get<Location[]>('/locations')
            ]);

            const booksMap = new Map(booksRes.data.map((b) => [b.id, b]));
            const locationsMap = new Map(locationsRes.data.map((l) => [l.id, l]));

            const joinedCopies = copiesRes.data.map((copy) => ({
                ...copy,
                book: booksMap.get(copy.bookId),
                location: locationsMap.get(copy.locationId)
            }));

            setCopies(joinedCopies);
            setBooks(booksRes.data);
            setLocations(locationsRes.data);
        } catch (error) {
            console.error('Error fetching copies:', error);
        }
    };



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentCopy) {
                await api.put(`/copies/${currentCopy.id}`, formData);
            } else {
                await api.post('/copies', formData);
            }
            fetchCopies();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving copy:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este ejemplar?')) {
            try {
                await api.delete(`/copies/${id}`);
                fetchCopies();
            } catch (error) {
                console.error('Error deleting copy:', error);
            }
        }
    };

    const handleEdit = (copy: Copy) => {
        setCurrentCopy(copy);
        setFormData({
            bookId: copy.bookId,
            locationId: copy.locationId,
            barcode: copy.barcode,
            status: copy.status
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentCopy(null);
        setFormData({
            bookId: '',
            locationId: '',
            barcode: '',
            status: 'available'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCopy(null);
    };

    const columns = [
        { key: 'barcode', label: 'Código de Barras' },
        { key: 'book', label: 'Libro', render: (copy: Copy) => copy.book?.title || 'N/A' },
        { key: 'location', label: 'Ubicación', render: (copy: Copy) => copy.location?.code || 'N/A' },
        {
            key: 'status', label: 'Estado', render: (copy: Copy) => (
                <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    backgroundColor: copy.status === 'available' ? '#dcfce7' : '#fee2e2',
                    color: copy.status === 'available' ? '#166534' : '#991b1b'
                }}>
                    {copy.status === 'available' ? 'Disponible' : 'Prestado'}
                </span>
            )
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Ejemplares</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nuevo Ejemplar
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={copies}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentCopy ? 'Editar Ejemplar' : 'Nuevo Ejemplar'}
            >
                <form onSubmit={handleSubmit}>
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
                        <label className="form-label">Ubicación</label>
                        <select
                            className="form-input"
                            value={formData.locationId}
                            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Ubicación</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>{l.code} - {l.description}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Código de Barras</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
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
                            <option value="available">Disponible</option>
                            <option value="loaned">Prestado</option>
                            <option value="maintenance">Mantenimiento</option>
                            <option value="lost">Perdido</option>
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

export default Copies;
