import type { RouteObject } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export const authRoutes: RouteObject[] = [
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> }
];