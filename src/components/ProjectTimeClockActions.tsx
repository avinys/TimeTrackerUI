import clsx from "clsx";
import styles from "../styles/projectTimeClock.module.css";

type ProjectTimeClockActionsProps = {
	handleStart: () => void;
	handleStop: () => void;
};

function ProjectTimeClockActions({
	handleStart,
	handleStop,
}: ProjectTimeClockActionsProps) {
	return (
		<div>
			<button
				className={clsx("btn", styles.clockButton)}
				onClick={handleStart}
			>
				Start
			</button>
			<button
				className={clsx("btn-alt", styles.clockButton)}
				onClick={handleStop}
			>
				Stop
			</button>
		</div>
	);
}

export default ProjectTimeClockActions;
