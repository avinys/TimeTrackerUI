import clsx from "clsx";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { useCreateProject } from "../hooks/useCreateProject";
import styles from "../styles/editForm.module.css";
import type { CreateProjectDto } from "../types/project.types";
import SpinnerMini from "./SpinnerMini";

type CreateProjectFormProps = { onCloseModal?: () => void };

function CreateProjectForm({ onCloseModal }: CreateProjectFormProps) {
	const { createProject, isPending } = useCreateProject();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = (formData.get("name") as string)?.trim();

		if (!name) {
			toast.error("Please provide a valid project name");
			return;
		}

		const dto: CreateProjectDto = { name };
		createProject(dto);
		onCloseModal?.();
	};

	return (
		<div className={styles.wrap}>
			<h1 className={styles.title}>Create New Project</h1>

			<form className={styles.form} onSubmit={handleSubmit} noValidate>
				<div className={styles.fieldFull}>
					<label htmlFor="name">Name of Project</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						minLength={2}
						autoComplete="off"
						autoFocus
					/>
				</div>

				<div className={styles.actions}>
					<button
						type="button"
						className={clsx("btn", "btnOutline")}
						onClick={onCloseModal}
						disabled={isPending}
					>
						Cancel
					</button>

					<button
						type="submit"
						className={clsx("btn", "btnPrimary")}
						disabled={isPending}
					>
						{isPending ? <SpinnerMini /> : "Create Project"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateProjectForm;
