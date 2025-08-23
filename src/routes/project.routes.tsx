import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectTimesPage from "../pages/ProjectTimesPage";
import { ProjectTimesProvider } from "../context/ProjectTimesContext";
import SummaryPage from "../pages/SummaryPage";
// import { SummaryProvider } from '../context/SummaryContext';

export const projectRoutes: RouteObject[] = [
	{
		path: "/dashboard",
		element: (
			<ProtectedRoute>
				<Dashboard />
			</ProtectedRoute>
		),
	},

	{
		path: "create-project",
		element: (
			<ProtectedRoute>
				<CreateProjectPage />
			</ProtectedRoute>
		),
	},

	{
		path: "project-time/:projectId",
		element: (
			<ProtectedRoute>
				<ProjectTimesProvider>
					<ProjectTimesPage />
				</ProjectTimesProvider>
			</ProtectedRoute>
		),
	},

	{
		path: "summary",
		element: (
			<ProtectedRoute>
				{/* <SummaryProvider> */}
				<SummaryPage />
				{/* </SummaryProvider> */}
			</ProtectedRoute>
		),
	},
];
