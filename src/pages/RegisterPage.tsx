import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import SpinnerMini from "../components/SpinnerMini";
import { useRegister } from "../hooks/useRegister";
import styles from "../styles/form.module.css";
import type { CreateUserDto } from "../types/auth.types";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
	const { register, isPending } = useRegister();
	const navigate = useNavigate();

	const [form, setForm] = useState<CreateUserDto>({ username: "", email: "", password: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (form.username.includes("@")) {
			toast.error("Username cannot contain '@'.");
			return;
		}

		register(form);
	};

	return (
		<div className={styles.container}>
			<h2 className="page-title">Register</h2>
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

				<button
					type="submit"
					className={clsx("btn", styles.submitButton)}
					disabled={isPending}
				>
					{isPending ? <SpinnerMini /> : "Register"}
				</button>
			</form>
			<GoogleSignInButton onSuccess={() => navigate("/dashboard")} />
			<p className="note">
				* The Google Sign in is stil in Testing mode. If you would like to access the
				application through Google, contact me.
			</p>
		</div>
	);
}
