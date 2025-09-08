import type { HourlyTimeEntry, SelectedDateRange } from "../types/summary.types";
import {
	useSummaryData,
	type SummaryGraphDataPoint,
	type SummaryGraphDataPointWithCost,
} from "../hooks/useSummaryData";
import styles from "../styles/summary.table.module.css";

type SummaryTablePropsType = {
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	selectedDateRange: SelectedDateRange | null;
	cost: number;
};

function SummaryTable({ selectedHourlyEntries, selectedDateRange, cost }: SummaryTablePropsType) {
	const summary = useSummaryData(selectedHourlyEntries, selectedDateRange, cost);
	if (!summary) return null;

	const showCost = cost !== 0;

	return (
		<div className={styles.tableScroll} role="region" aria-label="Summary table">
			<table className={styles.table}>
				<caption className={styles.caption}>Summary table for selected range</caption>
				<thead>
					<tr className={styles.tr}>
						<th scope="col" className={styles.th}>
							{summary.timeUnitLabel}
						</th>
						<th scope="col" className={styles.th + " " + styles.num}>
							Hours
						</th>
						{showCost && (
							<th scope="col" className={styles.th + " " + styles.num}>
								Cost
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{showCost
						? (summary.graphDataWithCost as SummaryGraphDataPointWithCost[]).map(
								(entry) => (
									<tr key={entry.name} className={styles.tr}>
										<td className={styles.td}>{entry.name}</td>
										<td className={`${styles.td} ${styles.num}`}>
											{entry.value}
										</td>
										<td className={`${styles.td} ${styles.num}`}>
											€{entry.cost}
										</td>
									</tr>
								)
						  )
						: (summary.graphData as SummaryGraphDataPoint[]).map((entry) => (
								<tr key={entry.name} className={styles.tr}>
									<td className={styles.td}>{entry.name}</td>
									<td className={`${styles.td} ${styles.num}`}>{entry.value}</td>
								</tr>
						  ))}
				</tbody>
			</table>
		</div>
	);
}

export default SummaryTable;
