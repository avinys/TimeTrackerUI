import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthService } from "../services/AuthService";
import type { ForgotPasswordDto } from "../types/auth.types";

export function useForgotPassword() {
	const { mutate, isPending } = useMutation({
		mutationFn: (dto: ForgotPasswordDto) => AuthService.forgotPassword(dto),
		onSuccess: (res) => {
			toast.success(
				res?.message ?? "If the email exists, you'll receive a reset link shortly."
			);
		},
		onError: (err: any) => {
			const msg = err?.response?.data?.message ?? "Something went wrong. Please try again.";
			toast.error(msg);
		},
	});
	return { mutate, isPending };
}
