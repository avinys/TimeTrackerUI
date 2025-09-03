import type { ProjectDto } from "./project.types";
import type { ProjectTimeDto } from "./projectTime.types";

export type RangeType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export type SelectedDateRange =
	| { type: "yearly"; year: number }
	| { type: "monthly"; year: number; month: number }
	| { type: "weekly"; year: number; month: number; weekStart: Date; weekEnd: Date }
	| { type: "daily"; year: number; month: number; day: number }
	| {
			type: "custom";
			fromYear: number;
			fromMonth: number;
			fromDay: number;
			toYear: number;
			toMonth: number;
			toDay: number;
	  };

export interface HourlyTimeEntry {
	date: string;
	hour: number;
	duration: number;
}

export interface ExportGenerationOptions {
	totals: boolean;
	summaryTable: boolean;
	projectTimesList: boolean;
	includeCost: boolean;
}

export interface ExportData {
	currentProject: ProjectDto;
	selectedRange: SelectedDateRange;
	selectedHourlyEntries: HourlyTimeEntry[];
	selectedProjectTimes: ProjectTimeDto[];
	summary: {
		totalHours: number;
		avgPerActiveDay: number;
		avgPerWeek: number;
		avgPerMonth?: number;
		activeDays: number;
		totalHoursWithCost: number;
		avgPerActiveDayWithCost: number;
		avgPerWeekWithCost: number;
		avgPerMonthWithCost?: number;
		timeUnitLabel: string;
		graphData: Array<{ name: string; value: number }>;
		graphDataWithCost: Array<{ name: string; value: number; cost: number }>;
	};
	cost: number;
}
