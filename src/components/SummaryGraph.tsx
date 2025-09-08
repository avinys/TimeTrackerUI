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
	cost: number;
};

export default function SummaryGraph({
	selectedHourlyEntries,
	selectedDateRange,
	cost,
}: SummaryGraphPropsType) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange, cost);
	if (!summary) return null;

	return (
		<ResponsiveContainer width="100%" aspect={16 / 9}>
			<LineChart data={cost > 0 ? summary.graphDataWithCost : summary.graphData}>
				<Line type="monotone" dataKey="value" />
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip content={<CustomTooltip />} />
			</LineChart>
		</ResponsiveContainer>
	);
}

type Point = { name: string; value: number; cost?: number };

function CustomTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: Array<{ payload: Point }>;
	label?: string;
}) {
	if (!active || !payload?.length) return null;

	const datum = payload[0]?.payload as Point | undefined;
	if (!datum) return null;

	const { value: hours, cost } = datum;
	const hasCost = cost != null && Number.isFinite(cost); // shows 0, hides undefined/null/NaN

	return (
		<div className="tt">
			<div>
				<strong>{label}</strong>
			</div>
			<div>Hours: {hours.toFixed(2)}</div>
			{hasCost && <div>Cost: €{cost!.toFixed(2)}</div>}
		</div>
	);
}
