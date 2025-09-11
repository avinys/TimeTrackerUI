import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProjectTimesProvider } from "./context/ProjectTimesContext.tsx";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import "@fontsource-variable/inter";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
		},
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (query?.meta && (query.meta as any).suppressGlobalError) return;
			toast.error(
				(error as any)?.response?.data?.detail ||
					(error as Error).message ||
					"Request failed"
			);
		},
	}),
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<ProjectTimesProvider>
						<App />
					</ProjectTimesProvider>
				</AuthProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
