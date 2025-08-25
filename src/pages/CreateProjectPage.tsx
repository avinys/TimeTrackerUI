import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/ProjectService";
import styles from "../styles/form.module.css";
import clsx from "clsx";
import type { AxiosError } from "axios";

export default function CreateProjectPage() {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name.trim()) {
			setError("Project name is required");
			return;
		}

		try {
			await ProjectService.createProject({ name });
			navigate("/dashboard");
		} catch (err: unknown) {
			const error = err as AxiosError<{ message: string }>;
			setError(
				error.response?.data?.message || "Failed to create project. Please try again."
			);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className="page-title">Create New Project</h1>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="name">Name of Project</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="actions-container">
					<button type="submit" className={clsx("btn", styles.submitButton)}>
						Create Project
					</button>
				</div>
			</form>

			{error && <p className="form-error">{error}</p>}
		</div>
	);
}
