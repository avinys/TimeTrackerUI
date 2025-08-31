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

	console.log(
		"Fetched projects: ",
		projects?.map((p) => `${p.IsRunning}`)
	);

	if (isPending) return <Spinner />;

	return (
		<div className="container">
			<Modal>
				<ul className={styles.projectList}>
					<li className={styles.listHeader}>
						<p>Project Name</p>
						<p>Date Created</p>
						<p>State</p>
						<div className={styles.projectActions}>Actions</div>
					</li>
					{projects &&
						projects.length > 0 &&
						projects.map((p) => (
							<li key={p.id} className={styles.listItem}>
								<p>{p.name}</p>
								<p>{format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss")}</p>
								{p.isRunning ? (
									<p className={styles.timerRunningIndicator}>Running</p>
								) : (
									<p className={styles.timerNotRunningIndicator}>Stopped</p>
								)}
								<div className={styles.projectActions}>
									<Link to={`/project-time/${p.id}`} className="btn">
										View
									</Link>
									<Modal.Open opens="confirm-delete-project">
										<button
											onClick={() => setProjectToDelete(p)}
											className="btn-alt"
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
		</div>
	);
}
