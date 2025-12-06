import { useAuth } from '../context/AuthContext';
import { Book, Users, CalendarDays, AlertCircle } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Libros', value: '1,234', icon: Book, color: 'blue' },
        { label: 'Usuarios Activos', value: '56', icon: Users, color: 'green' },
        { label: 'Préstamos Activos', value: '23', icon: CalendarDays, color: 'orange' },
        { label: 'Multas Pendientes', value: '5', icon: AlertCircle, color: 'red' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className={styles.welcome}>
                <h2>¡Bienvenido, {user?.fullName}!</h2>
                <p>Panel de control del Sistema de Gestión Bibliotecaria.</p>
            </div>

            <div className={styles.grid}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={styles.statCard}>
                            <div className={`${styles.iconWrapper} ${styles[stat.color]}`}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
