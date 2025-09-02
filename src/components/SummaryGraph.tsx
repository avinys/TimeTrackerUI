import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
// import { useSummary } from "../context/SummaryContext";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useSummaryData } from "../hooks/useSummaryData";
type SummaryGraphPropsType = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
};

export default function SummaryGraph({
	selectedHourlyEntries,
	selectedDateRange,
}: SummaryGraphPropsType) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange);
	if (!summary) return null;

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={summary.graphData}>
				<Line type="monotone" dataKey="value" />
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
			</LineChart>
		</ResponsiveContainer>
	);
}
