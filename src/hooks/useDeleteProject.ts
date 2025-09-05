import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectService } from "../services/ProjectService";
import type { DeleteprojectDto } from "../types/project.types";
import { useAuth } from "../auth/AuthContext";

export function useDeleteProject(closeModal?: () => void) {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	const { mutate: deleteProject, isPending } = useMutation({
		mutationFn: (dto: DeleteprojectDto) => ProjectService.deleteProject(dto),
		onSuccess: () => {
			toast.success("Project succesfully deleted");
			queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
			closeModal?.();
		},
		onError: () => toast.error("Failed to delete project"),
	});

	return { deleteProject, isPending };
}
