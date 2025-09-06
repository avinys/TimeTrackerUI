import { differenceInSeconds, format } from "date-fns";
import { type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/projectTimeList.module.css"; // <-- new module
import type { ProjectTimeDto } from "../types/projectTime.types";
import { formatTime } from "../util/formatTime";
import Spinner from "./Spinner";
import clsx from "clsx";
import TextExpander from "./TextExpander";

type ProjectTimeListProps = {
	rows?: ProjectTimeDto[];
	cost?: number;
	renderActions?: (pt: ProjectTimeDto) => ReactElement;
};

export default function ProjectTimeList({ rows, cost, renderActions }: ProjectTimeListProps) {
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
	const hasActions = Boolean(renderActions);

	return (
		<ul className={clsx(styles.list, !hasActions && styles.noActions, cost && styles.withCost)}>
			{projectTimes.length === 0 ? (
				<li className={styles.empty}>No project times found</li>
			) : (
				<>
					<li className={`${styles.row} ${styles.header}`} aria-hidden="true">
						<p>Start</p>
						<p>End</p>
						<p>Total</p>
						<p>Comment</p>
						{Boolean(cost) && <p>Cost</p>}
						{hasActions && <div className={styles.actionsHead}>Actions</div>}
					</li>

					{projectTimes.map((p) => (
						<li key={p.id} className={`${styles.row} ${styles.item}`}>
							<p className={styles.start}>
								{format(p.startTime, "yyyy-MM-dd HH:mm:ss")}
							</p>
							<p className={styles.end}>
								{p.endTime ? (
									// <>
									// 	<span>{format(p.endTime, "yyyy-MM-dd")}</span>{" "}
									// 	<span>{format(p.endTime, "HH:mm:ss")}</span>
									// </>
									<span>{format(p.endTime, "yyyy-MM-dd HH:mm:ss")}</span>
								) : (
									"ongoing"
								)}
							</p>
							<p className={styles.total}>
								{p.endTime
									? formatTime(differenceInSeconds(p.endTime, p.startTime))
									: "--"}
							</p>
							<p className={styles.comment}>
								{p.comment ? <TextExpander text={p.comment} /> : "—"}
							</p>
							{Boolean(cost) && p.endTime && (
								<p className={styles.cost}>
									{(
										(differenceInSeconds(p.endTime, p.startTime) / 3600) *
										cost
									).toFixed(2)}
									€
								</p>
							)}
							{hasActions ? (
								<div className={styles.actions}>{renderActions?.(p)}</div>
							) : null}
						</li>
					))}
				</>
			)}
		</ul>
	);
}
