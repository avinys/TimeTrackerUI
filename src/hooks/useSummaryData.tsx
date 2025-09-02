import { differenceInDays, format, parseISO } from "date-fns";
import { useMemo } from "react";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";

export type SummaryGraphDataPoint = { name: string; value: number };

export type SummaryStats = {
	graphData: SummaryGraphDataPoint[];
	timeUnitLabel: string;
	totalHours: number;
	avgPerActiveDay: number;
	avgPerWeek: number;
	avgPerMonth: number;
	activeDays: number;
};

const round = (v: number, d = 2) => Math.round((v + Number.EPSILON) * 10 ** d) / 10 ** d;

function groupByHour(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
	const arr = new Array(24).fill(0);
	for (const pt of projectTimes) arr[pt.hour] += pt.duration;
	return arr.map((v, i) => ({ name: `${String(i).padStart(2, "0")}:00`, value: round(v, 2) }));
}

function groupByDate(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
	const map = new Map<string, number>();
	for (const pt of projectTimes) {
		map.set(pt.date, (map.get(pt.date) ?? 0) + pt.duration);
	}
	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, value]) => ({ name, value: round(value, 2) }));
}

function groupByMonth(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
	const map = new Map<string, number>();
	for (const pt of projectTimes) {
		const month = format(parseISO(pt.date), "yyyy-MM");
		map.set(month, (map.get(month) ?? 0) + pt.duration);
	}
	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, value]) => ({ name, value: round(value, 2) }));
}

export function useSummaryData(
	entries: HourlyTimeEntry[] | undefined,
	range: SelectedDateRange | null
): SummaryStats | null {
	return useMemo(() => {
		if (!entries || !range) return null;

		let graphData: SummaryGraphDataPoint[] = [];
		let timeUnit: string;

		switch (range.type) {
			case "yearly":
				graphData = groupByMonth(entries);
				timeUnit = "Month";
				break;
			case "monthly":
			case "weekly":
				graphData = groupByDate(entries);
				timeUnit = "Date";
				break;
			case "daily":
				graphData = groupByHour(entries);
				timeUnit = "Hour";
				break;
			case "custom": {
				const fromDate = new Date(range.fromYear, range.fromMonth, range.fromDay);
				const toDate = new Date(range.toYear, range.toMonth, range.toDay);
				const differenceDays = differenceInDays(toDate, fromDate);
				if (differenceDays <= 1) {
					graphData = groupByHour(entries);
					timeUnit = "Hour";
				} else if (differenceDays <= 62) {
					graphData = groupByDate(entries);
					timeUnit = "Date";
				} else {
					graphData = groupByMonth(entries);
					timeUnit = "Month";
				}
				break;
			}
		}

		const totalHours = entries.reduce((s, e) => s + e.duration, 0);
		const days = graphData.length || 1;
		const activeDays = new Set(entries.map((e) => e.date)).size;

		const avgPerActiveDay = activeDays ? totalHours / activeDays : 0;
		const avgPerWeek = totalHours / Math.max(1, days / 7);
		const avgPerMonth = totalHours / Math.max(1, days / 30);

		return {
			graphData,
			timeUnitLabel: timeUnit,
			totalHours,
			avgPerActiveDay,
			avgPerWeek,
			avgPerMonth,
			activeDays,
		};
	}, [entries, range]);
}
