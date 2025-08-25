import { useParams } from "react-router-dom";
import ProjectTimeClockContainer from "../components/ProjectTimeClockContainer";
import ProjectTimeList from "../components/ProjectTimeList";
import { useProjectTimes } from "../context/ProjectTimesContext";
import { useEffect } from "react";
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

	const handleDelete = async (id: number) => {
		try {
			await ProjectTimeService.deleteProjectTime({
				projectTimeId: id,
			});
			setProjectTimes((prev) => prev.filter((pt) => pt.id !== id));
		} catch (error) {
			console.error("Failed to delete project time", error);
		}
	};

	return (
		<div className="container">
			<ProjectTimeClockContainer projectId={Number(projectId)} />
			<h2>Previous Recorded Times: </h2>
			<div className="container">
				<ProjectTimeList
					renderActions={(row) => (
						<button className="btn-alt" onClick={() => handleDelete(row.id)}>
							Delete
						</button>
					)}
				/>
			</div>
		</div>
	);
}
