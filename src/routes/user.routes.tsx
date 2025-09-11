import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import ChangePasswordPage from "../pages/ChangePasswordPage";

export const userRoutes: RouteObject[] = [
	{
		path: "/me/password",
		element: (
			<ProtectedRoute>
				<ChangePasswordPage />
			</ProtectedRoute>
		),
	},
];
