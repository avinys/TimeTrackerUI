import { useSummaryData } from "../hooks/useSummaryData";
import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import styles from "../styles/summary.module.css";

type Props = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
};

export default function SummaryTotals({ selectedHourlyEntries, selectedDateRange }: Props) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange);
	if (!summary) return null;

	const format = (n: number) => n.toFixed(2);

	return (
		<div className={styles.metricsContainer}>
			<Metric label="Total hours" value={format(summary.totalHours)} />
			{/* <Metric label="Avg / day (range)" value={format(summary.avgPerDay)} /> */}
			{summary.timeUnitLabel !== "Hour" && (
				<Metric label="Avg / active day" value={format(summary.avgPerActiveDay)} />
			)}
			{summary.timeUnitLabel != "Hour" && (
				<Metric label="Avg / week" value={format(summary.avgPerWeek)} />
			)}
			{summary.timeUnitLabel === "Month" && (
				<Metric label="Avg / month" value={format(summary.avgPerMonth)} />
			)}
			{/* <Metric label="Range days" value={String(summary.days)} /> */}
			<Metric label="Active days" value={String(summary.activeDays)} />
		</div>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
			<div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
			<div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
		</div>
	);
}
