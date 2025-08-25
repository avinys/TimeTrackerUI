import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginDto } from "../types/auth.types";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../auth/AuthContext";
import styles from "../styles/form.module.css";
import clsx from "clsx";

export default function LoginPage() {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState<LoginDto>({
		identifier: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const user = await AuthService.login(form);
			setUser(user);
			navigate("/dashboard");
		} catch {
			setError("Invalid login credentials.");
		}
	};

	return (
		<div className={styles.container}>
			<h2 className="page-title">Login</h2>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="identifier">Username or Email</label>
					<input
						id="ientifier"
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
				{error && <p className="error-message">{error}</p>}
				<button type="submit" className={clsx("btn", styles.submitButton)}>
					Log In
				</button>
			</form>
		</div>
	);
}
