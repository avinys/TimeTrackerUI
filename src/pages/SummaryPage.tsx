import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
// import { useSummary } from '../context/SummaryContext';
import { ProjectService } from '../services/ProjectService';
import type { ProjectDto } from '../types/project.types';
import type { ProjectTimeDto } from '../types/projectTime.types';
import type { HourlyTimeEntry, SelectedDateRange } from '../types/summary.types';
import DateRangeSelector from '../components/DateRangeSelector';
import SummaryGraph from '../components/SummaryGraph';
import { formatDate } from '../util/formatTime';
import { eachDayOfInterval, startOfDay, endOfDay, format } from "date-fns";
import { ProjectTimeService } from '../services/ProjectTimeService';

function groupTimes(projectTimes: ProjectTimeDto[]): HourlyTimeEntry[] {
    const hourlyMap = new Map<string, number>(); // key: `${date}-${hour}`

    for (const time of projectTimes) {
        const start = new Date(time.startTime);
        const end = new Date(time.endTime);

        // Get each calendar day between start and end
        const days = eachDayOfInterval({
            start: startOfDay(start),
            end: endOfDay(end),
        });

        for (const day of days) {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayStart = new Date(`${dateStr}T00:00:00`);
            const dayEnd = new Date(`${dateStr}T23:59:59.999`);

            const clampedStart = start < dayStart ? dayStart : start;
            const clampedEnd = end > dayEnd ? dayEnd : end;

            for (let hour = 0; hour < 24; hour++) {
                const hourStart = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);
                const hourEnd = new Date(`${dateStr}T${String(hour + 1).padStart(2, "0")}:00:00`);

                const overlapStart = clampedStart > hourStart ? clampedStart : hourStart;
                const overlapEnd = clampedEnd < hourEnd ? clampedEnd : hourEnd;

                const overlap = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60);

                if (overlap > 0) {
                    const key = `${dateStr}*${hour}`;
                    hourlyMap.set(key, (hourlyMap.get(key) ?? 0) + overlap);
                }
            }
        }
    }

    // Convert map to array
    const result: HourlyTimeEntry[] = Array.from(hourlyMap.entries()).map(([key, duration]) => {
        const [date, hourStr] = key.split("*");
        duration = parseFloat((duration).toFixed(4))
        return {
            date,
            hour: parseInt(hourStr, 10),
            duration
        };
    });

    return result;
}

export default function SummaryPage() {
    const [selectedRange, setSelectedRange] = useState<SelectedDateRange | null>(null);

    const { user } = useAuth();
    // const { getProjectTimes } = useSummary();
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [currentProject, setCurrentProject] = useState<ProjectDto | undefined>(undefined);
    const [projectTimes, setProjectTimes] = useState<ProjectTimeDto[]>([]);
    const [groupedProjectTimes, setGroupedProjectTimes] = useState<HourlyTimeEntry[]>([]);

    useEffect(() => {
        if(user) {
            ProjectService.getUserProjects().then(setProjects);
        }
    }, [user]);

    useEffect(() => {
        const loadTimes = async () => {
            if (currentProject) {
                const data = await ProjectTimeService.getProjectTimes(currentProject.id);
                setProjectTimes(data);
            }
        }
        loadTimes();
        setGroupedProjectTimes([]);
    }, [currentProject])

    useEffect(() => {
        if (selectedRange) {
            const groupedTimes = groupTimes(projectTimes);
            setGroupedProjectTimes(groupedTimes);
        }
    }, [selectedRange]);

    const handleProjectSelection = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selectedProject = projects.find(p => p.id === parseInt(selectedId));
        setCurrentProject(selectedProject);
    }

    return (
        <div className="container">
            <h2>Selected project: {currentProject?.name}</h2>
            <select value={currentProject ? currentProject.id : ''} onChange={handleProjectSelection} >
                <option value="" disabled hidden>-- select a project --</option>
                {projects.map((p) => (
                    <option value={p.id} key={p.id}>{p.name}</option>
                ))}
            </select>

            <DateRangeSelector value={selectedRange} onChange={setSelectedRange} />
            {currentProject && selectedRange && (
                <SummaryGraph hourlyGroupedProjectTimes={groupedProjectTimes} selectedDateRange={selectedRange}/>
            )}
            {projectTimes.length == 0 && currentProject &&(
                <p>No recorded times found for the selected project: {currentProject?.name}</p>
            )}
            <ul>
                {projectTimes.map((p) => (
                    <li key={p.id}>{p.id} --- {formatDate(p.startTime)} --- {formatDate(p.endTime)}</li>
                ))}
            </ul>
        </div>
    )
}