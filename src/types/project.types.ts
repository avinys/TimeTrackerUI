export interface ProjectDto {
  id: number;
  name: string;
  createdAt: string;
  userId: number;
}

export interface CreateProjectDto {
  name: string;
}
