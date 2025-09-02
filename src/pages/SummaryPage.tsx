import { useMemo, useState } from "react";
import DateRangeSelector from "../components/DateRangeSelector";
import ProjectTimeList from "../components/ProjectTimeList";
import Spinner from "../components/Spinner";
import SummaryGraph from "../components/SummaryGraph";
import SummaryTotals from "../components/SummaryTotals";
import { useGetProjects } from "../hooks/useGetProjects";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/summary.module.css";
import type { ProjectDto } from "../types/project.types";
import type { SelectedDateRange } from "../types/summary.types";
import { filterProjectTimes, groupTimesInRangeSeconds } from "../util/getWeeksInMonth";

export default function SummaryPage() {
	const [selectedRange, setSelectedRange] = useState<SelectedDateRange | undefined>(undefined);
	const [currentProject, setCurrentProject] = useState<ProjectDto>();
	const {
		projects = [],
		isPending: projectsPending,
		isFetching: projectsFetching,
	} = useGetProjects();

	const projectId = currentProject?.id ?? null;
	const {
		isPending: timesPending,
		isFetching: timesFetching,
		projectTimes = [],
	} = useGetProjectTimes(projectId);

	const loadingTop = projectsPending || projectsFetching;
	const hasSelection = !!projectId && !!selectedRange;
	const loadingBottom = hasSelection && (timesPending || timesFetching);

	const selectedProjectTimes = useMemo(
		() => (selectedRange ? filterProjectTimes(projectTimes, selectedRange) : []),
		[projectTimes, selectedRange]
	);

	const selectedHourlyEntries = useMemo(
		() => (selectedRange ? groupTimesInRangeSeconds(projectTimes, selectedRange, true) : []),
		[projectTimes, selectedRange]
	);

	const handleProjectSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = Number(e.target.value);
		const selectedProject = projects?.find((p) => p.id === selectedId);
		setCurrentProject(selectedProject);
	};

	console.log("Has selection", hasSelection);
	console.log("Selected projectTimes: ", selectedProjectTimes);

	return (
		<div className="container">
			<div className={styles.inputContainer}>
				{loadingTop ? (
					<Spinner />
				) : (
					<>
						<h2 className={styles.selectTitle}>
							{currentProject
								? `Selected project: ${currentProject?.name}`
								: "Select a project"}
						</h2>
						<select
							className={styles.inputElement}
							value={currentProject ? currentProject.id : ""}
							onChange={handleProjectSelection}
						>
							<option value="" disabled hidden>
								-- select a project --
							</option>
							{projects.map((p) => (
								<option value={p.id} key={p.id}>
									{p.name}
								</option>
							))}
						</select>
						<h2 className={styles.selectTitle}>Select a time range:</h2>
						<DateRangeSelector
							selectedRange={selectedRange}
							setSelectedRange={setSelectedRange}
						/>
					</>
				)}
			</div>

			{loadingBottom ? (
				<Spinner />
			) : (
				<>
					{selectedRange && currentProject && (
						<>
							<div className={styles.summaryGrid}>
								<div className={styles.totalsWrap}>
									<SummaryTotals
										selectedHourlyEntries={selectedHourlyEntries}
										selectedDateRange={selectedRange ?? null}
									/>
								</div>

								<div className={styles.chartWrap}>
									<SummaryGraph
										selectedHourlyEntries={selectedHourlyEntries}
										selectedDateRange={selectedRange ?? null}
									/>
								</div>
							</div>
						</>
					)}
					{/* {selectedProjectTimes.length === 0 && hasSelection && (
						<p>
							No recorded times found for the selected project - "
							{currentProject?.name}", in the selected range.
						</p>
					)} */}
					{hasSelection && (
						<div className={styles.listContainer}>
							<ProjectTimeList rows={selectedProjectTimes} />
						</div>
					)}
				</>
			)}
		</div>
	);
}
