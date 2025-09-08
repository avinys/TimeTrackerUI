import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../services/ProjectService";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";

export function useCreateProject() {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	const { mutate: createProject, isPending } = useMutation({
		mutationFn: ProjectService.createProject,
		onSuccess: () => {
			toast.success("New project succesfully created");
			queryClient.invalidateQueries({ queryKey: ["projects", user?.id] });
		},
		onError: () => toast.error("Failed to create a new project"),
	});

	return { createProject, isPending };
}
