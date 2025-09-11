import { Link } from "react-router-dom";
import styles from "../styles/footer.module.css";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className={styles.footer} role="contentinfo">
			<div className={styles.inner}>
				<span className={styles.copy}>© {year} TimeTracker</span>
				<nav className={styles.nav} aria-label="Footer">
					<Link to="/contact" className={styles.link}>
						Contact us
					</Link>
				</nav>
			</div>
		</footer>
	);
}
