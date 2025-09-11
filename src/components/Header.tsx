import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "../styles/header.module.css";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
	const { user } = useAuth();

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
				{user && <ProfileDropdown />}
			</nav>
		</header>
	);
}
