import { Link } from "react-router-dom";
import { HiClock, HiChartBar, HiCloudArrowDown, HiShieldCheck } from "react-icons/hi2";
import styles from "../styles/welcome.module.css";

export default function WelcomePage() {
	return (
		<main className={styles.page}>
			<section className={styles.hero}>
				<h1 className={styles.title}>Track time. Get clarity.</h1>
				<p className={styles.subtitle}>
					TimeTracker helps you log hours across projects, visualize progress, and export
					clean reports in seconds.
				</p>

				<div className={styles.ctaRow}>
					<Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
						Get started
					</Link>
					<Link to="/login" className={`${styles.btn} ${styles.btnGhost}`}>
						I already have an account
					</Link>
				</div>

				<ul className={styles.highlights}>
					<li>
						<HiClock /> One-click start/stop timers
					</li>
					<li>
						<HiChartBar /> Smart summaries & graphs
					</li>
					<li>
						<HiCloudArrowDown /> CSV export for clients & payroll
					</li>
					<li>
						<HiShieldCheck /> Secure JWT auth & role-based access
					</li>
				</ul>
			</section>

			<section className={styles.featureGrid} aria-label="Key features">
				<article className={styles.card}>
					<h3>Project-based tracking</h3>
					<p>
						Create projects, log sessions, and keep notes. Switch context without losing
						accuracy.
					</p>
				</article>
				<article className={styles.card}>
					<h3>Flexible summaries</h3>
					<p>
						Filter by week or custom range. See totals by day/hour with interactive
						charts.
					</p>
				</article>
				<article className={styles.card}>
					<h3>Export that just works</h3>
					<p>
						Download CSV with totals, graphs, tables, and raw entries—including cost
						fields.
					</p>
				</article>
				<article className={styles.card}>
					<h3>Built right</h3>
					<p>
						React + TypeScript front-end with a .NET 8 API and MySQL database, following
						clean and scalable architecture.
					</p>
				</article>
			</section>

			<section className={styles.meta}>
				<div className={styles.stat}>
					<span className={styles.statValue}>100% free</span>
					<span className={styles.statLabel}>open-source/ portfolio project</span>
				</div>
				<div className={styles.stat}>
					<span className={styles.statValue}>Multi-project</span>
					<span className={styles.statLabel}>track all in one place</span>
				</div>
				<div className={styles.stat}>
					<span className={styles.statValue}>&lt;5s</span>
					<span className={styles.statLabel}>to export CSV report</span>
				</div>
			</section>
		</main>
	);
}
