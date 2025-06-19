export interface ProjectTimeDto {
    id: number;
    userId: number;
    projectTime: number;
    startTime: Date;
    endTime: Date;
}

export interface CreateProjectTimeDto {
    projectId: number;
}

export interface UpdateProjectTimeDto {
    projectTimeId: number;
    startTime: Date;
}

export interface DeleteProjectTimeDto {
    projectTimeId: number;
}