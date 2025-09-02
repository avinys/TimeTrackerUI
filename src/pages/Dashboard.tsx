import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProjectList from "../components/ProjectList";
import "../styles/index.css";
import styles from "../styles/dashboard.module.css";
import Modal from "../components/Modal";
import CreateProjectForm from "../components/CreateProjectForm";
import clsx from "clsx";

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<div className="container">
			<Modal>
				<div className={styles.titleContainer}>
					<h1>Dashboard</h1>
					<p>Welcome, {user?.username}!</p>
					<h2>Your projects:</h2>
				</div>
				<ProjectList />
				<div className={styles.actionsContainer}>
					<Modal.Open opens="create-project">
						<button className={clsx("btn", styles.actionButton)}>
							Create New Project
						</button>
					</Modal.Open>
					<Link to="/summary" className={clsx("btn", styles.actionButton)}>
						View Summary
					</Link>
				</div>
				<Modal.Window name="create-project">
					<CreateProjectForm />
				</Modal.Window>
			</Modal>
		</div>
	);
}
