import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import styles from './Layout.module.css';

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.userMenu}>
                        <div className={styles.userInfo}>
                            <UserIcon size={20} />
                            <span>{user?.fullName || 'Usuario'}</span>
                        </div>
                        <button onClick={logout} className={styles.logoutBtn} title="Cerrar sesión">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
