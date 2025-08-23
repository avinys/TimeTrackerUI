import React, { useState, useEffect, useMemo } from "react";
import { getWeeksInMonth } from "../util/getWeeksInMonth";
import type { SelectedDateRange } from "../types/summary.types";

type RangeType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

interface DateRangeSelectorProps {
	value: SelectedDateRange | null;
	onChange: (range: SelectedDateRange | null) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
	value,
	onChange,
}) => {
	const [rangeType, setRangeType] = useState<RangeType>("monthly");

	const year = value && "year" in value ? value.year : null;
	const month = value && "month" in value ? value.month : null;
	const day = value && "day" in value ? value.day : null;
	const custom = value && value.type === "custom" ? value : null;

	const today = new Date().toISOString().split("T")[0];

	const weeks = useMemo(() => {
		if (rangeType === "weekly" && year !== null && month !== null) {
			return getWeeksInMonth(year, month);
		}
		return [];
	}, [rangeType, year, month]);

	const handleRangeTypeChange = (type: RangeType) => {
		setRangeType(type);
		console.log("RangeType changed: ", type);
		onChange(null); // Reset selection in parent
	};

	const handleYearChange = (year: number) => {
		switch (rangeType) {
			case "yearly":
				onChange({ type: "yearly", year });
				break;
			case "monthly":
				onChange({ type: "monthly", year, month: 0 });
				break;
			case "weekly":
				onChange({
					type: "weekly",
					year,
					month: 0,
					weekStart: weeks[0]?.start,
					weekEnd: weeks[0]?.end,
				});
				break;
			case "daily":
				onChange({ type: "daily", year, month: 0, day: 1 });
				break;
		}
	};

	const handleMonthChange = (month: number) => {
		if (year === null) return;
		switch (rangeType) {
			case "monthly":
				onChange({ type: "monthly", year, month });
				break;
			case "weekly": {
				const newWeeks = getWeeksInMonth(year, month);
				onChange({
					type: "weekly",
					year,
					month,
					weekStart: newWeeks[0]?.start,
					weekEnd: newWeeks[0]?.end,
				});
				break;
			}
			case "daily":
				onChange({ type: "daily", year, month, day: 1 });
				break;
		}
	};

	const handleWeekChange = (index: number) => {
		if (!weeks[index] || year === null || month === null) return;
		const { start, end } = weeks[index];
		onChange({
			type: "weekly",
			year,
			month,
			weekStart: start,
			weekEnd: end,
		});
	};

	const handleCustomChange = (field: "from" | "to", value: string) => {
		const updated = {
			...custom,
			[field]: value,
		};

		const from = updated.from ? new Date(updated.from) : null;
		const to = updated.to ? new Date(updated.to) : null;

		// Logic:
		// If user updates 'from' and it's after 'to', clear 'to'
		if (field === "from" && from && to && from > to) {
			updated.to = "";
		}

		// If user updates 'to' and it's before 'from', clear 'from'
		if (field === "to" && from && to && from > to) {
			updated.from = "";
		}

		onChange({
			type: "custom",
			from: updated.from ?? "",
			to: updated.to ?? "",
		});
	};

	console.log("DateRangeSelector.tsx: rendering");

	return (
		<div>
			{/* Range Type */}
			<select
				value={rangeType}
				onChange={(e) =>
					handleRangeTypeChange(e.target.value as RangeType)
				}
			>
				<option value="">-</option>
				<option value="yearly">Yearly</option>
				<option value="monthly">Monthly</option>
				<option value="weekly">Weekly</option>
				<option value="daily">Daily</option>
				<option value="custom">Custom</option>
			</select>

			{custom?.from &&
				custom?.to &&
				new Date(custom.from) > new Date(custom.to) && (
					<p style={{ color: "red" }}>
						End date cannot be earlier than start date.
					</p>
				)}

			{/* Year */}
			{["yearly", "monthly", "weekly"].includes(rangeType) && (
				<select
					value={year ?? ""}
					onChange={(e) => handleYearChange(Number(e.target.value))}
				>
					{[...Array(10)].map((_, i) => {
						const y = new Date().getFullYear() - i;
						return (
							<option key={y} value={y}>
								{y}
							</option>
						);
					})}
				</select>
			)}

			{/* Month */}
			{["monthly", "weekly"].includes(rangeType) && year !== null && (
				<select
					value={month ?? ""}
					onChange={(e) => handleMonthChange(Number(e.target.value))}
				>
					{Array.from({ length: 12 }, (_, i) => (
						<option key={i} value={i}>
							{new Date(0, i).toLocaleString("default", {
								month: "long",
							})}
						</option>
					))}
				</select>
			)}

			{/* Week */}
			{rangeType === "weekly" && weeks.length > 0 && (
				<select
					onChange={(e) => handleWeekChange(Number(e.target.value))}
				>
					{weeks.map((week, index) => (
						<option key={index} value={index}>
							{week.label}
						</option>
					))}
				</select>
			)}

			{rangeType === "daily" && (
				<input
					type="date"
					value={
						value?.type === "daily"
							? `${value.year}-${String(value.month + 1).padStart(
									2,
									"0"
							  )}-${String(value.day).padStart(2, "0")}`
							: ""
					}
					max={today}
					onChange={(e) => {
						const date = new Date(e.target.value);
						onChange({
							type: "daily",
							year: date.getFullYear(),
							month: date.getMonth(),
							day: date.getDate(),
						});
					}}
				/>
			)}

			{/* Custom */}
			{rangeType === "custom" && (
				<div>
					<input
						type="date"
						max={today}
						value={custom?.from ?? ""}
						onChange={(e) =>
							handleCustomChange("from", e.target.value)
						}
					/>
					<input
						type="date"
						max={today}
						value={custom?.to ?? ""}
						onChange={(e) =>
							handleCustomChange("to", e.target.value)
						}
					/>
				</div>
			)}
		</div>
	);
};

export default DateRangeSelector;
