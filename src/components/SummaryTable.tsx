import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import {
	useSummaryData,
	type SummaryGraphDataPoint,
	type SummaryGraphDataPointWithCost,
} from "../hooks/useSummaryData";
import styles from "../styles/summary.module.css";

type SummaryTablePropsType = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
	cost: number;
};

function SummaryTable({ selectedHourlyEntries, selectedDateRange, cost }: SummaryTablePropsType) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange, cost);
	if (!summary) return null;

	return (
		<table className={styles.summaryTable}>
			<caption>Summary table for selected range</caption>
			<thead>
				<tr>
					<th scope="col">{summary.timeUnitLabel}</th>
					<th scope="col">Hours</th>
					{summary.graphDataWithCost.length > 0 && <th scope="col">Cost</th>}
				</tr>
			</thead>
			<tbody>
				{cost !== 0
					? (summary.graphDataWithCost as SummaryGraphDataPointWithCost[]).map(
							(entry) => (
								<tr key={entry.name}>
									<td>{entry.name}</td>
									<td>{entry.value}</td>
									<td>€{entry.cost}</td>
								</tr>
							)
					  )
					: (summary.graphData as SummaryGraphDataPoint[]).map((entry) => (
							<tr key={entry.name}>
								<td>{entry.name}</td>
								<td>{entry.value}</td>
							</tr>
					  ))}
			</tbody>
		</table>
	);
}

export default SummaryTable;
