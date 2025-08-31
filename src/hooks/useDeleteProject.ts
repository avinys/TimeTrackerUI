import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectService } from "../services/ProjectService";
import type { DeleteprojectDto } from "../types/project.types";

export function useDeleteProject(closeModal: () => void) {
	const queryClient = useQueryClient();

	const { mutate: deleteProject, isPending } = useMutation({
		mutationFn: (dto: DeleteprojectDto) => ProjectService.deleteProject(dto),
		onSuccess: () => {
			toast.success("Project succesfully deleted");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			closeModal();
		},
		onError: () => toast.error("Failed to delete project"),
	});

	return { deleteProject, isPending };
}
