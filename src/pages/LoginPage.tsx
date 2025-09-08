import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerMini from "../components/SpinnerMini";
import { useLogin } from "../hooks/useLogin";
import styles from "../styles/form.module.css";
import type { LoginDto } from "../types/auth.types";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login, isPending, isError } = useLogin();

	const [form, setForm] = useState<LoginDto>({ identifier: "", password: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login(form, {
			onSuccess: () => navigate("/dashboard"),
		});
	};

	return (
		<div className={styles.container}>
			<h2 className="page-title">Login</h2>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="identifier">Username or Email</label>
					<input
						id="identifier"
						type="text"
						name="identifier"
						value={form.identifier}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						name="password"
						value={form.password}
						onChange={handleChange}
						required
					/>
				</div>

				<button
					type="submit"
					className={clsx("btn", styles.submitButton)}
					disabled={isPending}
				>
					{isPending ? <SpinnerMini /> : "Log In"}
				</button>
			</form>
		</div>
	);
}
