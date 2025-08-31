import { differenceInSeconds } from "date-fns";
import { useCreateProjectTime } from "../hooks/useCreateProjectTime";
import { useGetProjectTimes } from "../hooks/useGetProjectTimes";
import { useStopProjectTime } from "../hooks/useStopProjectTime";
import ProjectTimeClock from "./ProjectTimeClock";
import ProjectTimeClockActions from "./ProjectTimeClockActions";
import Spinner from "./Spinner";

type ProjectTimeContainerProps = {
	projectId: number;
};

export default function ProjectTimeClockContainer({ projectId }: ProjectTimeContainerProps) {
	const { isPending: isStarting, startTime } = useCreateProjectTime(projectId);
	const { isPending: isStopping, stopTime } = useStopProjectTime(projectId);
	const { projectTimes, isPending } = useGetProjectTimes(projectId);
	const lastTime =
		projectTimes && projectTimes.length > 0 ? projectTimes[projectTimes.length - 1] : null;
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
		startTime();
	};

	const handleStop = async () => {
		if (!isOngoing || !lastTime) {
			return;
		}

		stopTime({
			projectTimeId: lastTime.id,
		});
	};

	if (isPending) return <Spinner />;

	return (
		<div>
			<ProjectTimeClock isOngoing={isOngoing} elapsedTime={elapsedTime} />
			<ProjectTimeClockActions
				isOngoing={isOngoing}
				isStarting={isStarting}
				isStopping={isStopping}
				handleStart={handleStart}
				handleStop={handleStop}
			/>
		</div>
	);
}
