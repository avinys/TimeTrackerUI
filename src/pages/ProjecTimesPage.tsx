import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectTimes } from '../context/ProjectTimesContext';
import type { DeleteProjectTimeDto } from '../types/projectTime.types';
import { ProjectTimeService } from '../services/ProjectTimeService';
import ProjectTimeList from '../components/ProjectTimeList';
import ProjectTimeClock from '../components/ProjectTimeClock';

export default function ProjectTimesPage() {
    const { projectId } = useParams<{ projectId: string }>();
    if (!projectId) throw new Error("projectId is missing");

    const numericProjectId = parseInt(projectId, 10);

    const { projectTimes, setProjectTimes } = useProjectTimes();

    const fetchProjectTimes = async () => {
        const res = await ProjectTimeService.getProjectTimes(numericProjectId);
        setProjectTimes(res);
    };

    useEffect(() => {
        fetchProjectTimes();
    }, [numericProjectId])

    const handleDelete = async (id: number) => {
        try {
            const params: DeleteProjectTimeDto = {
                projectTimeId: id,
            }

            await ProjectTimeService.deleteProjectTime(params);
            await fetchProjectTimes(); // re-fetch after deletion
        } catch (error) {
            console.error("Failed to delete project time", error);
        }
    };

    return (
        <div className="container">
            <ProjectTimeClock projectId={numericProjectId} refreshProjectTimes={fetchProjectTimes}/>
            <h2>Previous Recorded Times: </h2>
            <ProjectTimeList handleDelete={handleDelete}/>
        </div>
    )
}