import { format } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProjects } from "../hooks/useGetProjects";
import styles from "../styles/projectList.module.css";
import type { ProjectDto } from "../types/project.types";
import ConfirmDeleteProject from "./ConfirmDeleteProject";
import Modal from "./Modal";
import Spinner from "./Spinner";

export default function ProjectList() {
	const { isPending, projects } = useGetProjects();
	const [projectToDelete, setProjectToDelete] = useState<ProjectDto | null>(null);

	if (isPending) return <Spinner />;

	if (!projects || projects.length === 0) {
		return (
			<div className={styles.empty}>
				<p>No projects yet.</p>
				<p>Create your first project to start tracking time.</p>
			</div>
		);
	}

	return (
		<Modal>
			<ul className={styles.projectList}>
				<li className={`${styles.listRow} ${styles.listHeader}`} aria-hidden="true">
					<p>Project Name</p>
					<p>Date Created</p>
					<p>State</p>
					<div>Actions</div>
				</li>

				{projects.map((p) => (
					<li key={p.id} className={`${styles.listRow} ${styles.listItem}`}>
						<p className={styles.name}>{p.name}</p>
						<p className={styles.date}>
							{format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss")}
						</p>
						{p.isRunning ? (
							<p className={styles.timerRunningIndicator}>Running</p>
						) : (
							<p className={styles.timerNotRunningIndicator}>Stopped</p>
						)}

						<div className={styles.projectActions}>
							<Link to={`/project-time/${p.id}`} className="btn btnSubtle btn--md">
								View
							</Link>

							<Modal.Open opens="confirm-delete-project">
								<button
									type="button"
									onClick={() => setProjectToDelete(p)}
									className="btn btnDanger btn--md"
								>
									Delete
								</button>
							</Modal.Open>
						</div>
					</li>
				))}
			</ul>

			<Modal.Window name="confirm-delete-project">
				{projectToDelete && <ConfirmDeleteProject project={projectToDelete} />}
			</Modal.Window>
		</Modal>
	);
}
