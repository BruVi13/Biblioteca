import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import type { User } from '../types';

interface UserFormData {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role: User['role'];
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'member',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get<User[]>('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await api.put(`/users/${currentUser.id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setFormData({
            username: user.username,
            password: user.password,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        });
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setCurrentUser(null);
        setFormData({
            username: '',
            password: '',
            fullName: '',
            email: '',
            role: 'member',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const columns = [
        { key: 'fullName', label: 'Nombre Completo' },
        { key: 'username', label: 'Usuario' },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Rol',
            render: (user: User) => (
                <span
                    style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        backgroundColor: user.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                        color: user.role === 'admin' ? '#1e40af' : '#374151',
                    }}
                >
                    {user.role === 'admin'
                        ? 'Administrador'
                        : user.role === 'librarian'
                            ? 'Bibliotecario'
                            : 'Miembro'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Gestión de Usuarios</h1>
                <button onClick={handleOpenModal} className="btn btn-primary">
                    <Plus size={20} />
                    Nuevo Usuario
                </button>
            </div>

            <div className="card">
                <Table columns={columns} data={users} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-input"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value as User['role'] })
                            }
                        >
                            <option value="member">Miembro</option>
                            <option value="librarian">Bibliotecario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem',
                        }}
                    >
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

export default Users;
