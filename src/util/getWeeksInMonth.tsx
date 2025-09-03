import {
	addWeeks,
	endOfDay,
	endOfMonth,
	format,
	isBefore,
	lastDayOfMonth,
	parse,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";

const HOUR_S = 3600;
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
const ymdFromEpochSec = (s: number) => {
	const d = new Date(s * 1000);
	return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

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

function toRangeSeconds(selected: SelectedDateRange) {
	// build inclusive-ish [start,end] in *seconds*
	// (same logic as before, just divide ms by 1000 and ceil/floor appropriately)
	const startEnd = (() => {
		switch (selected.type) {
			case "yearly":
				return {
					start: new Date(selected.year, 0, 1),
					end: new Date(selected.year, 11, 31, 23, 59, 59, 999),
				};
			case "monthly": {
				const s = new Date(selected.year, selected.month, 1);
				const e = new Date(selected.year, selected.month + 1, 0, 23, 59, 59, 999);
				return { start: s, end: e };
			}
			case "weekly":
				return {
					start: selected.weekStart,
					end: new Date(
						selected.weekEnd.getFullYear(),
						selected.weekEnd.getMonth(),
						selected.weekEnd.getDate(),
						23,
						59,
						59,
						999
					),
				};
			case "daily": {
				const s = new Date(selected.year, selected.month, selected.day);
				return {
					start: s,
					end: new Date(s.getFullYear(), s.getMonth(), s.getDate(), 23, 59, 59, 999),
				};
			}
			case "custom":
				return {
					start: new Date(selected.fromYear, selected.fromMonth, selected.fromDay),
					end: new Date(
						selected.toYear,
						selected.toMonth,
						selected.toDay,
						23,
						59,
						59,
						999
					),
				};
		}
	})();
	return {
		startS: Math.floor(startEnd.start.getTime() / 1000),
		endS: Math.ceil(startEnd.end.getTime() / 1000),
	};
}

export function groupTimesInRangeSeconds(
	projectTimes: ProjectTimeDto[],
	selected: SelectedDateRange,
	includeOngoingAsNow = true
): HourlyTimeEntry[] {
	const { startS, endS } = toRangeSeconds(selected);
	const map = new Map<string, number>(); // 'yyyy-MM-dd*H' -> hours

	for (const t of projectTimes) {
		let s = Math.floor(t.startTime.getTime() / 1000);
		let e = t.endTime
			? Math.ceil(t.endTime.getTime() / 1000)
			: includeOngoingAsNow
			? Math.ceil(Date.now() / 1000)
			: NaN;
		if (!Number.isFinite(e)) continue;

		// discard non-overlaps
		if (e <= startS || s >= endS) continue;

		// clamp to selected range
		s = Math.max(s, startS);
		e = Math.min(e, endS);
		if (e <= s) continue;

		// iterate only hours that intersect [s,e)
		let h = Math.floor(s / HOUR_S) * HOUR_S;
		const hEnd = Math.ceil(e / HOUR_S) * HOUR_S;

		for (; h < hEnd; h += HOUR_S) {
			const segStart = Math.max(s, h);
			const segEnd = Math.min(e, h + HOUR_S);
			if (segEnd <= segStart) continue;

			const hours = (segEnd - segStart) / HOUR_S; // seconds -> hours
			const key = `${ymdFromEpochSec(h)}*${new Date(h * 1000).getHours()}`;
			map.set(key, (map.get(key) ?? 0) + hours);
		}
	}

	return Array.from(map.entries()).map(([key, duration]) => {
		const [date, hourStr] = key.split("*");
		return { date, hour: parseInt(hourStr, 10), duration: Number(duration.toFixed(4)) };
	});
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
	const { startS, endS } = toRangeSeconds(selected);
	const now = Date.now();

	return times.filter((t) => {
		const s = t.startTime.getTime() / 1000;
		const e = t.endTime ? t.endTime.getTime() / 1000 : now;
		return s < endS && e > startS; // keep if intervals overlap
	});
}
