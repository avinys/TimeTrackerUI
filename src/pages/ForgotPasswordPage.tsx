import { useState } from "react";
import type { FormEvent } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import styles from "../styles/form.module.css";
import clsx from "clsx";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const { mutate, isPending } = useForgotPassword();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!email) return;
		mutate({ email: email.trim().toLowerCase() });
	};

	return (
		<div className={styles.container}>
			<h1 className="page-title">Forgot password</h1>

			<form onSubmit={onSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>Email</label>
					<input
						className={styles.input}
						type="email"
						name="email"
						required
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
					/>
				</div>

				<button
					className={clsx("btn", styles.submitButton)}
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Sending…" : "Send reset link"}
				</button>
			</form>
			<p className="note">
				Enter your email. If it exists, we’ll send a password reset link.
			</p>
		</div>
	);
}
