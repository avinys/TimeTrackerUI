export interface ProjectTimeDtoApi {
	id: number;
	userId: number;
	projectTime: number;
	startTime: string;
	endTime: string | null;
}

export interface ProjectTimeDto {
	id: number;
	userId: number;
	projectTime: number;
	startTime: Date;
	endTime: Date | null;
}

export interface CreateProjectTimeDto {
	projectId: number;
}

export interface UpdateProjectTimeDto {
	projectTimeId: number;
	startTime: string;
}

export interface DeleteProjectTimeDto {
	projectTimeId: number;
}
