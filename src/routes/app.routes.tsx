import type { RouteObject } from "react-router-dom";

import { authRoutes } from "./auth.routes";
import { projectRoutes } from "./project.routes";

import { HomeRedirect } from "./HomeRedirect";
import NotFoundPage from "../pages/NotFoundPage";
import Unauthorized from "../pages/UnauthorizedPage";
import { userRoutes } from "./user.routes";

export const routes: RouteObject[] = [
	{ path: "/", element: <HomeRedirect /> },
	{ path: "/unauthorized", element: <Unauthorized /> },
	...authRoutes,
	...projectRoutes,
	...userRoutes,
	{ path: "*", element: <NotFoundPage /> },
];
