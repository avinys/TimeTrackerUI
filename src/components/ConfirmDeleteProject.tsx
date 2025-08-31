import clsx from "clsx";
import { format } from "date-fns";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/confirmDelete.module.css";
import type { ProjectDto } from "../types/project.types";
import Spinner from "./Spinner";

type ConfirmDeleteProjectProps = {
	project: ProjectDto;
	onCloseModal: () => void;
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
				<span className={styles.fieldTitle}> Creation date:</span>{" "}
				{format(project.createdAt ?? "", "yyyy-mm-dd HH:MM:ss")}
			</p>
			<h2 className={styles.title}>
				<span>Warning.</span> All the project times listed below will be deleted:
			</h2>
			{timesPending ? (
				<Spinner />
			) : (
				<ul>
					{projectTimes?.map((pt) => (
						<li>
							<span>From: {format(pt.startTime ?? "", "yyyy-mm-dd HH:MM:ss")}</span>
							<span>
								To: {pt.endTime ? format(pt.endTime, "yyyy-mm-dd HH:MM:ss") : "now"}
							</span>
							{pt.comment !== "" && <span>Comment: {pt.comment}</span>}
						</li>
					))}
				</ul>
			)}

			<button
				className={clsx("btn", styles.submitButton)}
				onClick={() => deleteProject({ projectId: project.id })}
			>
				{deletePending ? "Deleting..." : "Confirm"}
			</button>
		</div>
	);
}

export default ConfirmDeleteProject;
