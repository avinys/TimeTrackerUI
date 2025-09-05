import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import type { UserDto } from "../types/auth.types";

export function useGetMe() {
	const { isPending, data, isError } = useQuery<UserDto>({
		queryKey: ["auth", "me"],
		queryFn: AuthService.getMe,
		retry: false,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
		meta: { suppressGlobalError: true },
	});

	return { isPending, data, isError };
}
