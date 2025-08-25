import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ProjectService } from "../services/ProjectService";
import styles from "../styles/projectList.module.css";
import type { ProjectDto } from "../types/project.types";

export default function ProjectList() {
	const { user } = useAuth();
	const [projects, setProjects] = useState<ProjectDto[]>([]);

	useEffect(() => {
		if (user) {
			ProjectService.getUserProjects().then(setProjects);
		}
	}, [user]);

	return (
		<div className="container">
			<ul className={styles.projectList}>
				<li className={styles.listHeader}>
					<p>Project Name</p>
					<p>Date Created</p>
					<p>Last Work</p>
					<div className={styles.projectActions}>Actions</div>
				</li>
				{projects.map((p) => (
					<li key={p.id} className={styles.listItem}>
						<p>{p.name}</p>
						<p>{format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss")}</p>
						<p>Last Work</p>
						<div className={styles.projectActions}>
							<Link to={`/project-time/${p.id}`} className="btn">
								View
							</Link>
							<button className="btn-alt">Delete</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
