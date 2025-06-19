import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import type { ProjectTimeDto } from "../types/projectTime.types";
import type { SelectedDateRange } from "../types/summary.types";
import type { HourlyTimeEntry } from "../types/summary.types";
// import { useSummary } from "../context/SummaryContext";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

type SummaryGraphDataPoint = {
    name: string;
    value: number;
};

type SummaryGraphPropsType = {
    hourlyGroupedProjectTimes: HourlyTimeEntry[];
    selectedDateRange: SelectedDateRange | null;
};

function groupByHour(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
    const arr = new Array(24).fill(0);

    for (const pt of projectTimes) {
        arr[pt.hour] += pt.duration;
    }

    return arr.map((value, i) => ({
        name: `${String(i).padStart(2, "0")}:00`,
        value,
    }));
}

function groupByDate(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
    const map = new Map<string, number>();

    for (const pt of projectTimes) {
        map.set(pt.date, (map.get(pt.date) ?? 0) + pt.duration);
    }

    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, value]) => ({ name, value }));
}

function groupByMonth(projectTimes: HourlyTimeEntry[]): SummaryGraphDataPoint[] {
    const map = new Map<string, number>();

    for (const pt of projectTimes) {
        const month = format(parseISO(pt.date), "yyy-MM");
        map.set(month, (map.get(month) ?? 0) + pt.duration);
    }

    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, value]) => ({ name, value }));
}

function filterProjectTimes(
    groupedHourlyProjectTimes: HourlyTimeEntry[],
    selectedDateRange: SelectedDateRange
): HourlyTimeEntry[] {
    // console.log("filterProjectTimes in SummaryGraph.tsx: groupedTimes:", groupedHourlyProjectTimes);
    // console.log("filterProjectTimes in SummaryGraph.tsx: selectedDateRange:", selectedDateRange);
    return groupedHourlyProjectTimes.filter((entry) => {
        const entryDate = new Date(entry.date);

        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth();
        const entryDay = entryDate.getDate();

        switch (selectedDateRange.type) {
            case "yearly":
                return entryYear === selectedDateRange.year;
            case "monthly":
                return entryYear === selectedDateRange.year && entryMonth === selectedDateRange.month;
            case "weekly":
                return (
                    entryDate >= new Date(selectedDateRange.weekStart) &&
                    entryDate <= new Date(selectedDateRange.weekEnd)
                );
            case "daily":
                return (
                    entryYear === selectedDateRange.year &&
                    entryMonth === selectedDateRange.month &&
                    entryDay === selectedDateRange.day
                );
            case "custom":
                const fromDate = new Date(selectedDateRange.from);
                const toDate = new Date(selectedDateRange.to);
                return entryDate >= fromDate && entryDate <= toDate;
            default:
                return false;
        }
    });
}

export default function SummaryGraph({ hourlyGroupedProjectTimes, selectedDateRange }: SummaryGraphPropsType) {
    // const { getGroupedHourlyProjectTimes } = useSummary();
    const [groupedProjectTimes, setGroupedProjectTimes] = useState<HourlyTimeEntry[]>([]);
    const [graphData, setGraphData] = useState<SummaryGraphDataPoint[]>([]);
    if (!hourlyGroupedProjectTimes || !selectedDateRange) {
        return <h2>Something went wrong with the summary data. Please try refreshing the page.</h2>;
    }

    useEffect(() => {
        const loadAndFilterGroupedProjectTimes = async () => {
            const filteredHourlyProjectTimes = filterProjectTimes(hourlyGroupedProjectTimes, selectedDateRange);
            setGroupedProjectTimes(filteredHourlyProjectTimes);

            let tempData: SummaryGraphDataPoint[] = [];
            switch (selectedDateRange?.type) {
                case "yearly":
                    tempData = groupByMonth(groupedProjectTimes);
                    setGraphData(tempData);
                    break;
                case "monthly":
                    tempData = groupByDate(groupedProjectTimes);
                    setGraphData(tempData);
                    break;
                case "weekly":
                    tempData = groupByDate(groupedProjectTimes);
                    setGraphData(tempData);
                    break;
                case "daily":
                    tempData = groupByHour(groupedProjectTimes);
                    setGraphData(tempData);
                    break;
                case "custom":
                    const fromDate = new Date(selectedDateRange.from);
                    const toDate = new Date(selectedDateRange.to);

                    const differenceMiliseconds = toDate.getTime() - fromDate.getTime();
                    const differenceDays = differenceMiliseconds / (24 * 60 * 60 * 1000);

                    if (differenceDays <= 1) {
                        tempData = groupByHour(groupedProjectTimes);
                    } else if (differenceDays <= 62) {
                        tempData = groupByDate(groupedProjectTimes);
                    } else {
                        tempData = groupByMonth(groupedProjectTimes);
                    }
                    setGraphData(tempData);
                    break;
                default:
                    tempData = [];
                    break;
            }
        };

        loadAndFilterGroupedProjectTimes();
    }, [hourlyGroupedProjectTimes, selectedDateRange]);

    return (
        <LineChart width={600} height={300} data={graphData}>
            <Line type="monotone" dataKey="value" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
        </LineChart>
    );
}
