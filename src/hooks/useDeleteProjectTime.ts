import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { DeleteProjectTimeDto } from "../types/projectTime.types";
import { useAuth } from "../auth/AuthContext";

export function useDeleteProjectTime(projectId: number, closeModal?: () => void) {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	const { mutate: deleteProjectTime, isPending } = useMutation({
		mutationFn: (dto: DeleteProjectTimeDto) => ProjectTimeService.deleteProjectTime(dto),
		onSuccess: () => {
			toast.success("Project time succesfully deleted");
			queryClient.invalidateQueries({ queryKey: ["projectTimes", projectId, user?.id] });
			closeModal?.();
		},
		onError: () => toast.error("Failed to delete project time"),
	});

	return { deleteProjectTime, isPending };
}
