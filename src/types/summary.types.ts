export type RangeType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export type SelectedDateRange =
    | { type: "yearly"; year: number }
    | { type: "monthly"; year: number; month: number }
    | { type: "weekly"; year: number; month: number; weekStart: Date; weekEnd: Date }
    | { type: "daily"; year: number; month: number; day: number }
    | { type: "custom"; from: string; to: string };

export interface HourlyTimeEntry {
    date: string;
    hour: number;
    duration: number;
};
