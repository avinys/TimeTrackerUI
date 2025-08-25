import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
// import { useSummary } from "../context/SummaryContext";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type SummaryGraphDataPoint = {
	name: string;
	value: number;
};

type SummaryGraphPropsType = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
};

function groupByHour(projectTimes: HourlyTimeEntry[] | undefined): SummaryGraphDataPoint[] {
	if (projectTimes === undefined) return [];

	const arr = new Array(24).fill(0);

	for (const pt of projectTimes) {
		arr[pt.hour] += pt.duration;
	}

	return arr.map((value, i) => ({
		name: `${String(i).padStart(2, "0")}:00`,
		value,
	}));
}

function groupByDate(projectTimes: HourlyTimeEntry[] | undefined): SummaryGraphDataPoint[] {
	if (projectTimes === undefined) return [];

	const map = new Map<string, number>();

	for (const pt of projectTimes) {
		map.set(pt.date, (map.get(pt.date) ?? 0) + pt.duration);
	}

	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, value]) => ({ name, value }));
}

function groupByMonth(projectTimes: HourlyTimeEntry[] | undefined): SummaryGraphDataPoint[] {
	if (projectTimes === undefined) return [];

	const map = new Map<string, number>();

	for (const pt of projectTimes) {
		const month = format(parseISO(pt.date), "yyy-MM");
		map.set(month, (map.get(month) ?? 0) + pt.duration);
	}

	return Array.from(map.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, value]) => ({ name, value }));
}

// function filterProjectTimes(
// 	groupedHourlyProjectTimes: HourlyTimeEntry[],
// 	selectedDateRange: SelectedDateRange
// ): HourlyTimeEntry[] {
// 	// console.log("filterProjectTimes in SummaryGraph.tsx: groupedTimes:", groupedHourlyProjectTimes);
// 	// console.log("filterProjectTimes in SummaryGraph.tsx: selectedDateRange:", selectedDateRange);
// 	return groupedHourlyProjectTimes.filter((entry) => {
// 		const entryDate = new Date(entry.date);

// 		const entryYear = entryDate.getFullYear();
// 		const entryMonth = entryDate.getMonth();
// 		const entryDay = entryDate.getDate();

// 		switch (selectedDateRange.type) {
// 			case "yearly":
// 				return entryYear === selectedDateRange.year;
// 			case "monthly":
// 				return (
// 					entryYear === selectedDateRange.year && entryMonth === selectedDateRange.month
// 				);
// 			case "weekly":
// 				return (
// 					entryDate >= new Date(selectedDateRange.weekStart) &&
// 					entryDate <= new Date(selectedDateRange.weekEnd)
// 				);
// 			case "daily":
// 				return (
// 					entryYear === selectedDateRange.year &&
// 					entryMonth === selectedDateRange.month &&
// 					entryDay === selectedDateRange.day
// 				);
// 			case "custom":
// 				const fromDate = new Date(selectedDateRange.from);
// 				const toDate = new Date(selectedDateRange.to);
// 				return entryDate >= fromDate && entryDate <= toDate;
// 			default:
// 				return false;
// 		}
// 	});
// }

export default function SummaryGraph({
	selectedHourlyEntries,
	selectedDateRange,
}: SummaryGraphPropsType) {
	const [graphData, setGraphData] = useState<SummaryGraphDataPoint[]>([]);
	// if (!hourlyGroupedProjectTimes || !selectedDateRange) {
	// 	return <h2>Something went wrong with the summary data. Please try refreshing the page.</h2>;
	// }

	console.log("Graph renders");

	useEffect(() => {
		let tempData: SummaryGraphDataPoint[] = [];
		switch (selectedDateRange?.type) {
			case "yearly":
				tempData = groupByMonth(selectedHourlyEntries);
				setGraphData(tempData);
				break;
			case "monthly":
				tempData = groupByDate(selectedHourlyEntries);
				setGraphData(tempData);
				break;
			case "weekly":
				tempData = groupByDate(selectedHourlyEntries);
				setGraphData(tempData);
				break;
			case "daily":
				tempData = groupByHour(selectedHourlyEntries);
				setGraphData(tempData);
				break;
			case "custom": {
				const fromDate = new Date(
					selectedDateRange.fromYear,
					selectedDateRange.fromMonth,
					selectedDateRange.fromDay
				);
				const toDate = new Date(
					selectedDateRange.toYear,
					selectedDateRange.toMonth,
					selectedDateRange.toDay
				);

				const differenceDays = differenceInDays(toDate, fromDate);

				if (differenceDays <= 1) {
					tempData = groupByHour(selectedHourlyEntries);
				} else if (differenceDays <= 62) {
					tempData = groupByDate(selectedHourlyEntries);
				} else {
					tempData = groupByMonth(selectedHourlyEntries);
				}
				setGraphData(tempData);
				break;
			}
			default:
				tempData = [];
				break;
		}
	}, [selectedHourlyEntries, selectedDateRange]);

	return (
		<LineChart width={600} height={300} data={graphData}>
			<Line type="monotone" dataKey="value" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);
}
