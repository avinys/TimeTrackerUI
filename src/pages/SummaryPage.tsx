import { useEffect, useState } from "react";
import DateRangeSelector from "../components/DateRangeSelector";
import SummaryGraph from "../components/SummaryGraph";
import { ProjectService } from "../services/ProjectService";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { ProjectDto } from "../types/project.types";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import { formatDate } from "../util/formatTime";
import { filterHourlyEntries, filterProjectTimes, groupTimes } from "../util/getWeeksInMonth";
import styles from "../styles/summary.module.css";

export default function SummaryPage() {
	const [selectedRange, setSelectedRange] = useState<SelectedDateRange>();
	const [projects, setProjects] = useState<ProjectDto[]>([]);
	const [currentProject, setCurrentProject] = useState<ProjectDto>();
	const [selectedHourlyEntries, setSelectedHourlyEntries] = useState<HourlyTimeEntry[]>([]);
	const [selectedProjectTimes, setSelectedProjectTimes] = useState<ProjectTimeDto[]>([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const userProjects = await ProjectService.getUserProjects();
			setProjects(userProjects);
		};
		fetchProjects();
	}, []);

	useEffect(() => {
		const fetchProjectTimes = async () => {
			if (selectedRange !== undefined && currentProject !== undefined) {
				const projectTimes = await ProjectTimeService.getProjectTimes(currentProject.id);
				const grouped = groupTimes(projectTimes);
				const filteredProjectTimes = filterProjectTimes(projectTimes, selectedRange);
				const filteredHourlyEntries = filterHourlyEntries(grouped, selectedRange);

				setSelectedProjectTimes(filteredProjectTimes);
				setSelectedHourlyEntries(filteredHourlyEntries);
			} else {
				setSelectedProjectTimes([]);
			}
		};
		fetchProjectTimes();
	}, [selectedRange, currentProject, setSelectedProjectTimes]);

	const handleProjectSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = e.target.value;
		const selectedProject = projects.find((p) => p.id === parseInt(selectedId));
		setCurrentProject(selectedProject);
	};

	return (
		<div className="container">
			<div className={styles.inputContainer}>
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
			</div>
			{currentProject && selectedRange && selectedHourlyEntries.length > 0 && (
				<div className={styles.graphContainer}>
					<SummaryGraph
						selectedHourlyEntries={selectedHourlyEntries}
						selectedDateRange={selectedRange}
					/>
				</div>
			)}
			{selectedProjectTimes.length == 0 && selectedRange && currentProject && (
				<p>
					No recorded times found for the selected project - "{currentProject?.name}", in
					the selected range.
				</p>
			)}
			<ul>
				{selectedProjectTimes?.map((p) => (
					<li key={p.id}>
						{p.id} --- {formatDate(p.startTime)} ---{" "}
						{formatDate(p.endTime ? p.endTime : "")}
					</li>
				))}
			</ul>
		</div>
	);
}
