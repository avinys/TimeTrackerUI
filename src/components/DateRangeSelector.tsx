import React, { useEffect, useMemo, useState } from "react";
import type { SelectedDateRange } from "../types/summary.types";
import { getWeeksInMonth } from "../util/getWeeksInMonth";
import styles from "../styles/summary.module.css";

type RangeType = "" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

interface DateRangeSelectorProps {
	selectedRange: SelectedDateRange | undefined;
	setSelectedRange: (range: SelectedDateRange | undefined) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
	selectedRange,
	setSelectedRange,
}) => {
	const [rangeType, setRangeType] = useState<RangeType>("");

	const [year, setYear] = useState(
		selectedRange && "year" in selectedRange ? selectedRange.year : null
	);
	const [month, setMonth] = useState(
		selectedRange && "month" in selectedRange ? selectedRange.month : null
	);
	const [weekStart, setWeekStart] = useState(
		selectedRange && "weekStart" in selectedRange ? selectedRange.weekStart : null
	);
	const [weekEnd, setWeekEnd] = useState(
		selectedRange && "weekEnd" in selectedRange ? selectedRange.weekEnd : null
	);
	const [date, setDate] = useState(
		selectedRange && "day" in selectedRange
			? new Date(selectedRange.year, selectedRange.month, selectedRange.day)
			: null
	);
	const [customFrom, setCustomFrom] = useState(
		selectedRange && "fromYear" in selectedRange
			? new Date(selectedRange.fromYear, selectedRange.fromMonth, selectedRange.fromDay)
			: null
	);
	const [customTo, setCustomTo] = useState(
		selectedRange && "toYear" in selectedRange
			? new Date(selectedRange.toYear, selectedRange.toMonth, selectedRange.toDay)
			: null
	);

	const today = new Date().toISOString().split("T")[0];

	const weeks = useMemo(() => {
		if (rangeType === "weekly" && year !== null && month !== null) {
			return getWeeksInMonth(year, month);
		}
		return [];
	}, [rangeType, year, month]);

	useEffect(checkSelection, [
		year,
		month,
		weekStart,
		weekEnd,
		date,
		customFrom,
		customTo,
		rangeType,
		setSelectedRange,
	]);

	const emptyFields = () => {
		setYear(null);
		setMonth(null);
		setDate(null);
		setWeekStart(null);
		setWeekEnd(null);
		setCustomFrom(null);
		setCustomTo(null);
	};

	function checkSelection() {
		switch (rangeType) {
			case "yearly":
				if (year) setSelectedRange({ type: "yearly", year });
				break;
			case "monthly":
				if (year && month) setSelectedRange({ type: "monthly", year, month: month });
				break;
			case "weekly":
				if (year && month && weekStart && weekEnd)
					setSelectedRange({
						type: "weekly",
						year,
						month,
						weekStart,
						weekEnd,
					});
				break;
			case "daily":
				if (date)
					setSelectedRange({
						type: "daily",
						year: date.getFullYear(),
						month: date.getMonth(),
						day: date.getDate(),
					});
				break;
			case "custom":
				if (customFrom && customTo)
					setSelectedRange({
						type: "custom",
						fromYear: customFrom.getFullYear(),
						fromMonth: customFrom.getMonth(),
						fromDay: customFrom.getDate(),
						toYear: customTo.getFullYear(),
						toMonth: customTo.getMonth(),
						toDay: customTo.getDate(),
					});
				break;
		}
	}

	const handleRangeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedType = e.target.value as RangeType;
		setRangeType(selectedType);
		emptyFields();
		setSelectedRange(undefined); // Reset selection in parent
	};

	const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const weekIndex = Number(e.target.value);
		if (!weeks[weekIndex] || year === null || month === null) return;
		const { start, end } = weeks[weekIndex];
		setWeekStart(start);
		setWeekEnd(end);
		checkSelection();
	};

	const handleCustomFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedCustomFrom = new Date(e.target.value);

		if (customTo && selectedCustomFrom > customTo) setCustomTo(null);

		setCustomFrom(e.target.value ? selectedCustomFrom : null);
		checkSelection();
	};

	const handleCustomToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedCustomTo = new Date(e.target.value);

		if (customFrom && selectedCustomTo < customFrom) setCustomFrom(null);

		setCustomTo(e.target.value ? selectedCustomTo : null);
		checkSelection();
	};

	const toDateInput = (d: Date) => d.toISOString().slice(0, 10);

	return (
		<div className={styles.dateRangeSelector}>
			{/* Range Type */}
			<select
				className={styles.inputElement}
				value={rangeType}
				onChange={handleRangeTypeChange}
			>
				<option value="" disabled>
					--select range--
				</option>
				<option value="yearly">Yearly</option>
				<option value="monthly">Monthly</option>
				<option value="weekly">Weekly</option>
				<option value="daily">Daily</option>
				<option value="custom">Custom</option>
			</select>
			{customFrom && customTo && new Date(customFrom) > new Date(customTo) && (
				<p style={{ color: "red" }}>End date cannot be earlier than start date.</p>
			)}
			{/* Year */}
			{["yearly", "monthly", "weekly"].includes(rangeType) && (
				<select
					className={styles.inputElement}
					value={year ?? ""}
					onChange={(e) => setYear(Number(e.target.value))}
				>
					<option value="" disabled>
						--select year--
					</option>
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
					className={styles.inputElement}
					value={month ?? ""}
					onChange={(e) => setMonth(Number(e.target.value))}
				>
					<option value="" disabled>
						--select month--
					</option>
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
				<select className={styles.inputElement} onChange={handleWeekChange} defaultValue="">
					<option value="" disabled>
						--select week--
					</option>
					{weeks.map((week, index) => (
						<option key={index} value={index}>
							{week.label}
						</option>
					))}
				</select>
			)}
			{/* Daily - date */}
			{rangeType === "daily" && (
				<input
					className={styles.inputElement}
					type="date"
					value={date ? toDateInput(date) : ""}
					max={today}
					onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
				/>
			)}
			{/* Custom */}
			{rangeType === "custom" && (
				<div>
					<input
						type="date"
						max={today}
						value={customFrom ? toDateInput(customFrom) : ""}
						onChange={handleCustomFromChange}
					/>
					<input
						type="date"
						max={today}
						value={customTo ? toDateInput(customTo) : ""}
						onChange={handleCustomToChange}
					/>
				</div>
			)}
		</div>
	);
};

export default DateRangeSelector;
