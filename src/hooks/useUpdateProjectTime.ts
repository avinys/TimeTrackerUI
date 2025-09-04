import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { UpdateProjectTimeDto } from "../types/projectTime.types";

export function useUpdateProjectTime(projectId: number, closeModal?: () => void) {
	const queryClient = useQueryClient();

	const { mutate: updateProjectTime, isPending } = useMutation({
		mutationFn: (dto: UpdateProjectTimeDto) => ProjectTimeService.updateProjectTime(dto),
		onSuccess: () => {
			toast.success("Project time succesfully updated");
			queryClient.invalidateQueries({ queryKey: ["projectTimes", projectId] });
			closeModal?.();
		},
		onError: () => toast.error("Failed to update project time"),
	});

	return { updateProjectTime, isPending };
}
