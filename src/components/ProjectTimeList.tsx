import { differenceInSeconds, format } from "date-fns";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/projectList.module.css";
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
	console.log("Project times: ", projectTimes);

	return (
		<ul className={styles.projectList}>
			{projectTimes.length === 0 ? (
				<li>No project times found</li>
			) : (
				<>
					<li className={styles.listHeader}>
						<p>Start</p>
						<p>End</p>
						<p>Total time</p>
						<p>Comment</p>
						{renderActions && <div className={styles.projectActions}>Actions</div>}
					</li>
					{projectTimes.map((p) => (
						<li key={p.id} className={styles.listItem}>
							<p>{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}</p>
							<p>
								{p.endTime ? format(p.endTime, "yyyy-MM-dd HH:mm:ss") : "ongoing"}
							</p>
							<p>
								{p.endTime
									? formatTime(differenceInSeconds(p.endTime, p.startTime))
									: "--"}
							</p>
							<p>{p.comment ? p.comment : "--"}</p>
							{renderActions ? (
								<div className={styles.projectActions}>{renderActions(p)}</div>
							) : null}
						</li>
					))}
				</>
			)}
		</ul>
	);
}
