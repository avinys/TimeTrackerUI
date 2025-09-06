export interface ProjectTimeDtoApi {
	id: number;
	userId: number;
	projectId: number;
	startTime: string;
	endTime: string | null;
	comment: string | null;
}

export interface ProjectTimeDto {
	id: number;
	userId: number;
	projectId: number;
	startTime: Date;
	endTime: Date | null;
	comment: string | null;
}

export interface CreateProjectTimeDto {
	projectId: number;
}

export interface UpdateProjectTimeDto {
	projectTimeId: number;
	startTime: Date;
	endTime?: Date | null;
	comment?: string | null;
}

export interface StopProjectTimeDto {
	projectTimeId: number;
}

export interface DeleteProjectTimeDto {
	projectTimeId: number;
}

export type SortBy = "date-desc" | "date-asc" | "duration-desc" | "duration-asc";
