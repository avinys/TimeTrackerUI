import { differenceInSeconds, format } from "date-fns";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/projectTimeList.module.css"; // <-- new module
import type { ProjectTimeDto } from "../types/projectTime.types";
import { formatTime } from "../util/formatTime";
import Spinner from "./Spinner";

type ProjectTimeListProps = {
	rows?: ProjectTimeDto[];
	renderActions?: (pt: ProjectTimeDto) => ReactElement;
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
		<ul className={styles.list}>
			{projectTimes.length === 0 ? (
				<li className={styles.empty}>No project times found</li>
			) : (
				<>
					<li className={`${styles.row} ${styles.header}`} aria-hidden="true">
						<p>Start</p>
						<p>End</p>
						<p>Total</p>
						<p>Comment</p>
						{renderActions && <div className={styles.actionsHead}>Actions</div>}
					</li>

					{projectTimes.map((p) => (
						<li key={p.id} className={`${styles.row} ${styles.item}`}>
							<p className={styles.start}>
								{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}
							</p>
							<p className={styles.end}>
								{p.endTime ? format(p.endTime, "yyyy-MM-dd HH:mm:ss") : "ongoing"}
							</p>
							<p className={styles.total}>
								{p.endTime
									? formatTime(differenceInSeconds(p.endTime, p.startTime))
									: "--"}
							</p>
							<p className={styles.comment}>{p.comment || "—"}</p>

							{renderActions ? (
								<div className={styles.actions}>{renderActions(p)}</div>
							) : null}
						</li>
					))}
				</>
			)}
		</ul>
	);
}
