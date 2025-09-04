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
		<div className={styles.clockActions}>
			<button
				type="button"
				onClick={handleStart}
				disabled={isOngoing}
				className={
					isOngoing
						? clsx("btn btnOutline", styles.clockBtn)
						: clsx("btn btnPrimary", styles.clockBtn)
				}
			>
				{isStarting ? <SpinnerMini /> : "Start"}
			</button>

			<button
				type="button"
				onClick={handleStop}
				disabled={!isOngoing}
				className={
					!isOngoing
						? clsx("btn btnOutline", styles.clockBtn)
						: clsx("btn btnPrimary", styles.clockBtn)
				}
			>
				{isStopping ? <SpinnerMini /> : "Stop"}
			</button>
		</div>
	);
}

export default ProjectTimeClockActions;
