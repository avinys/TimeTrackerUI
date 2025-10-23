import { format } from 'date-fns'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUpdateProject } from '../hooks/useUpdateProject'
import styles from '../styles/projectList.module.css'
import type { ProjectDto } from '../types/project.types'
import Modal from './Modal'

function ProjectListRow({
  p,
  setProjectToDelete
}: {
  p: ProjectDto
  setProjectToDelete: (p: ProjectDto) => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { updateProject, isPending } = useUpdateProject()

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (p.isCompleted) el.setAttribute('inert', '')
    else el.removeAttribute('inert')
  }, [p.isCompleted])

  return (
    <li className={styles.listItemContainer}>
      <div
        className={`${styles.listRow} ${styles.listItem} 
				${p.isCompleted ? styles.blurred : ''}`}
        ref={contentRef}
      >
        <p className={styles.name}>{p.name}</p>
        <p className={styles.date}>{format(new Date(p.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
        {p.isRunning ? (
          <p className={styles.timerRunningIndicator}>Running</p>
        ) : (
          <p className={styles.timerNotRunningIndicator}>Stopped</p>
        )}

        <div className={styles.projectActions}>
          <Link to={`/project-time/${p.id}`} className="btn btnSubtle btn--md">
            View
          </Link>

          <button
            type="button"
            onClick={() => updateProject({ projectId: p.id, isCompleted: true })}
            className="btn btnGhost btn--md"
          >
            {isPending ? 'Completing...' : 'Complete'}
          </button>
          <Modal.Open opens="confirm-delete-project">
            <button
              type="button"
              onClick={() => setProjectToDelete(p)}
              className="btn btnDanger btn--md"
            >
              Delete
            </button>
          </Modal.Open>
        </div>
      </div>

      {p.isCompleted && (
        <div className={`${styles.listItem} ${styles.contentUI}`} aria-hidden={false}>
          <p className={styles.name}>{p.name}</p>
          <div className={styles.projectActions}>
            <button
              type="button"
              className={`btn btnSubtle btn--md`}
              onClick={() => {
                updateProject({ projectId: p.id, isCompleted: false })
              }}
            >
              {isPending ? 'Removing...' : 'Remove Completion'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default ProjectListRow
