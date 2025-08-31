import clsx from "clsx";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { useCreateProject } from "../hooks/useCreateProject";
import styles from "../styles/editForm.module.css";
import type { CreateProjectDto } from "../types/project.types";
import SpinnerMini from "./SpinnerMini";

type CreateProjectFormProps = {
	onCloseModal: () => void;
};

function CreateProjectForm({ onCloseModal }: CreateProjectFormProps) {
	const { createProject, isPending } = useCreateProject();
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name");
		if (typeof name !== "string" || name.trim().length <= 0)
			return toast.error("Please provide a valid project name");

		const dto: CreateProjectDto = { name };
		createProject(dto);
		onCloseModal();
	};

	return (
		<div className="container">
			<h1 className="page-title">Create New Project</h1>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="name">Name of Project</label>
					<input id="name" name="name" type="text" required />
				</div>
				<div className="actions-container">
					<button type="submit" className={clsx("btn", styles.submitButton)}>
						{isPending ? <SpinnerMini /> : "Create Project"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateProjectForm;
