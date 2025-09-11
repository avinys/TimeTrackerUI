// auth/AuthContext.tsx
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import Spinner from "../components/Spinner";
import { useGetMe } from "../hooks/useGetMe";
import type { AuthContextType, UserDto } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { data, isPending } = useGetMe();
	const queryClient = useQueryClient();

	const setUser = (u: UserDto | null) => {
		if (u) queryClient.setQueryData(["auth", "me"], u);
		else {
			queryClient.cancelQueries({ queryKey: ["auth", "me"] });
			queryClient.setQueryData(["auth", "me"], null); // <-- force immediate UI update
			queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
		}
	};

	if (isPending) return <Spinner />;

	return (
		<AuthContext.Provider value={{ user: data ?? null, setUser, loading: isPending }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
