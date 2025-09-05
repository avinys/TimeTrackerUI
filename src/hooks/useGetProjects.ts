import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "../services/ProjectService";
import { useAuth } from "../auth/AuthContext";

export function useGetProjects() {
	const { user } = useAuth();
	const {
		isPending,
		isFetching,
		data: projects,
	} = useQuery({
		queryKey: ["projects", user?.id],
		queryFn: ProjectService.getUserProjects,
		enabled: user != null,
	});

	return { isPending, isFetching, projects };
}
