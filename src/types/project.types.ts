export interface ProjectDto {
  id: number
  name: string
  createdAt: string
  userId: number
  isRunning: boolean
  isCompleted: boolean
}

export interface CreateProjectDto {
  name: string
}

export interface DeleteprojectDto {
  projectId: number
}

export interface UpdateProjectDto {
  projectId: number
  name?: string
  isCompleted?: boolean
}

export type SortByProjects = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'
