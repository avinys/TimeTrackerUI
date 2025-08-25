import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	addWeeks,
	isBefore,
	format,
	eachDayOfInterval,
	startOfDay,
	endOfDay,
	parse,
	lastDayOfMonth,
	isWithinInterval,
} from "date-fns";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";

export function getWeeksInMonth(
	year: number,
	month: number
): { label: string; start: Date; end: Date }[] {
	const start = startOfWeek(startOfMonth(new Date(year, month)), {
		weekStartsOn: 1,
	});
	const end = endOfMonth(new Date(year, month));

	const weeks = [];
	let current = start;

	while (isBefore(current, end)) {
		const weekStart = current;
		const weekEnd = addWeeks(weekStart, 1);
		weeks.push({
			label: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
			start: weekStart,
			end: weekEnd,
		});
		current = weekEnd;
	}

	return weeks;
}

export function groupTimes(
	projectTimes: ProjectTimeDto[],
	{ includeOngoingAsNow = true } = {}
): HourlyTimeEntry[] {
	const hourlyMap = new Map<string, number>(); // key: 'yyyy-MM-dd*H'

	for (const time of projectTimes) {
		const start = time.startTime; // already Date
		const end = time.endTime ?? (includeOngoingAsNow ? new Date() : null);
		if (!end) continue; // skip ongoing if not including

		const days = eachDayOfInterval({ start: startOfDay(start), end: endOfDay(end) });

		for (const day of days) {
			const dateStr = format(day, "yyyy-MM-dd");
			const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
			const dayEnd = new Date(
				day.getFullYear(),
				day.getMonth(),
				day.getDate(),
				23,
				59,
				59,
				999
			);

			const clampedStart = start < dayStart ? dayStart : start;
			const clampedEnd = end > dayEnd ? dayEnd : end;

			for (let hour = 0; hour < 24; hour++) {
				const hourStart = new Date(
					day.getFullYear(),
					day.getMonth(),
					day.getDate(),
					hour,
					0,
					0,
					0
				);
				const hourEnd = new Date(
					day.getFullYear(),
					day.getMonth(),
					day.getDate(),
					hour + 1,
					0,
					0,
					0
				);

				const overlapStart = clampedStart > hourStart ? clampedStart : hourStart;
				const overlapEnd = clampedEnd < hourEnd ? clampedEnd : hourEnd;

				const ms = overlapEnd.getTime() - overlapStart.getTime();
				if (ms > 0) {
					const hours = ms / 3_600_000;
					const key = `${dateStr}*${hour}`;
					hourlyMap.set(key, (hourlyMap.get(key) ?? 0) + hours);
				}
			}
		}
	}

	const result = Array.from(hourlyMap.entries()).map(([key, duration]) => {
		const [date, hourStr] = key.split("*");
		return { date, hour: parseInt(hourStr, 10), duration: Number(duration.toFixed(4)) };
	});
	return result;
}

const parseDayKey = (s: string) => parse(s, "yyyy-MM-dd", new Date());

/** Build an inclusive [start,end] for any SelectedDateRange */
function rangeToBounds(range: SelectedDateRange): { start: Date; end: Date } {
	switch (range.type) {
		case "yearly": {
			const start = new Date(range.year, 0, 1);
			const end = endOfDay(new Date(range.year, 11, 31));
			return { start, end };
		}
		case "monthly": {
			const start = new Date(range.year, range.month, 1);
			const end = endOfDay(lastDayOfMonth(start));
			return { start, end };
		}
		case "weekly": {
			return { start: startOfDay(range.weekStart), end: endOfDay(range.weekEnd) };
		}
		case "daily": {
			const start = new Date(range.year, range.month, range.day);
			return { start: startOfDay(start), end: endOfDay(start) };
		}
		case "custom": {
			const start = new Date(range.fromYear, range.fromMonth, range.fromDay);
			const end = endOfDay(new Date(range.toYear, range.toMonth, range.toDay));
			return { start: startOfDay(start), end };
		}
	}
}

/** Keep only entries whose day lies within the selected range */
export function filterHourlyEntries(
	grouped: HourlyTimeEntry[],
	selected: SelectedDateRange
): HourlyTimeEntry[] {
	const { start, end } = rangeToBounds(selected);
	return grouped.filter((row) => {
		const day = parseDayKey(row.date);
		return day >= start && day <= end;
	});
}

export function filterProjectTimes(
	times: ProjectTimeDto[],
	selected: SelectedDateRange
): ProjectTimeDto[] {
	const interval = rangeToBounds(selected);
	return times.filter((t) => {
		if (!t.endTime) return false; // exclude ongoing
		return isWithinInterval(t.startTime, interval) && isWithinInterval(t.endTime, interval);
	});
}
