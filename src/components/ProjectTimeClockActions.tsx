import clsx from "clsx";
import styles from "../styles/projectTimeClock.module.css";
import SpinnerMini from "./SpinnerMini";

type ProjectTimeClockActionsProps = {
	handleStart: () => void;
	handleStop: () => void;
	isOngoing: boolean;
	isStarting: boolean;
	isStopping: boolean;
};

function ProjectTimeClockActions({
	handleStart,
	handleStop,
	isOngoing,
	isStarting,
	isStopping,
}: ProjectTimeClockActionsProps) {
	return (
		<div>
			<button
				className={clsx("btn", styles.clockButton)}
				onClick={handleStart}
				disabled={isOngoing}
			>
				{isStarting ? <SpinnerMini /> : "Start"}
			</button>
			<button
				className={clsx("btn-alt", styles.clockButton)}
				onClick={handleStop}
				disabled={!isOngoing}
			>
				{isStopping ? <SpinnerMini /> : "Stop"}
			</button>
		</div>
	);
}

export default ProjectTimeClockActions;
