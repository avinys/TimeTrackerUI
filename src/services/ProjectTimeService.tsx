import API from "../api/axios";
import type {
	ProjectTimeDto,
	CreateProjectTimeDto,
	UpdateProjectTimeDto,
	DeleteProjectTimeDto,
	ProjectTimeDtoApi,
	StopProjectTimeDto,
} from "../types/projectTime.types";

const toClient = (pt: ProjectTimeDtoApi): ProjectTimeDto => ({
	...pt,
	startTime: new Date(pt.startTime),
	endTime: pt.endTime ? new Date(pt.endTime) : null,
});

export const ProjectTimeService = {
	async getProjectTimes(projectId: number): Promise<ProjectTimeDto[]> {
		const response = await API.get(`project-times/user-project/${projectId}`, {
			withCredentials: true,
		});
		console.log("ProjectTimeService.tsx: fetching all project times: ", response.data);
		return (response.data as ProjectTimeDtoApi[]).map(toClient);
	},

	async createProjectTime(data: CreateProjectTimeDto): Promise<ProjectTimeDto> {
		console.log("Requesting project time creation: ", data);
		const response = await API.post("project-times", data, {
			withCredentials: true,
		});
		return toClient(response.data as ProjectTimeDtoApi);
	},

	async updateProjectTime(data: UpdateProjectTimeDto): Promise<ProjectTimeDto> {
		console.log("Requesting project time update", data);
		const response = await API.put(`project-times/${data.projectTimeId}`, data, {
			withCredentials: true,
		});
		return toClient(response.data as ProjectTimeDtoApi);
	},

	async stopProjectTime(data: StopProjectTimeDto): Promise<ProjectTimeDto> {
		console.log("Requesting project time stop");
		const response = await API.put(`project-times/stop/${data.projectTimeId}`, data, {
			withCredentials: true,
		});
		return toClient(response.data as ProjectTimeDtoApi);
	},

	async deleteProjectTime(data: DeleteProjectTimeDto): Promise<void> {
		console.log("Requesting project time deletion: ", data);
		await API.delete(`project-times/${data.projectTimeId}`, {
			withCredentials: true,
		});
	},
};
