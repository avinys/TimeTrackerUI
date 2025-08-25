import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProjectTimesProvider } from "./context/ProjectTimesContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ProjectTimesProvider>
					<App />
				</ProjectTimesProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
