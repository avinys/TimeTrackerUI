import { useProjectTimes } from '../context/ProjectTimesContext';
import { formatDate, formatTime, getTimeDifference } from '../util/formatTime';
import styles from '../styles/projectList.module.css';

type ProjectTimeListProps = {
    handleDelete: (id: number) => void;
};

export default function ProjectTimeList(props: ProjectTimeListProps) {
    const { projectTimes, setProjectTimes } = useProjectTimes();

    return (
        <div className="container">
            <ul className={styles.projectList}>
                <li className={styles.listHeader}>
                    <p>Start</p>
                    <p>End</p>
                    <p>Total time</p>
                    <div className={styles.projectActions}>Actions</div>
                </li>
                {projectTimes.map((p) => (
                    <li key={p.id} className={styles.listItem}>
                        <p>{formatDate(p.startTime)}</p>
                        <p>{p.endTime ? formatDate(p.endTime) : "ongoing"}</p>
                        <p>{p.endTime ? formatTime(getTimeDifference(p.startTime, p.endTime)) : ""}</p>
                        <div className={styles.projectActions}>
                            <button onClick={() => props.handleDelete(p.id)} className="btn-alt">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}