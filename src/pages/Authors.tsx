import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Author } from '../models/Author';

const Authors = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        nationality: '',
        birthYear: ''
    });

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await api.get<Author[]>('/authors');
            setAuthors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentAuthor) {
                await api.put(`/authors/${currentAuthor.id}`, formData);
            } else {
                await api.post('/authors', formData);
            }
            fetchAuthors();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving author:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este autor?')) {
            try {
                await api.delete(`/authors/${id}`);
                fetchAuthors();
            } catch (error) {
                console.error('Error deleting author:', error);
            }
        }
    };

    const handleEdit = (author: Author) => {
        setCurrentAuthor(author);
        setFormData({
            name: author.name,
            nationality: author.nationality,
            birthYear: String(author.birthYear)
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentAuthor(null);
        setFormData({
            name: '',
            nationality: '',
            birthYear: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentAuthor(null);
    };

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'nationality', label: 'Nacionalidad' },
        { key: 'birthYear', label: 'Año de Nacimiento' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Autores</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Autor
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={authors}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentAuthor ? 'Editar Autor' : 'Nuevo Autor'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nacionalidad</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.nationality}
                            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Año de Nacimiento</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.birthYear}
                            onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
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

export default Authors;
