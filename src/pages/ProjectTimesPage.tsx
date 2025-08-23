import { useParams } from "react-router-dom";
import ProjectTimeClockContainer from "../components/ProjectTimeClockContainer";
import ProjectTimeList from "../components/ProjectTimeList";

export default function ProjectTimesPage() {
	const { projectId } = useParams<{ projectId: string }>();
	if (!projectId) throw new Error("projectId is missing");

	const numericProjectId = parseInt(projectId, 10);

	return (
		<div className="container">
			<ProjectTimeClockContainer projectId={numericProjectId} />
			<h2>Previous Recorded Times: </h2>
			<ProjectTimeList projectId={numericProjectId} />
		</div>
	);
}
