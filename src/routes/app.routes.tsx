import type { RouteObject } from "react-router-dom";

import { authRoutes } from "./auth.routes";
import { projectRoutes } from "./project.routes";

import { HomeRedirect } from "./HomeRedirect";
import NotFoundPage from "../pages/NotFoundPage";
import Unauthorized from "../pages/UnauthorizedPage";
import { userRoutes } from "./user.routes";
import ContactUsPage from "../pages/ContactUsPage";

export const routes: RouteObject[] = [
	{ path: "/", element: <HomeRedirect /> },
	{ path: "/unauthorized", element: <Unauthorized /> },
	{ path: "/contact", element: <ContactUsPage /> },
	...authRoutes,
	...projectRoutes,
	...userRoutes,
	{ path: "*", element: <NotFoundPage /> },
];
