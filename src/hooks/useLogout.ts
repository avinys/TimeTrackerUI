import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export function useLogout() {
	const qc = useQueryClient();
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: AuthService.logout,
		onSuccess: async () => {
			setUser(null);
			await qc.clear(); // wipe all cached queries
			navigate("/login");
		},
	});

	return { logout: mutateAsync, isPending, isError };
}
