import { differenceInSeconds, format } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { useProjectTimes } from "../context/ProjectTimesContext";
import { ProjectTimeService } from "../services/ProjectTimeService";
import styles from "../styles/projectList.module.css";
import { formatTime } from "../util/formatTime";

type ProjectTimeListProps = {
	projectId: number;
};

export default function ProjectTimeList({ projectId }: ProjectTimeListProps) {
	const { projectTimes, setProjectTimes } = useProjectTimes();

	const fetchProjectTimes = useCallback(async () => {
		const res = await ProjectTimeService.getProjectTimes(projectId);
		setProjectTimes(res);
	}, [projectId, setProjectTimes]);

	useEffect(() => {
		fetchProjectTimes();
	}, [fetchProjectTimes, projectId]);

	const handleDelete = React.useCallback(
		async (id: number) => {
			try {
				await ProjectTimeService.deleteProjectTime({
					projectTimeId: id,
				});
				setProjectTimes((prev) => prev.filter((pt) => pt.id !== id));
			} catch (error) {
				console.error("Failed to delete project time", error);
			}
		},
		[setProjectTimes]
	);

	return (
		<div className="container">
			<ul className={styles.projectList}>
				<li className={styles.listHeader}>
					<p>Start</p>
					<p>End</p>
					<p>Total time</p>
					<div className={styles.projectActions}>Actions</div>
				</li>
				{projectTimes.map((p) => (
					<li key={p.id} className={styles.listItem}>
						<p>{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}</p>
						<p>
							{p.endTime
								? format(p.endTime, "yyyy-MM-dd HH:mm:ss")
								: "ongoing"}
						</p>
						<p>
							{p.endTime
								? formatTime(
										differenceInSeconds(
											p.endTime,
											p.startTime
										)
								  )
								: ""}
						</p>
						<div className={styles.projectActions}>
							<button
								onClick={() => handleDelete(p.id)}
								className="btn-alt"
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
