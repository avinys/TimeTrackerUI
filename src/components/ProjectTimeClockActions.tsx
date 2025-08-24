import clsx from "clsx";
import styles from "../styles/projectTimeClock.module.css";

type ProjectTimeClockActionsProps = {
	handleStart: () => void;
	handleStop: () => void;
	isOngoing: boolean;
};

function ProjectTimeClockActions({
	handleStart,
	handleStop,
	isOngoing,
}: ProjectTimeClockActionsProps) {
	return (
		<div>
			<button
				className={clsx("btn", styles.clockButton)}
				onClick={handleStart}
				disabled={isOngoing}
			>
				Start
			</button>
			<button
				className={clsx("btn-alt", styles.clockButton)}
				onClick={handleStop}
				disabled={!isOngoing}
			>
				Stop
			</button>
		</div>
	);
}

export default ProjectTimeClockActions;
