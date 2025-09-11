import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../auth/AuthContext";
import { friendlyAuthError } from "../util/httpErrors";
import toast from "react-hot-toast";

export function useGoogleLogin() {
	const queryClient = useQueryClient();
	const { setUser } = useAuth();

	const { mutate, mutateAsync, isPending, isError } = useMutation({
		mutationFn: (idToken: string) => AuthService.loginWithGoogle({ idToken }),
		onSuccess: (user) => {
			setUser(user);
			queryClient.setQueryData(["auth", "me"], user);
		},
		onError: (err) => {
			toast.error(friendlyAuthError(err, "Google sign-in"));
		},
	});

	return { googleLogin: mutate, googleLoginAsync: mutateAsync, isPending, isError };
}
