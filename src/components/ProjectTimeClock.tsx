import { useEffect, useRef, useState } from "react";
import styles from "../styles/projectTimeClock.module.css";
import type { ProjectTimeDto } from "../types/projectTime.types";
import { formatTime } from "../util/formatTime";

type ProjectTimeClockProps = {
	startedTime: ProjectTimeDto | null;
	elapsedTime: number;
};

export default function ProjectTimeClock({
	startedTime,
	elapsedTime,
}: ProjectTimeClockProps) {
	const [elapsed, setElapsed] = useState(elapsedTime);
	const intervalRef = useRef<number | null>(null);

	const start = startedTime ? startedTime.startTime : null;
	const end = startedTime?.endTime ? startedTime.endTime : null;
	const isOngoing = start && !end;

	useEffect(() => {
		if (elapsedTime) setElapsed(elapsedTime);
	}, [elapsedTime]);

	useEffect(() => {
		if (isOngoing) {
			intervalRef.current = window.setInterval(() => {
				setElapsed((prev) => prev + 1);
			}, 1000);
		} else {
			setElapsed(0);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isOngoing]);

	return (
		<div className={styles.clockContainer}>
			<h2 className={styles.clockTime}>{formatTime(elapsed)}</h2>
		</div>
	);
}
