import { differenceInSeconds, format } from "date-fns";
import type { ReactElement } from "react";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/projectList.module.css";
import type { ProjectTimeDto } from "../types/projectTime.types";
import { formatTime } from "../util/formatTime";
import ConfirmDeleteProjectTime from "./ConfirmDeleteProjectTime";
import EditProjectTimeForm from "./EditProjectTimeForm";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";

type ProjectTimeListProps = {
	rows?: ProjectTimeDto[];
	renderActions?: ReactElement;
};

export default function ProjectTimeList({ rows, renderActions }: ProjectTimeListProps) {
	const { projectId } = useParams();
	const pid = projectId ? Number(projectId) : null;
	const enabled = rows === undefined && pid !== null;
	const {
		isPending,
		isFetching,
		projectTimes: fetchedProjectTimes,
	} = useGetProjectTimes(pid, enabled);

	const loading = enabled && (isPending || isFetching);
	if (loading) return <Spinner />;

	const projectTimes = rows ?? fetchedProjectTimes ?? [];

	return (
		<ul className={styles.projectList}>
			<li className={styles.listHeader}>
				<p>Start</p>
				<p>End</p>
				<p>Total time</p>
				<p>Comment</p>
				{renderActions && <div className={styles.projectActions}>Actions</div>}
			</li>
			{projectTimes.map((p) => (
				<li key={p.id} className={styles.listItem}>
					<Modal>
						<p>{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}</p>
						<p>{p.endTime ? format(p.endTime, "yyyy-MM-dd HH:mm:ss") : "ongoing"}</p>
						<p>
							{p.endTime
								? formatTime(differenceInSeconds(p.endTime, p.startTime))
								: "--"}
						</p>
						<p>{p.comment ? p.comment : "--"}</p>
						{renderActions ? (
							<div className={styles.projectActions}>{renderActions} </div>
						) : null}

						<Modal.Window name="edit">
							<EditProjectTimeForm projectTime={p} />
						</Modal.Window>
						<Modal.Window name="delete">
							<ConfirmDeleteProjectTime projectTime={p} />
						</Modal.Window>
					</Modal>
				</li>
			))}
		</ul>
	);
}
