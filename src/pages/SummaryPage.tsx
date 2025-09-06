import { useEffect, useMemo, useState } from "react";
import DateRangeSelector from "../components/DateRangeSelector";
import ProjectTimeList from "../components/ProjectTimeList";
import Spinner from "../components/Spinner";
import SummaryGraph from "../components/SummaryGraph";
import SummaryTotals from "../components/SummaryTotals";
import { useGetProjects } from "../hooks/useGetProjects";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import styles from "../styles/summary.page.module.css";
import type { ProjectDto } from "../types/project.types";
import type { SelectedDateRange } from "../types/summary.types";
import { filterProjectTimes, groupTimesInRangeSeconds } from "../util/getWeeksInMonth";
import SummaryTable from "../components/SummaryTable";
import { HiChartBar, HiTableCells } from "react-icons/hi2";
import Modal from "../components/Modal";
import clsx from "clsx";
import ExportSummaryForm from "../components/ExportSummaryForm";

export default function SummaryPage() {
	const [selectedRange, setSelectedRange] = useState<SelectedDateRange | undefined>(undefined);
	const [currentProject, setCurrentProject] = useState<ProjectDto>();
	const [showCostInput, setShowCostInput] = useState<boolean>(false);
	const [cost, setCost] = useState<string>("");
	const [showGraph, setShowGraph] = useState<boolean>(true);
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

	useEffect(() => {
		if (!showCostInput) setCost("");
	}, [showCostInput]);

	return (
		<div className="container">
			<Modal>
				<div className={styles.controlsCard}>
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
							<div className={styles.checkboxInput}>
								<input
									type="checkbox"
									name="show-cost"
									id="show-cost"
									checked={showCostInput}
									onChange={() => setShowCostInput((prev) => !prev)}
								/>
								<label htmlFor="show-cost">
									Would you like to input your hourly cost?
								</label>
							</div>
							{showCostInput && (
								<input
									className={styles.inputElement}
									type="number"
									min={0}
									step="0.01"
									placeholder="0"
									value={cost}
									onChange={(e) => setCost(e.target.value)}
									onBlur={(e) => {
										const value = e.target.value.trim();
										if (value === "") return;
										const numberVal = Math.max(0, Number(value));
										setCost(String(numberVal));
									}}
								/>
							)}
							{selectedRange && currentProject && (
								<Modal.Open opens="export-summary">
									<button className={clsx("btn btnOutline", styles.exportBtn)}>
										Export Summary Information to File
									</button>
								</Modal.Open>
							)}
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
											cost={cost !== "" ? Number(cost) : 0}
										/>
									</div>
									<div className={styles.vizSwitch}>
										<div className={styles.toggleRow}>
											<button
												className={clsx(
													"btn",
													"btnIcon",
													"btnOutline",
													styles.toggleBtn
												)}
												onClick={() => setShowGraph((p) => !p)}
												aria-label={showGraph ? "Show table" : "Show graph"}
												title={
													showGraph
														? "Toggle table view"
														: "Toggle graph view"
												}
											>
												{showGraph ? <HiTableCells /> : <HiChartBar />}
											</button>
										</div>
										{showGraph ? (
											<div className={styles.chartWrap}>
												<SummaryGraph
													selectedHourlyEntries={selectedHourlyEntries}
													selectedDateRange={selectedRange ?? null}
													cost={cost !== "" ? Number(cost) : 0}
												/>
											</div>
										) : (
											<div className={styles.tableWrap}>
												<SummaryTable
													selectedHourlyEntries={selectedHourlyEntries}
													selectedDateRange={selectedRange ?? null}
													cost={cost !== "" ? Number(cost) : 0}
												/>
											</div>
										)}
									</div>
								</div>
							</>
						)}
						{hasSelection && (
							<div className={styles.listCard}>
								<ProjectTimeList rows={selectedProjectTimes} cost={Number(cost)} />
							</div>
						)}
					</>
				)}
				<Modal.Window name="export-summary">
					<ExportSummaryForm
						selectedRange={selectedRange}
						currentProject={currentProject}
						selectedProjectTimes={selectedProjectTimes}
						selectedHourlyEntries={selectedHourlyEntries}
						cost={Number(cost)}
					/>
				</Modal.Window>
			</Modal>
		</div>
	);
}
