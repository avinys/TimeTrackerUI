import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthService } from "../services/AuthService";
import styles from "../styles/header.module.css";

export default function Header() {
	const { user, setUser } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await AuthService.logout();
		setUser(null);
		navigate("/");
	};

	return (
		<header className={styles.header}>
			<nav className={styles.navContainer}>
				<Link to="/" className={styles.logo}>
					TimeTracker
				</Link>
				{!user && (
					<>
						<Link to="/login" className="btn btnLink btn--md">
							Login
						</Link>
						<Link to="/register" className="btn btnLink btn--md">
							Register
						</Link>
					</>
				)}
				{user && (
					<>
						<Link to="/dashboard" className="btn btnLink btn--md">
							Track Time
						</Link>
						<button onClick={handleLogout} className="btn btnLink btn--md">
							Logout
						</button>
					</>
				)}
			</nav>
		</header>
	);
}
