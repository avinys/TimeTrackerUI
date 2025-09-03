import { differenceInSeconds, format } from "date-fns";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type {
	ExportData,
	ExportGenerationOptions,
	SelectedDateRange,
} from "../types/summary.types";
import { formatTime } from "./formatTime";

export function generateCSV(options: ExportGenerationOptions, data: ExportData) {
	const csvSections: string[] = [];

	// Header section with project and date range info
	csvSections.push(generateHeaderSection(data));

	// Add sections based on options
	if (options.totals) {
		csvSections.push(generateTotalsSection(data));
	}

	if (options.summaryTable) {
		csvSections.push(generateSummaryTableSection(data, options.includeCost));
	}

	if (options.projectTimesList) {
		csvSections.push(generateProjectTimesSection(data.selectedProjectTimes));
	}

	return csvSections.join("\n\n");
}

function generateHeaderSection(data: ExportData) {
	const lines: string[] = [
		"PROJECT SUMMARY EXPORT",
		"======================",
		`Export Date,${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
		"",
		`Project name,${escapeCSVValue(data.currentProject.name)}`,
		`Selected range,${formatDateRange(data.selectedRange)}`,
		...(data.cost > 0 ? [`Hourly rate,€${data.cost.toFixed(2)}`] : []),
	];
	return lines.join("\n");
}

function generateTotalsSection(data: ExportData) {
	const lines: string[] = ["SUMMARY TOTALS", "======================", "", "Metric, Value"];
	const { summary, cost } = data;

	lines.push(`Total Hours,${summary.totalHours}`);

	if (summary.timeUnitLabel !== "Hour")
		lines.push(`Average per Active Day,${summary.avgPerActiveDay}`);

	if (summary.timeUnitLabel !== "Hour") lines.push(`Average per Week,${summary.avgPerWeek}`);

	if (summary.timeUnitLabel === "Month" && summary.avgPerMonth)
		lines.push(`Average per Month,${summary.avgPerMonth}`);

	lines.push(`Active Days,${summary.activeDays}`);

	if (cost > 0) {
		lines.push(`Total Cost,€${summary.totalHoursWithCost}`);

		if (summary.timeUnitLabel !== "Hour")
			lines.push(`Average Cost per Active Day,€${summary.avgPerActiveDayWithCost}`);

		if (summary.timeUnitLabel !== "Hour")
			lines.push(`Average Cost per Week,€${summary.avgPerWeekWithCost}`);

		if (summary.timeUnitLabel === "Month" && summary.avgPerMonthWithCost)
			lines.push(`Average Cost per Month,€${summary.avgPerMonthWithCost}`);
	}

	return lines.join("\n");
}

function generateSummaryTableSection(data: ExportData, includeCost: boolean) {
	const lines = ["SUMMARY BREAKDOWN", "=================", ""];

	const { summary, cost } = data;

	const headers = [summary.timeUnitLabel, "Hours"];
	if (cost > 0 && includeCost && summary.graphDataWithCost.length > 0) headers.push("Cost (€)");
	lines.push(headers.join(","));

	if (cost > 0 && includeCost && summary.graphDataWithCost.length > 0) {
		summary.graphDataWithCost.forEach((entry) => {
			const row = [escapeCSVValue(entry.name), entry.value.toString(), entry.cost.toFixed(2)];
			lines.push(row.join(","));
		});
	} else {
		summary.graphData.forEach((entry) => {
			const row = [escapeCSVValue(entry.name), entry.value.toString()];
			lines.push(row.join(","));
		});
	}

	return lines.join("\n");
}

function generateProjectTimesSection(projectTimes: ProjectTimeDto[]) {
	const lines = [
		"PROJECT TIME ENTRIES",
		"===================",
		"",
		"Start Time,End Time,Duration,Comment",
	];

	projectTimes.forEach((entry) => {
		const startTime = format(entry.startTime, "yyyy-MM-dd HH:mm:ss");
		const endTime = entry.endTime ? format(entry.endTime, "yyyy-MM-dd HH:mm:ss") : "ongoing";
		const duration = entry.endTime
			? formatTime(differenceInSeconds(entry.endTime, entry.startTime))
			: "--";
		const comment = entry.comment || "--";

		const row = [startTime, endTime, duration, escapeCSVValue(comment)];
		lines.push(row.join(","));
	});

	return lines.join("\n");
}

function escapeCSVValue(value: string): string {
	if (typeof value !== "string") return String(value);

	// If the value contains commas, quotes, or newlines, wrap it in quotes
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		// Escape any existing quotes by doubling them
		return `"${value.replace(/"/g, '""')}"`;
	}

	return value;
}

function formatDateRange(range: SelectedDateRange): string {
	switch (range.type) {
		case "yearly":
			return `Year ${range.year}`;

		case "monthly":
			return `Month ${range.year}-${String(range.month).padStart(2, "0")}`;

		case "weekly":
			return `Week of ${format(range.weekStart, "yyyy-MM-dd")} to ${format(
				range.weekEnd,
				"yyyy-MM-dd"
			)}`;

		case "daily":
			return `${range.year}-${String(range.month).padStart(2, "0")}-${String(
				range.day
			).padStart(2, "0")}`;

		case "custom": {
			const fromDate = `${range.fromYear}-${String(range.fromMonth).padStart(
				2,
				"0"
			)}-${String(range.fromDay).padStart(2, "0")}`;
			const toDate = `${range.toYear}-${String(range.toMonth).padStart(2, "0")}-${String(
				range.toDay
			).padStart(2, "0")}`;
			return `Custom: ${fromDate} to ${toDate}`;
		}

		default:
			return "Unknown range";
	}
}

export function downloadCSV(content: string, filename: string = "summary-export.csv"): void {
	const BOM = "\uFEFF";
	const csvContent = BOM + content;
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
	const link = document.createElement("a");

	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}
