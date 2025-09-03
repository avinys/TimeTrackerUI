import API from "../api/axios";
import type { ProjectDto, CreateProjectDto, DeleteprojectDto } from "../types/project.types";

export const ProjectService = {
	async getUserProjects(): Promise<ProjectDto[]> {
		const response = await API.get(`projects/user`, {
			withCredentials: true,
		});
		return response.data;
	},

	async createProject(data: CreateProjectDto): Promise<ProjectDto> {
		console.log("Requesting project creation: ", data);
		const response = await API.post("projects", data, {
			withCredentials: true,
		});
		return response.data;
	},

	async deleteProject(data: DeleteprojectDto): Promise<void> {
		console.log("Requesting project deletion", data);
		await API.delete(`projects/${data.projectId}`, {
			withCredentials: true,
		});
	},
};
