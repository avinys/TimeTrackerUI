import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthService } from "../services/AuthService";
import styles from "../styles/form.module.css";
import type { CreateUserDto } from "../types/auth.types";

export default function RegisterPage() {
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const [form, setForm] = useState<CreateUserDto>({ username: "", email: "", password: "" });
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (form.username.includes("@")) {
				setError("Username cannot contain '@'.");
				return;
			}

			const user = await AuthService.register(form);
			setUser(user);
			navigate("/login");
		} catch {
			setError("Registration failed. Please try again");
		}
	};

	return (
		<div className={styles.container}>
			<h2>Register</h2>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						type="text"
						name="username"
						value={form.username}
						onChange={handleChange}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="text"
						name="email"
						value={form.email}
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
					Register
				</button>
			</form>
		</div>
	);
}
