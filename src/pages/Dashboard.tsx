import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import ProjectList from '../components/ProjectList'
import styles from '../styles/dashboard.module.css'
import Modal from '../components/Modal'
import CreateProjectForm from '../components/CreateProjectForm'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container">
      <Modal>
        <div className={styles.titleContainer}>
          <h1 className="page-title">Welcome, {user?.username}!</h1>
        </div>
        <div className="actions-container">
          <Modal.Open opens="create-project">
            <button type="button" className="btn btnPrimary btn--lg">
              Create New Project
            </button>
          </Modal.Open>
          <Link to="/summary" className="btn btnPrimary btn--lg">
            View Summary
          </Link>
        </div>
        <ProjectList />

        <Modal.Window name="create-project">
          <CreateProjectForm />
        </Modal.Window>
      </Modal>
    </div>
  )
}
