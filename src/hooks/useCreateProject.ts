import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../services/ProjectService";
import toast from "react-hot-toast";

export function useCreateProject() {
	const queryClient = useQueryClient();

	const { mutate: createProject, isPending } = useMutation({
		mutationFn: ProjectService.createProject,
		onSuccess: () => {
			toast.success("New project succesfully created");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: () => toast.error("Failed to create a new project"),
	});

	return { createProject, isPending };
}
