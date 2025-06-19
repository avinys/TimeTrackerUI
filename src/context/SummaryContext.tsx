// import React, { createContext, useContext, useState } from 'react';
// import { eachDayOfInterval, startOfDay, endOfDay, format, parseISO } from "date-fns";
// import { ProjectTimeService } from '../services/ProjectTimeService';
// import type { ProjectTimeDto } from '../types/projectTime.types';
// import type { HourlyTimeEntry } from '../types/summary.types';

// type SummaryContextType = {
//     // projectTimes: { [projectId: number]: ProjectTimeDto[] };
//     // hourlyGroupedProjectTimes: { [projectId: number]: HourlyTimeEntry[] };
//     getProjectTimes: (projectId: number) => Promise<ProjectTimeDto[]>;
//     getGroupedHourlyProjectTimes: (projectId: number) => Promise<HourlyTimeEntry[]>;
// }

// function groupTimes(projectTimes: ProjectTimeDto[]): HourlyTimeEntry[] {
//     const hourlyMap = new Map<string, number>(); // key: `${date}-${hour}`

//     for (const time of projectTimes) {
//         const start = new Date(time.startTime);
//         const end = new Date(time.endTime);

//         // Get each calendar day between start and end
//         const days = eachDayOfInterval({
//             start: startOfDay(start),
//             end: endOfDay(end),
//         });

//         for (const day of days) {
//             const dateStr = format(day, "yyyy-MM-dd");
//             const dayStart = new Date(`${dateStr}T00:00:00`);
//             const dayEnd = new Date(`${dateStr}T23:59:59.999`);

//             const clampedStart = start < dayStart ? dayStart : start;
//             const clampedEnd = end > dayEnd ? dayEnd : end;

//             for (let hour = 0; hour < 24; hour++) {
//                 const hourStart = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
//                 const hourEnd = new Date(`${dateStr}T${String(hour + 1).padStart(2, "0")}:00:00`);

//                 const overlapStart = clampedStart > hourStart ? clampedStart : hourStart;
//                 const overlapEnd = clampedEnd < hourEnd ? clampedEnd : hourEnd;

//                 const overlap = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);

//                 if (overlap > 0) {
//                     const key = `${dateStr}*${hour}`;
//                     hourlyMap.set(key, (hourlyMap.get(key) ?? 0) + overlap);
//                 }
//             }
//         }
//     }
//     console.log("groupTimes in SummaryContext.tsx: ", hourlyMap);

//     // Convert map to array
//     const result: HourlyTimeEntry[] = Array.from(hourlyMap.entries()).map(([key, duration]) => {
//         const [date, hourStr] = key.split("*");
//         return {
//             date,
//             hour: parseInt(hourStr, 10),
//             duration,
//         };
//     });

//     return result;
// }

// const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

// export const SummaryProvider = ({ children }: { children: React.ReactNode }) => {
//     const [projectTimes, setProjectTimes] = useState<{ [projectId: number]: ProjectTimeDto[] }>({});
//     const [groupedHourlyProjectTimes, setGroupedHourlyProjectTimes] = useState<{ [projectId: number]: HourlyTimeEntry[] }>({});

//     const getProjectTimes = async (projectId: number): Promise<ProjectTimeDto[]> => {
//         if(projectTimes[projectId]) {
//             return projectTimes[projectId];
//         }

//         const fetchedTimes = await ProjectTimeService.getProjectTimes(projectId);

//         setProjectTimes(prev => ({
//             ...prev,
//             [projectId]: fetchedTimes
//         }));

//         return fetchedTimes;
//     };

//     const getGroupedHourlyProjectTimes = async (projectId: number): Promise<HourlyTimeEntry[]> => {
//         if (groupedHourlyProjectTimes[projectId]) {
//             return groupedHourlyProjectTimes[projectId];
//         }

//         const fetchedProjectTimes = await (getProjectTimes(projectId));
//         const groupedProjectTimes = groupTimes(fetchedProjectTimes);
//         setGroupedHourlyProjectTimes(prev => ({
//             ...prev,
//             [projectId]: groupedProjectTimes
//         }));
//         return groupedProjectTimes;
//     };

//     return (
//         <SummaryContext.Provider value={{ getProjectTimes, getGroupedHourlyProjectTimes }}>
//             {children}
//         </SummaryContext.Provider>
//     )
// };

// export const useSummary = () => {
//     const context = useContext(SummaryContext);
//     if(!context) {
//         throw new Error("useSummary must be used within SummaryProvider");
//     }
//     return context;
// }