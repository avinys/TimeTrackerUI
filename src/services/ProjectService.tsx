import API from '../api/axios';
import type { ProjectDto, CreateProjectDto } from '../types/project.types';

export const ProjectService = {
    async getUserProjects(): Promise<ProjectDto[]> {
        const response = await API.get(`/Projects/user/`, {
            withCredentials: true
        });
        return response.data;
    },

    async createProject(data: CreateProjectDto): Promise<ProjectDto> {
        console.log("Requesting project creation: ", data);
        const response = await API.post('/Projects', data, {
            withCredentials: true
        });
        return response.data;
    }
};