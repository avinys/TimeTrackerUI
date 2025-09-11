import type { RouteObject } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const authRoutes: RouteObject[] = [
	{ path: "/login", element: <LoginPage /> },
	{ path: "/register", element: <RegisterPage /> },
	{ path: "/check-email", element: <CheckEmailPage /> },
	{ path: "/confirm", element: <ConfirmEmailPage /> },
	{ path: "/password/forgot", element: <ForgotPasswordPage /> },
	{ path: "reset-password", element: <ResetPasswordPage /> },
];
