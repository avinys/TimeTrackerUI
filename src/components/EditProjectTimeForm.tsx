import clsx from "clsx";
import styles from "../styles/editForm.module.css";
import type { ProjectTimeDto, UpdateProjectTimeDto } from "../types/projectTime.types";
import { useState, type FormEvent } from "react";
import { toLocalInputValue } from "../util/formatTime";
import { ProjectTimeService } from "../services/ProjectTimeService";
import { useProjectTimes } from "../context/ProjectTimesContext";

type EditProjectTimeFormProps = {
	projectTime: ProjectTimeDto;
	onCloseModal: () => void;
};

function EditProjectTimeForm({ projectTime, onCloseModal }: EditProjectTimeFormProps) {
	const [error, setError] = useState<string>("");
	const { projectTimes, setProjectTimes } = useProjectTimes();
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const startTimeLocal = (formData.get("startTime") as string) || "";
		const endTimeLocal = (formData.get("endTime") as string) || "";
		const comment = (formData.get("comment") as string) ?? "";

		if (!startTimeLocal) return setError("Please provide a valid start time");

		const startTime = new Date(startTimeLocal);
		const endTime = new Date(endTimeLocal);

		const dto: UpdateProjectTimeDto = {
			projectTimeId: projectTime.id,
			startTime,
			endTime,
			comment,
		};

		const response = await ProjectTimeService.updateProjectTime(dto);
		console.log("response: ", response);
		if (!response)
			setError("Edit failed! Please check the input fields and confirm they are correct.");
		else {
			setProjectTimes(projectTimes.map((pt) => (pt.id === response.id ? response : pt)));
			onCloseModal();
		}
	};

	return (
		<div className="container">
			<div className={styles.formContainer}>
				<h2 className={styles.title}>Edit project time</h2>
				<p className={styles.error}>{error}</p>
				<form onSubmit={handleSubmit} key={projectTime.id}>
					<div className={styles.inputGroup}>
						<label htmlFor="startTime">Start time</label>
						<input
							type="datetime-local"
							id="startTime"
							name="startTime"
							step="1"
							defaultValue={toLocalInputValue(projectTime.startTime, true)}
							required
						/>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor="endTime">End time</label>
						<input
							type="datetime-local"
							id="endTime"
							name="endTime"
							step="1"
							defaultValue={toLocalInputValue(projectTime.endTime, true)}
						/>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor="comment">Comment</label>
						<textarea
							id="comment"
							name="comment"
							defaultValue={projectTime.comment ?? ""}
						/>
					</div>

					<div className={styles.actions}>
						<button type="submit" className={clsx("btn", styles.submitButton)}>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditProjectTimeForm;
