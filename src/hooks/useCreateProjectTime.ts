import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { CreateProjectTimeDto } from "../types/projectTime.types";

export function useCreateProjectTime(projectId: number) {
	const queryClient = useQueryClient();
	const dto: CreateProjectTimeDto = { projectId };

	const { mutate: startTime, isPending } = useMutation({
		mutationFn: () => ProjectTimeService.createProjectTime(dto),
		onSuccess: () => {
			toast.success("Time started");
			queryClient.invalidateQueries({ queryKey: ["projectTimes", projectId] });
		},
		onError: () => toast.error("Failed to start time"),
	});

	return { startTime, isPending };
}
