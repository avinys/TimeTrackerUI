import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import type { UserDto } from "../types/auth.types";

export function useGetMe() {
	const { isPending, data, isError } = useQuery<UserDto>({
		queryKey: ["auth", "me"],
		queryFn: AuthService.getMe,
		retry: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		refetchOnWindowFocus: false,
		meta: { suppressGlobalError: true },
	});

	return { isPending, data, isError };
}
