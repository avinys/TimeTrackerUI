import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthContext'
import { ProjectService } from '../services/ProjectService'
import toast from 'react-hot-toast'

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { mutate: updateProject, isPending } = useMutation({
    mutationFn: ProjectService.updateProject,
    onSuccess: () => {
      toast.success('Project succesfully updated')
      queryClient.invalidateQueries({ queryKey: ['projects', user?.id] })
    },
    onError: () => toast.error('Failed to update project')
  })

  return { updateProject, isPending }
}
