import clsx from "clsx";
import { useState } from "react";
import styles from "../styles/summary.exportForm.module.css";
import type {
	ExportData,
	ExportGenerationOptions,
	HourlyTimeEntry,
	SelectedDateRange,
} from "../types/summary.types";
import type { ProjectDto } from "../types/project.types";
import type { ProjectTimeDto } from "../types/projectTime.types";
import { useSummaryData } from "../hooks/useSummaryData";
import { downloadCSV, generateCSV } from "../util/exportFormatting";

type ExportSummaryformProps = {
	selectedRange: SelectedDateRange | undefined;
	currentProject: ProjectDto | undefined;
	selectedProjectTimes: ProjectTimeDto[] | undefined;
	selectedHourlyEntries: HourlyTimeEntry[] | undefined;
	cost: number;
};

function ExportSummaryForm({
	selectedRange,
	currentProject,
	selectedHourlyEntries,
	selectedProjectTimes,
	cost = 0,
}: ExportSummaryformProps) {
	const [exportOptions, setExportOptions] = useState<ExportGenerationOptions>({
		totals: true,
		summaryTable: true,
		projectTimesList: true,
		includeCost: true,
	});

	const summary = useSummaryData(selectedHourlyEntries, selectedRange ?? null, cost);

	const handleOptionChange = (option: keyof ExportGenerationOptions) => {
		setExportOptions((prev) => ({ ...prev, [option]: !prev[option] }));
	};

	const handleExport = () => {
		if (!currentProject || !selectedRange || !summary) {
			alert("Please select a project and date range first");
			return;
		}

		const exportData: ExportData = {
			currentProject,
			selectedRange,
			selectedHourlyEntries: selectedHourlyEntries || [],
			selectedProjectTimes: selectedProjectTimes || [],
			summary,
			cost: Number(cost) || 0,
		};

		const csvContent = generateCSV(exportOptions, exportData);
		const filename = `${currentProject.name
			.replace(/[^a-z0-9]/gi, "_")
			.toLowerCase()}_summary_${new Date().toISOString().split("T")[0]}.csv`;

		downloadCSV(csvContent, filename);
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.formCard}>
				<h2 className={styles.title}>Export options</h2>

				<div className={styles.options}>
					<label className={styles.optionRow} htmlFor="totals">
						<input
							id="totals"
							type="checkbox"
							checked={exportOptions.totals}
							onChange={() => handleOptionChange("totals")}
						/>
						<span>Include Totals section</span>
					</label>

					<label className={styles.optionRow} htmlFor="summary-table">
						<input
							id="summary-table"
							type="checkbox"
							checked={exportOptions.summaryTable}
							onChange={() => handleOptionChange("summaryTable")}
						/>
						<span>Include Summary Table section</span>
					</label>

					<label className={styles.optionRow} htmlFor="pt-list">
						<input
							id="pt-list"
							type="checkbox"
							checked={exportOptions.projectTimesList}
							onChange={() => handleOptionChange("projectTimesList")}
						/>
						<span>Include Project Times List</span>
					</label>

					<label className={styles.optionRow} htmlFor="cost">
						<input
							id="cost"
							type="checkbox"
							checked={exportOptions.includeCost}
							onChange={() => handleOptionChange("includeCost")}
						/>
						<span>Include costs</span>
					</label>
				</div>

				<div className={styles.actions}>
					<button
						onClick={handleExport}
						className={clsx("btn", "btnPrimary", styles.exportBtn)}
					>
						Export CSV
					</button>
				</div>
			</div>
		</div>
	);
}

export default ExportSummaryForm;
