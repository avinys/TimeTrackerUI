import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ProjectList from '../components/ProjectList';
import '../styles/index.css';



export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="container">
            <h1 className="page-title">Dashboard</h1>
            <p>Welcome, {user?.username}!</p>
            <h2>Your projects:</h2>
            <ProjectList />
            <div className="actions-container">
                <Link to="/create-project" className="btn">Create New Project</Link>
                <Link to="/summary" className="btn">View Summary</Link>
            </div>
        </div>
    );
}