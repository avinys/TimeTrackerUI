import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLogout } from "../hooks/useLogout";
import styles from "../styles/header.module.css";
import SpinnerMini from "./SpinnerMini";

export default function Header() {
	const { user } = useAuth();
	const { isPending, logout } = useLogout();
	console.log("Header: ", user);

	const handleLogout = async () => {
		logout();
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
							{isPending ? <SpinnerMini /> : "Logout"}
						</button>
					</>
				)}
			</nav>
		</header>
	);
}
