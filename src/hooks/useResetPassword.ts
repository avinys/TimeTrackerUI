import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import toast from "react-hot-toast";
import type { ResetPasswordDto } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: (payload: ResetPasswordDto) => AuthService.resetPassword(payload),
		onSuccess: (res) => {
			toast.success(res?.message ?? "Password updated successfully.");
			navigate("/login");
		},
		onError: (err: any) => {
			const msg =
				err?.response?.data?.message ?? "Reset failed. The link may be invalid or expired.";
			toast.error(msg);
		},
	});
}
