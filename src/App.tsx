import { useRoutes } from "react-router-dom";
import { routes } from "./routes/app.routes";
import { useAuth } from "./auth/AuthContext";
import LoadingOlay from "./components/LoadingOverlay";
import Header from "./components/Header";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import "./styles/index.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error, _query) => {
			// avoid toasting initial “no data yet” errors if you want
			toast.error(
				(error as any)?.response?.data?.detail ||
					(error as Error).message ||
					"Request failed"
			);
		},
	}),
});

export default function App() {
	const element = useRoutes(routes);
	const { loading } = useAuth();

	if (loading) return <LoadingOlay />;

	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	);
}
