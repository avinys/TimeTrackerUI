import API from '../api/axios';
import type { ProjectTimeDto, CreateProjectTimeDto, UpdateProjectTimeDto, DeleteProjectTimeDto } from "../types/projectTime.types";

export const ProjectTimeService = {
    async getProjectTimes(projectId: number): Promise<ProjectTimeDto[]> {
        const response = await API.get(`/ProjectTime/user-project/${projectId}`, {
            withCredentials: true
        });
        console.log("ProjectTimeService.tsx: fetching all project times: ", response.data)
        return response.data;
    },

    async createProjectTime(data: CreateProjectTimeDto): Promise<ProjectTimeDto> {
        console.log("Requesting project time creation: ", data);
        const response = await API.post('/ProjectTime', data, {
            withCredentials: true
        });
        return response.data;
    },

    async updateProjectTime(data: UpdateProjectTimeDto): Promise<ProjectTimeDto> {
        console.log("Requesting project time update", data);
        const response = await API.put(`/ProjectTime/${data.projectTimeId}`, data, {
            withCredentials: true
        });
        return response.data;
    },

    async deleteProjectTime(data: DeleteProjectTimeDto): Promise<void> {
        console.log("Requesting project time deletion: ", data);
        await API.delete(`/ProjectTime/${data.projectTimeId}`, {
            withCredentials: true
        });
    }
}