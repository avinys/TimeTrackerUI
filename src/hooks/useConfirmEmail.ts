// src/hooks/useConfirmEmail.ts
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import toast from "react-hot-toast";
import type { ConfirmEmailDto } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

export function useConfirmEmail() {
	const navigate = useNavigate();
	const { mutate, mutateAsync, isPending, isSuccess, isError, error, reset } = useMutation({
		mutationFn: (dto: ConfirmEmailDto) => AuthService.confirmEmail(dto),
		onSuccess: () => {
			toast.success("Email was successfully confirmed", { id: "confirm-email-success" });
			navigate("/login");
		},
		onError: () => toast.error("Invalid or expired confirmation link."),
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
