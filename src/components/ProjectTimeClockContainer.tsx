import { differenceInSeconds } from "date-fns";
import { useProjectTimes } from "../context/ProjectTimesContext";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { ProjectTimeDto } from "../types/projectTime.types";
import ProjectTimeClock from "./ProjectTimeClock";
import ProjectTimeClockActions from "./ProjectTimeClockActions";

type ProjectTimeContainerProps = {
	projectId: number;
};

export default function ProjectTimeClockContainer({ projectId }: ProjectTimeContainerProps) {
	const { projectTimes, setProjectTimes } = useProjectTimes();
	const lastTime = projectTimes[projectTimes.length - 1] || null;
	const startedTime = lastTime && lastTime.endTime ? null : lastTime;
	const elapsedTime =
		startedTime && !startedTime.endTime
			? differenceInSeconds(new Date(), startedTime.startTime)
			: 0;

	const start = startedTime ? startedTime.startTime : null;
	const end = startedTime?.endTime ? startedTime.endTime : null;
	const isOngoing = !!start && !end;

	const handleStart = async () => {
		if (isOngoing) return;

		const newProjectTime = await ProjectTimeService.createProjectTime({
			projectId,
		});
		setProjectTimes([...projectTimes, newProjectTime]);
	};

	const handleStop = async () => {
		if (!isOngoing || !lastTime) {
			return;
		}

		const updatedProjectTime: ProjectTimeDto = await ProjectTimeService.stopProjectTime({
			projectTimeId: lastTime.id,
		});

		setProjectTimes(
			projectTimes.map((pt) => (pt.id === updatedProjectTime.id ? updatedProjectTime : pt))
		);
	};

	return (
		<div>
			<ProjectTimeClock isOngoing={isOngoing} elapsedTime={elapsedTime} />
			<ProjectTimeClockActions
				isOngoing={isOngoing}
				handleStart={handleStart}
				handleStop={handleStop}
			/>
		</div>
	);
}
