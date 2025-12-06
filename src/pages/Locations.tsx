import { useState, useEffect } from 'react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        description: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentLocation) {
                await api.put(`/locations/${currentLocation.id}`, formData);
            } else {
                await api.post('/locations', formData);
            }
            fetchLocations();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta ubicación?')) {
            try {
                await api.delete(`/locations/${id}`);
                fetchLocations();
            } catch (error) {
                console.error('Error deleting location:', error);
            }
        }
    };

    const handleEdit = (location) => {
        setCurrentLocation(location);
        setFormData({
            code: location.code,
            description: location.description
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentLocation(null);
        setFormData({
            code: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLocation(null);
    };

    const columns = [
        { key: 'code', label: 'Código' },
        { key: 'description', label: 'Descripción' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Ubicaciones</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nueva Ubicación
                </button>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={locations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentLocation ? 'Editar Ubicación' : 'Nueva Ubicación'}
            >
                <form onSubmit={handleSubmit}>
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
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default Locations;
