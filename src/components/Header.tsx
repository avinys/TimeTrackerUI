import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthService } from '../services/AuthService';
import styles from '../styles/header.module.css';

export default function Header() {
    const {user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await AuthService.logout();
        setUser(null);
        navigate('/');
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navContainer}>
                <Link to="/" className={styles.logo}>TimeTracker</Link>
                {!user && (
                    <>
                        <Link to="/login" className={styles.navLink}>Login</Link>
                        <Link to="/register" className={styles.navLink}>Register</Link>
                    </>
                )}
                {user && (
                    <>
                        <Link to="/dashboard" className={styles.navLink}>Track Time</Link>
                        <button onClick={handleLogout} className={styles.navButton}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    )
}