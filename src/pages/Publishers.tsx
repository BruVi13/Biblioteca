import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Publisher } from '../models/Publisher';
import api from '../services/api';

const Publishers = () => {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPublisher, setCurrentPublisher] = useState<Publisher | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        country: ''
    });

    useEffect(() => {
        fetchPublishers();
    }, []);

    const fetchPublishers = async () => {
        try {

            const response = await api.get<Publisher[]>('/publishers');
            setPublishers(response.data);
        } catch (error) {
            console.error('Error fetching publishers:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentPublisher) {
                await api.put(`/publishers/${currentPublisher.id}`, formData);
            } else {
                await api.post('/publishers', formData);
            }
            fetchPublishers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving publisher:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta editorial?')) {
            try {
                await api.delete(`/publishers/${id}`);
                fetchPublishers();
            } catch (error) {
                console.error('Error deleting publisher:', error);
            }
        }
    };

    const handleEdit = (publisher: Publisher) => {
        setCurrentPublisher(publisher);
        setFormData({
            name: publisher.name,
            country: publisher.country
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentPublisher(null);
        setFormData({
            name: '',
            country: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPublisher(null);
    };

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'country', label: 'País' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Editoriales</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Editorial
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={publishers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentPublisher ? 'Editar Editorial' : 'Nueva Editorial'}
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
                        <label className="form-label">País</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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

export default Publishers;
