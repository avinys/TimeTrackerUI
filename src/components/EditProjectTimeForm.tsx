import clsx from "clsx";
import { type FormEvent } from "react";
import toast from "react-hot-toast";
import { useUpdateProjectTime } from "../hooks/useUpdateProjectTime";
import styles from "../styles/editForm.module.css";
import type { ProjectTimeDto, UpdateProjectTimeDto } from "../types/projectTime.types";
import { toLocalInputValue } from "../util/formatTime";

type EditProjectTimeFormProps = {
	projectTime: ProjectTimeDto;
	onCloseModal?: () => void;
};

function EditProjectTimeForm({ projectTime, onCloseModal }: EditProjectTimeFormProps) {
	const { isPending, updateProjectTime } = useUpdateProjectTime(
		projectTime.projectId,
		onCloseModal
	);
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const startTimeLocal = (formData.get("startTime") as string) || "";
		const endTimeLocal = (formData.get("endTime") as string) || "";
		const comment = (formData.get("comment") as string) ?? "";

		if (!startTimeLocal) return toast.error("Please provide a valid start time");

		const startTime = new Date(startTimeLocal);
		const endTime = new Date(endTimeLocal);

		const dto: UpdateProjectTimeDto = {
			projectTimeId: projectTime.id,
			startTime,
			endTime,
			comment,
		};

		updateProjectTime(dto);
	};

	return (
		<div className="container">
			<div className={styles.formContainer}>
				<h2 className={styles.title}>Edit project time</h2>
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
							{isPending ? "Updating..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditProjectTimeForm;
