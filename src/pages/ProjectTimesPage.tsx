import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import ProjectTimeClockContainer from "../components/ProjectTimeClockContainer";
import ProjectTimeList from "../components/ProjectTimeList";
import { useProjectTimes } from "../context/ProjectTimesContext";
import { ProjectTimeService } from "../services/ProjectTimeService";

export default function ProjectTimesPage() {
	const { projectId } = useParams<{ projectId: string }>();
	const { setProjectTimes } = useProjectTimes();

	useEffect(() => {
		const fetchProjectTimes = async () => {
			let fetchedProjectTimes = [];
			if (projectId) {
				fetchedProjectTimes = await ProjectTimeService.getProjectTimes(Number(projectId));
				setProjectTimes(fetchedProjectTimes);
			}
		};
		fetchProjectTimes();
	}, [projectId, setProjectTimes]);

	if (!projectId) throw new Error("projectId is missing");

	// const handle;

	return (
		<div className="container">
			<ProjectTimeClockContainer projectId={Number(projectId)} />
			<h2>Previous Recorded Times: </h2>
			<div className="container">
				<ProjectTimeList
					renderActions={
						<>
							<Modal.Open opens="delete">
								<button className="btn-alt">Delete</button>
							</Modal.Open>
							<Modal.Open opens="edit">
								<button className="btn">Edit</button>
							</Modal.Open>
						</>
					}
				/>
			</div>
		</div>
	);
}
