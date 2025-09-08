import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { JSX } from "react";
import Spinner from "./Spinner";

interface Props {
	children: JSX.Element;
	requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) return <Spinner />;

	if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
	if (requiredRole && user.role !== requiredRole) return <Navigate to="/unauthorized" />;

	return children;
};
