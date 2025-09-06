import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import WelcomePage from "../pages/WelcomePage";

export function HomeRedirect() {
	const { user } = useAuth();
	if (user) {
		return <Navigate to="/dashboard" />;
	} else {
		return <WelcomePage />;
	}
}
