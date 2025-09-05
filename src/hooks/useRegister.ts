import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import type { CreateUserDto } from "../types/auth.types";

export function useRegister() {
	const navigate = useNavigate();

	const { mutate, isPending, isError } = useMutation({
		mutationFn: (dto: CreateUserDto) => AuthService.register(dto),
		onSuccess: () => {
			navigate("/");
		},
	});

	return { register: mutate, isPending, isError };
}
