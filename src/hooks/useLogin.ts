import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../auth/AuthContext";
import type { LoginDto } from "../types/auth.types";

export function useLogin() {
	const qc = useQueryClient();
	const { setUser } = useAuth();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: (dto: LoginDto) => AuthService.login(dto),
		onSuccess: (user) => {
			setUser(user);
			qc.setQueryData(["auth", "me"], user);
		},
	});

	return { login: mutate, isPending, isError };
}
