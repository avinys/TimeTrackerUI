import { differenceInSeconds, format } from "date-fns";
import { useProjectTimes } from "../context/ProjectTimesContext";
import styles from "../styles/projectList.module.css";
import { formatTime } from "../util/formatTime";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type { ReactNode } from "react";

type ProjectTimeListProps = {
	rows?: ProjectTimeDto[];
	renderActions?: (row: ProjectTimeDto) => ReactNode;
};

export default function ProjectTimeList({ rows, renderActions }: ProjectTimeListProps) {
	const context = useProjectTimes();
	const projectTimes = rows ?? context.projectTimes;

	return (
		<ul className={styles.projectList}>
			<li className={styles.listHeader}>
				<p>Start</p>
				<p>End</p>
				<p>Total time</p>
				{renderActions && <div className={styles.projectActions}>Actions</div>}
			</li>
			{projectTimes.map((p) => (
				<li key={p.id} className={styles.listItem}>
					<p>{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}</p>
					<p>{p.endTime ? format(p.endTime, "yyyy-MM-dd HH:mm:ss") : "ongoing"}</p>
					<p>
						{p.endTime ? formatTime(differenceInSeconds(p.endTime, p.startTime)) : ""}
					</p>
					{renderActions ? (
						<div className={styles.projectActions}>{renderActions(p)} </div>
					) : null}
				</li>
			))}
		</ul>
	);
}
