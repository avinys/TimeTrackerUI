import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "../services/ProjectService";

export function useGetProjects() {
	const {
		isPending,
		isFetching,
		data: projects,
	} = useQuery({
		queryKey: ["projects"],
		queryFn: ProjectService.getUserProjects,
	});

	return { isPending, isFetching, projects };
}
