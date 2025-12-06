import { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';

const Languages = () => {
    const [languages, setLanguages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await api.get('/languages');
            setLanguages(response.data);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentLanguage) {
                await api.put(`/languages/${currentLanguage.id}`, formData);
            } else {
                await api.post('/languages', formData);
            }
            fetchLanguages();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este idioma?')) {
            try {
                await api.delete(`/languages/${id}`);
                fetchLanguages();
            } catch (error) {
                console.error('Error deleting language:', error);
            }
        }
    };

    const handleEdit = (language) => {
        setCurrentLanguage(language);
        setFormData({
            name: language.name,
            code: language.code
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentLanguage(null);
        setFormData({
            name: '',
            code: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLanguage(null);
    };

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'code', label: 'Código' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Idiomas</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nuevo Idioma
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={languages}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentLanguage ? 'Editar Idioma' : 'Nuevo Idioma'}
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
                        <label className="form-label">Código</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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

export default Languages;
