import clsx from "clsx";
import styles from "../styles/editForm.module.css";
import type { ProjectTimeDto } from "../types/projectTime.types";
// import styles from "../styles/form.module.css";

type EditProjectTimeFormProps = {
	projectTime: ProjectTimeDto;
};

function EditProjectTimeForm({ projectTime }: EditProjectTimeFormProps) {
	const handleSubmit = () => {};

	return (
		<div className="container">
			<div className={styles.formContainer}>
				<h2>Edit project time</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.inputGroup}>
						<label htmlFor="startTime">Start time</label>
						<input
							type="date"
							id="startTime"
							name="startTime"
							defaultValue={projectTime.startTime.toString()}
						/>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor="endTime">End time</label>
						<input
							type="date"
							id="endTime"
							name="endTime"
							defaultValue={projectTime.endTime?.toString() ?? ""}
						/>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor="endTime">Comment</label>
						<textarea
							id="endTime"
							name="endTime"
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
