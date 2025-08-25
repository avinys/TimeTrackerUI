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
