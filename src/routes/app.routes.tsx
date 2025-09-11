import type { RouteObject } from "react-router-dom";

import { authRoutes } from "./auth.routes";
import { projectRoutes } from "./project.routes";

import { HomeRedirect } from "./HomeRedirect";
import NotFoundPage from "../pages/NotFoundPage";
import Unauthorized from "../pages/UnauthorizedPage";
import { userRoutes } from "./user.routes";
import ContactUsPage from "../pages/ContactUsPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfUsePage from "../pages/TermsOfUsePage";

export const routes: RouteObject[] = [
	{ path: "/", element: <HomeRedirect /> },
	{ path: "/unauthorized", element: <Unauthorized /> },
	{ path: "/contact", element: <ContactUsPage /> },
	{ path: "/privacy", element: <PrivacyPolicyPage /> },
	{ path: "/terms", element: <TermsOfUsePage /> },
	...authRoutes,
	...projectRoutes,
	...userRoutes,
	{ path: "*", element: <NotFoundPage /> },
];
