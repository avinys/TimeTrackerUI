import { useQuery } from "@tanstack/react-query";
import { ProjectTimeService } from "../services/ProjectTimeService";

export function useGetProjectTimes(projectId: number | null, enabled = true) {
	const {
		isPending,
		isFetching,
		data: projectTimes,
	} = useQuery({
		queryKey: ["projectTimes", projectId ?? null],
		queryFn: ({ queryKey }) => ProjectTimeService.getProjectTimes(queryKey[1] as number),
		enabled: enabled && projectId != null,
	});

	return { isPending, isFetching, projectTimes };
}
