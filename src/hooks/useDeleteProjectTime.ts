import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { DeleteProjectTimeDto } from "../types/projectTime.types";

export function useDeleteProjectTime(projectId: number, closeModal?: () => void) {
	const queryClient = useQueryClient();

	const { mutate: deleteProjectTime, isPending } = useMutation({
		mutationFn: (dto: DeleteProjectTimeDto) => ProjectTimeService.deleteProjectTime(dto),
		onSuccess: () => {
			toast.success("Project time succesfully deleted");
			queryClient.invalidateQueries({ queryKey: ["projectTimes", projectId] });
			closeModal?.();
		},
		onError: () => toast.error("Failed to delete project time"),
	});

	return { deleteProjectTime, isPending };
}
