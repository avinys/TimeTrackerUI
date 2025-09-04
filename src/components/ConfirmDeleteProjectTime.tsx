import { format } from "date-fns";
import { useDeleteProjectTime } from "../hooks/useDeleteProjectTime";
import styles from "../styles/confirmDelete.module.css";
import type { ProjectTimeDto } from "../types/projectTime.types";

type ConfirmDeleteProjectTimeProps = {
	projectTime: ProjectTimeDto;
	onCloseModal?: () => void;
};

function ConfirmDeleteProjectTime({ projectTime, onCloseModal }: ConfirmDeleteProjectTimeProps) {
	const { isPending, deleteProjectTime } = useDeleteProjectTime(
		projectTime.projectId,
		onCloseModal
	);

	const start = format(projectTime.startTime, "yyyy-mm-dd HH:MM:ss");
	const end = projectTime.endTime ? format(projectTime.endTime, "yyyy-mm-dd HH:MM:ss") : "now";

	return (
		<div>
			<h2 className={styles.title}>Are you sure you want to delete this project time?</h2>
			<p className={styles.field}>
				<span className={styles.fieldTitle}>Start time:</span> {start}
			</p>
			<p className={styles.field}>
				<span className={styles.fieldTitle}> End time:</span> {end}
			</p>
			{projectTime.comment && (
				<p className={styles.field}>
					<span className={styles.fieldTitle}>Comment:</span> {projectTime.comment}
				</p>
			)}
			<div className={styles.actions}>
				<button
					type="button"
					className="btn btnOutline"
					onClick={onCloseModal}
					disabled={isPending}
				>
					Cancel
				</button>
				<button
					type="button"
					className="btn btnDanger"
					onClick={() => deleteProjectTime({ projectTimeId: projectTime.id })}
					disabled={isPending}
				>
					{isPending ? "Deleting..." : "Confirm"}
				</button>
			</div>
		</div>
	);
}

export default ConfirmDeleteProjectTime;
