import { useMutation } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import type { ChangePasswordDto } from "../types/auth.types";
import toast from "react-hot-toast";

export function useChangePassword() {
	const { mutate, isPending } = useMutation({
		mutationFn: (dto: ChangePasswordDto) => UserService.changePassword(dto),
		onSuccess: (res) => toast.success(res?.message ?? "Password succesfully changed"),
		onError: (err: any) =>
			toast.error(err?.response?.data?.message ?? "Could not change password"),
	});
	return { changePassword: mutate, isPending };
}
