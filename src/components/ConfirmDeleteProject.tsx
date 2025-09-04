import clsx from "clsx";
import { format } from "date-fns";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/confirmDelete.module.css";
import type { ProjectDto } from "../types/project.types";
import Spinner from "./Spinner";

type ConfirmDeleteProjectProps = {
	project: ProjectDto;
	onCloseModal?: () => void;
};

function ConfirmDeleteProject({ project, onCloseModal }: ConfirmDeleteProjectProps) {
	const { isPending: timesPending, projectTimes } = useGetProjectTimes(project.id, true);
	const { isPending: deletePending, deleteProject } = useDeleteProject(onCloseModal);

	return (
		<div>
			<h2 className={styles.title}>Are you sure you want to delete this project?</h2>
			<p className={styles.field}>
				<span className={styles.fieldTitle}>Name:</span> {project.name}
			</p>
			<p className={styles.field}>
				<span className={styles.fieldTitle}>Creation date:</span>{" "}
				{format(project.createdAt, "yyyy-mm-dd HH:MM:ss")}
			</p>
			<h2 className={clsx(styles.title, styles.danger)}>
				Warning! All the project times listed below will be deleted:
			</h2>
			{timesPending ? (
				<Spinner />
			) : projectTimes && projectTimes.length ? (
				<ul className={styles.timeList}>
					{projectTimes.map((pt) => (
						<li key={pt.id} className={styles.timeItem}>
							<span>
								<span className={styles.fieldTitle}>From:</span>{" "}
								{format(pt.startTime, "yyyy-MM-dd HH:mm:ss")}
							</span>
							<span>
								<span className={styles.fieldTitle}>To:</span>{" "}
								{pt.endTime ? format(pt.endTime, "yyyy-MM-dd HH:mm:ss") : "now"}
							</span>
							{pt.comment && (
								<span>
									<span className={styles.fieldTitle}>Comment:</span> {pt.comment}
								</span>
							)}
						</li>
					))}
				</ul>
			) : (
				<p className={styles.field}>No project times.</p>
			)}

			<div className={styles.actions}>
				<button
					type="button"
					className="btn btnOutline"
					onClick={onCloseModal}
					disabled={deletePending}
				>
					Cancel
				</button>
				<button
					type="button"
					className="btn btnDanger"
					onClick={() => deleteProject({ projectId: project.id })}
					disabled={deletePending}
				>
					{deletePending ? "Deleting..." : "Confirm"}
				</button>
			</div>
		</div>
	);
}

export default ConfirmDeleteProject;
