import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import WelcomePage from '../pages/WelcomePage';

export function HomeRedirect() {
    const { user } = useAuth();
    console.log("HomeRedirect acts");
    if(user) {
        return <Navigate to="/dashboard" />
    } else {
        console.log("Redirecting to Welcome Page");
        return <WelcomePage />
    }
}