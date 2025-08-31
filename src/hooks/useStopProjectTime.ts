import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ProjectTimeService } from "../services/ProjectTimeService";
import type { StopProjectTimeDto } from "../types/projectTime.types";

export function useStopProjectTime(projectId: number) {
	const queryClient = useQueryClient();

	const { mutate: stopTime, isPending } = useMutation({
		mutationFn: (dto: StopProjectTimeDto) => ProjectTimeService.stopProjectTime(dto),
		onSuccess: () => {
			toast.success("Time stopped");
			queryClient.invalidateQueries({ queryKey: ["projectTimes", projectId] });
		},
		onError: () => toast.error("Failed to stop time"),
	});

	return { stopTime, isPending };
}
