import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import { useSummaryData } from "../hooks/useSummaryData";
import styles from "../styles/summary.totals.module.css";

type SummaryTotalsProps = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
	cost: number;
};

export default function SummaryTotals({
	selectedHourlyEntries,
	selectedDateRange,
	cost,
}: SummaryTotalsProps) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange, cost);
	if (!summary) return null;

	const fmt = (n: number) => n.toFixed(2);
	const showCost = cost !== 0;

	return (
		<div className={styles.metrics}>
			<Metric label="Total hours" value={fmt(summary.totalHours)} />

			{summary.timeUnitLabel !== "Hour" && (
				<Metric label="Avg / active day" value={fmt(summary.avgPerActiveDay)} />
			)}

			{summary.timeUnitLabel !== "Hour" && (
				<Metric label="Avg / week" value={fmt(summary.avgPerWeek)} />
			)}

			{summary.timeUnitLabel === "Month" && (
				<Metric label="Avg / month" value={fmt(summary.avgPerMonth)} />
			)}

			<Metric label="Active days" value={String(summary.activeDays)} />

			{showCost && (
				<>
					<Metric label="Total cost" value={fmt(summary.totalHoursWithCost)} isCurrency />
					{summary.timeUnitLabel !== "Hour" && (
						<Metric
							label="Avg cost / active day"
							value={fmt(summary.avgPerActiveDayWithCost)}
							isCurrency
						/>
					)}
					{summary.timeUnitLabel !== "Hour" && (
						<Metric
							label="Avg cost / week"
							value={fmt(summary.avgPerWeekWithCost)}
							isCurrency
						/>
					)}
					{summary.timeUnitLabel === "Month" && (
						<Metric
							label="Avg cost / month"
							value={fmt(summary.avgPerMonthWithCost)}
							isCurrency
						/>
					)}
				</>
			)}
		</div>
	);
}

function Metric({
	label,
	value,
	isCurrency = false,
}: {
	label: string;
	value: string;
	isCurrency?: boolean;
}) {
	return (
		<div className={styles.metric}>
			<div className={styles.label}>{label}</div>
			<div className={`${styles.value} ${isCurrency ? styles.valueCurrency : ""}`}>
				{isCurrency ? value : value}
			</div>
		</div>
	);
}
