import { useQuery } from "@tanstack/react-query";
import { ProjectTimeService } from "../services/ProjectTimeService";
import { useAuth } from "../auth/AuthContext";

export function useGetProjectTimes(projectId: number | null, enabled = true) {
	const { user } = useAuth();

	const {
		isPending,
		isFetching,
		data: projectTimes,
	} = useQuery({
		queryKey: ["projectTimes", projectId ?? null, user?.id],
		queryFn: ({ queryKey }) => ProjectTimeService.getProjectTimes(queryKey[1] as number),
		enabled: enabled && projectId != null && user != null,
	});

	return { isPending, isFetching, projectTimes };
}
