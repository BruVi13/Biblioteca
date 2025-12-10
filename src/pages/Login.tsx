import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Book } from 'lucide-react';
import styles from './Login.module.css';
import type { User } from '../types';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.get<User[]>('/users', {
                params: { username, password },
            });
            const users = response.data;

            if (users.length > 0) {
                login(users[0]);
                navigate('/');
            } else {
                setError('Credenciales inválidas');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Book size={40} />
                    </div>
                    <h1 className={styles.title}>Biblioteca Digital</h1>
                    <p className={styles.subtitle}>Ingresa a tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="123"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Iniciar Sesión
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Credenciales de prueba:</p>
                    <small>Usuario: admin / Pass: 123</small>
                </div>
            </div>
        </div>
    );
};

export default Login;
