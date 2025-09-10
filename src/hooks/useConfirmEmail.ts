// src/hooks/useConfirmEmail.ts
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";

export function useConfirmEmail() {
	const { mutate, mutateAsync, isPending, isSuccess, isError, error, reset } = useMutation({
		mutationFn: ({ userId, token }: { userId: number; token: string }) =>
			AuthService.confirmEmail(userId, token),
	});

	return {
		confirmEmail: mutate,
		confirmEmailAsync: mutateAsync,
		isPending,
		isSuccess,
		isError,
		error,
		reset,
	};
}
