import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';
import type { Category } from '../models/Category';

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get<Category[]>('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (currentCategory) {
                await api.put(`/categories/${currentCategory.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleEdit = (category: Category) => {
        setCurrentCategory(category);
        setFormData({
            name: category.name,
            description: category.description
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentCategory(null);
        setFormData({
            name: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Categorías</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Categoría
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={categories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default Categories;
