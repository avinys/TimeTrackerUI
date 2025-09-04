import clsx from "clsx";
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

	return (
		<div>
			<h2 className={styles.title}>Are you sure you want to delete this project time?</h2>
			<p className={styles.field}>
				<span className={styles.fieldTitle}>Start time:</span>{" "}
				{format(projectTime.startTime, "yyyy-mm-dd HH:MM:ss")}
			</p>
			<p className={styles.field}>
				<span className={styles.fieldTitle}> End time:</span>{" "}
				{format(projectTime.endTime ?? "", "yyyy-mm-dd HH:MM:ss")}
			</p>
			<p className={styles.field}>
				<span className={styles.fieldTitle}>Comment:</span>{" "}
				{projectTime.comment || "--undefined--"}
			</p>
			<button
				className={clsx("btn", styles.submitButton)}
				onClick={() => deleteProjectTime({ projectTimeId: projectTime.id })}
			>
				{isPending ? "Deleting..." : "Confirm"}
			</button>
		</div>
	);
}

export default ConfirmDeleteProjectTime;
