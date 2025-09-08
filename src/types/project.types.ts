export interface ProjectDto {
	id: number;
	name: string;
	createdAt: string;
	userId: number;
	isRunning: boolean;
}

export interface CreateProjectDto {
	name: string;
}

export interface DeleteprojectDto {
	projectId: number;
}

export type SortByProjects = "name-asc" | "name-desc" | "date-asc" | "date-desc";
