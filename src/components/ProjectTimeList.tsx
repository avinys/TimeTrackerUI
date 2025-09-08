import { differenceInSeconds, format } from "date-fns";
import { useMemo, useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/projectTimeList.module.css"; // <-- new module
import type { ProjectTimeDto, SortByProjectTimes as SortBy } from "../types/projectTime.types";
import { formatTime } from "../util/formatTime";
import Spinner from "./Spinner";
import clsx from "clsx";
import TextExpander from "./TextExpander";
import ProjectTimeListOptions from "./ProjectTimeListOptions";

type ProjectTimeListProps = {
	rows?: ProjectTimeDto[];
	cost?: number;
	renderActions?: (pt: ProjectTimeDto) => ReactElement;
};

export default function ProjectTimeList({ rows, cost, renderActions }: ProjectTimeListProps) {
	const [sortBy, setSortBy] = useState<SortBy>("date-desc");
	const [showCommentExpander, setShowCommentExpander] = useState(false);
	const { projectId } = useParams();
	const pid = projectId ? Number(projectId) : null;
	const enabled = rows === undefined && pid !== null;

	const {
		isPending,
		isFetching,
		projectTimes: fetchedProjectTimes,
	} = useGetProjectTimes(pid, enabled);

	const projectTimes = useMemo<ProjectTimeDto[]>(
		() => rows ?? fetchedProjectTimes ?? [],
		[rows, fetchedProjectTimes]
	);

	const duration = (t: ProjectTimeDto) =>
		t.endTime ? differenceInSeconds(t.endTime, t.startTime) : 0;

	const sortedTimes = useMemo(() => {
		const arr = [...projectTimes];
		switch (sortBy) {
			case "date-asc":
				return arr.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
			case "duration-desc":
				return arr.sort((a, b) => duration(b) - duration(a));
			case "duration-asc":
				return arr.sort((a, b) => duration(a) - duration(b));
			case "date-desc":
			default:
				return arr.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
		}
	}, [projectTimes, sortBy]);

	const loading = enabled && (isPending || isFetching);
	if (loading) return <Spinner />;

	const hasActions = Boolean(renderActions);

	return (
		<div className={styles.listWrap}>
			<ProjectTimeListOptions
				sortBy={sortBy}
				setSortBy={setSortBy}
				showExpander={showCommentExpander}
				setShowExpander={setShowCommentExpander}
			/>

			<ul
				className={clsx(
					styles.list,
					!hasActions && styles.noActions,
					cost && styles.withCost
				)}
			>
				{sortedTimes.length === 0 ? (
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

						{sortedTimes.map((p) => (
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
								<div className={styles.comment}>
									{p.comment ? (
										showCommentExpander ? (
											<TextExpander text={p.comment} />
										) : (
											p.comment
										)
									) : (
										"—"
									)}
								</div>
								{cost != undefined && p.endTime && (
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
		</div>
	);
}
