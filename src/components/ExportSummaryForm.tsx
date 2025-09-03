import { useState } from "react";
import styles from "../styles/exportForm.module.css";
import clsx from "clsx";
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
		setExportOptions((prev) => ({
			...prev,
			[option]: !prev[option],
		}));
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
		<div className="container">
			<div className={styles.formContainer}>
				<h2 className={styles.title}>Please select options for export</h2>
				<div className={styles.inputGroup}>
					<input
						type="checkbox"
						id="totals"
						checked={exportOptions.totals}
						onChange={() => handleOptionChange("totals")}
					/>
					<label htmlFor="totals">Include Totals section?</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="checkbox"
						id="summary-table"
						checked={exportOptions.summaryTable}
						onChange={() => handleOptionChange("summaryTable")}
					/>
					<label htmlFor="summary-table">Include Summary Table section?</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="checkbox"
						id="pt-list"
						checked={exportOptions.projectTimesList}
						onChange={() => handleOptionChange("projectTimesList")}
					/>
					<label htmlFor="pt-list">Include Project Times List section?</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="checkbox"
						id="cost"
						checked={exportOptions.includeCost}
						onChange={() => handleOptionChange("includeCost")}
					/>
					<label htmlFor="cost">Include costs?</label>
				</div>
				<div>
					<button onClick={handleExport} className={clsx("btn", styles.submitButton)}>
						Export
					</button>
				</div>
			</div>
		</div>
	);
}

export default ExportSummaryForm;
