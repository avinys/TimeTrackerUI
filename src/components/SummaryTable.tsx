import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import { useSummaryData } from "../hooks/useSummaryData";
import styles from "../styles/summary.module.css";

type SummaryTablePropsType = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
};

function SummaryTable({ selectedHourlyEntries, selectedDateRange }: SummaryTablePropsType) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange);
	if (!summary) return null;

	return (
		<table className={styles.summaryTable}>
			<caption>Summary table for selected range</caption>
			<thead>
				<tr>
					<th scope="col">{summary.timeUnitLabel}</th>
					<th scope="col">Hours</th>
				</tr>
			</thead>
			<tbody>
				{summary.graphData.map((entry) => (
					<tr>
						<td>{entry.name}</td>
						<td>{entry.value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default SummaryTable;
