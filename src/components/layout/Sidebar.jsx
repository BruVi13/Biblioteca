import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Book,
    PenTool,
    Building2,
    Tags,
    Globe,
    MapPin,
    Barcode,
    CalendarDays,
    Clock,
    AlertCircle,
    Star
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/users', icon: Users, label: 'Usuarios' },
        { path: '/books', icon: Book, label: 'Libros' },
        { path: '/authors', icon: PenTool, label: 'Autores' },
        { path: '/publishers', icon: Building2, label: 'Editoriales' },
        { path: '/categories', icon: Tags, label: 'Categorías' },
        { path: '/languages', icon: Globe, label: 'Idiomas' },
        { path: '/locations', icon: MapPin, label: 'Ubicaciones' },
        { path: '/copies', icon: Barcode, label: 'Ejemplares' },
        { path: '/loans', icon: CalendarDays, label: 'Préstamos' },
        { path: '/reservations', icon: Clock, label: 'Reservas' },
        { path: '/fines', icon: AlertCircle, label: 'Multas' },
        { path: '/reviews', icon: Star, label: 'Reseñas' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Book size={24} />
                <span>Biblioteca Digital</span>
            </div>
            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
