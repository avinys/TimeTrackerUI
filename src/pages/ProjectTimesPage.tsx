import { useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmDeleteProjectTime from "../components/ConfirmDeleteProjectTime";
import EditProjectTimeForm from "../components/EditProjectTimeForm";
import Modal from "../components/Modal";
import ProjectTimeClockContainer from "../components/ProjectTimeClockContainer";
import ProjectTimeList from "../components/ProjectTimeList";
import type { ProjectTimeDto } from "../types/projectTime.types";

export default function ProjectTimesPage() {
	const { projectId } = useParams<{ projectId: string }>();
	const [projectTimeToDelete, setProjectTimeToDelete] = useState<ProjectTimeDto | null>(null);
	const [projectTimeToEdit, setProjectTimeToEdit] = useState<ProjectTimeDto | null>(null);
	const [showCommentExpanders, setShowCommentExpanders] = useState<boolean>(false);

	return (
		<div className="container">
			<ProjectTimeClockContainer projectId={Number(projectId)} />
			<h2>Previous Recorded Times: </h2>
			<div className="container">
				<Modal>
					<ProjectTimeList
						renderActions={(p: ProjectTimeDto) => (
							<>
								<Modal.Open opens="edit-project-time">
									<button
										type="button"
										onClick={() => setProjectTimeToEdit(p)}
										className="btn btnSubtle btn--md"
									>
										Edit
									</button>
								</Modal.Open>
								<Modal.Open opens="confirm-delete-project-time">
									<button
										type="button"
										onClick={() => setProjectTimeToDelete(p)}
										className="btn btnDanger btn--md"
									>
										Delete
									</button>
								</Modal.Open>
							</>
						)}
					/>
					<Modal.Window name="edit-project-time">
						{projectTimeToEdit && (
							<EditProjectTimeForm projectTime={projectTimeToEdit} />
						)}
					</Modal.Window>
					<Modal.Window name="confirm-delete-project-time">
						{projectTimeToDelete && (
							<ConfirmDeleteProjectTime projectTime={projectTimeToDelete} />
						)}
					</Modal.Window>
				</Modal>
			</div>
		</div>
	);
}
