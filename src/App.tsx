import { Toaster } from "react-hot-toast";
import { useRoutes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Header from "./components/Header";
import LoadingOlay from "./components/LoadingOverlay";
import { routes } from "./routes/app.routes";
import "./styles/index.css";

export default function App() {
	const element = useRoutes(routes);
	const { loading } = useAuth();

	if (loading) return <LoadingOlay />;

	return (
		<>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: { fontSize: "14px" },
					success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
					error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
				}}
			/>

			<div className="heroBg" aria-hidden="true" />
			<Header />
			{element}
		</>
	);
}
