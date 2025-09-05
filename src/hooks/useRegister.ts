import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import type { CreateUserDto } from "../types/auth.types";
import { apiMessage } from "../util/apiError";

export function useRegister() {
	const navigate = useNavigate();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: (dto: CreateUserDto) => AuthService.register(dto),
		onSuccess: () => {
			navigate("/");
		},
		onError: (err) => {
			toast.error(apiMessage(err, "Registration failed. Please try again."));
		},
	});

	return { register: mutate, isPending, isError };
}
