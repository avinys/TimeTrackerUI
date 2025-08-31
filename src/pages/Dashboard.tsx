import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProjectList from "../components/ProjectList";
import "../styles/index.css";
import Modal from "../components/Modal";
import CreateProjectForm from "../components/CreateProjectForm";

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<div className="container">
			<Modal>
				<h1 className="page-title">Dashboard</h1>
				<p>Welcome, {user?.username}!</p>
				<h2>Your projects:</h2>
				<ProjectList />
				<div className="actions-container">
					<Modal.Open opens="create-project">
						<button className="btn">Create New Project</button>
					</Modal.Open>
					<Link to="/summary" className="btn">
						View Summary
					</Link>
				</div>
				<Modal.Window name="create-project">
					<CreateProjectForm />
				</Modal.Window>
			</Modal>
		</div>
	);
}
