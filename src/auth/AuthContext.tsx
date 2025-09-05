// auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { UserDto, AuthContextType } from "../types/auth.types";
import { useGetMe } from "../hooks/useGetMe";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserDto | null>(null);
	const { data, isPending, isError } = useGetMe();

	useEffect(() => {
		if (data) setUser(data);
		if (isError) setUser(null);
	}, [data, isError]);

	return (
		<AuthContext.Provider value={{ user, setUser, loading: isPending }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
