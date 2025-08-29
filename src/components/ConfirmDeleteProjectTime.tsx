import { format } from "date-fns";
import { useProjectTimes } from "../context/ProjectTimesContext";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { ProjectTimeDto } from "../types/projectTime.types";
import clsx from "clsx";
import styles from "../styles/confirmDelete.module.css";

type ConfirmDeleteProjectTimeProps = {
	projectTime: ProjectTimeDto;
};

function ConfirmDeleteProjectTime({ projectTime }: ConfirmDeleteProjectTimeProps) {
	const { setProjectTimes } = useProjectTimes();

	const handleDelete = async () => {
		try {
			await ProjectTimeService.deleteProjectTime({
				projectTimeId: projectTime.id,
			});
			setProjectTimes((prev) => prev.filter((pt) => pt.id !== projectTime.id));
		} catch (error) {
			console.error("Failed to delete project time", error);
		}
	};

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
			<button className={clsx("btn", styles.submitButton)} onClick={handleDelete}>
				Confirm
			</button>
		</div>
	);
}

export default ConfirmDeleteProjectTime;
