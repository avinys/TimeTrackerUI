import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react";

interface Props {
	children: JSX.Element;
	requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
	const { user } = useAuth();

	if (!user) return <Navigate to="/login" />;
	if (requiredRole && user.role !== requiredRole)
		return <Navigate to="/unauthorized" />;

	return children;
};
