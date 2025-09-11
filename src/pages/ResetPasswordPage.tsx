import clsx from "clsx";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import styles from "../styles/form.module.css";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
	const [sp] = useSearchParams();
	const { mutate, isPending } = useResetPassword();

	const uid = useMemo(() => Number(sp.get("uid")), [sp]);
	const token = useMemo(() => sp.get("token") ?? "", [sp]);

	const [pwd, setPwd] = useState("");
	const [pwd2, setPwd2] = useState("");
	const [show, setShow] = useState(false);

	const invalidLink = !uid || !token;

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (invalidLink) return;
		if (pwd.length < 8) {
			toast.error("Password must be at least 8 characters.");
			return;
		}
		if (pwd !== pwd2) {
			toast.error("Passwords do not match.");
			return;
		}

		mutate({ userId: uid, token, newPassword: pwd });
	};

	if (invalidLink) {
		return (
			<div className={styles.card}>
				<h1 className={styles.title}>Invalid link</h1>
				<p className={styles.sub}>
					This reset link is missing required data. Please request a new one.
				</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1 className="page-title">Set a new password</h1>
			<form onSubmit={onSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label className={styles.label}>New password</label>
					<div className={styles.passwordRow}>
						<input
							className={styles.input}
							type={show ? "text" : "password"}
							autoComplete="new-password"
							required
							minLength={8}
							value={pwd}
							onChange={(e) => setPwd(e.target.value)}
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="btn btnOutline"
							aria-label={show ? "Hide password" : "Show password while holding"}
							onPointerDown={() => setShow(true)}
							onPointerUp={() => setShow(false)}
							onPointerLeave={() => setShow(false)}
							onPointerCancel={() => setShow(false)}
							onBlur={() => setShow(false)}
							onKeyDown={(e) => {
								if (e.key === " " || e.key === "Spacebar") {
									e.preventDefault(); // prevent button "click"
									setShow(true);
								}
							}}
							onKeyUp={(e) => {
								if (e.key === " " || e.key === "Spacebar" || e.key === "Escape") {
									setShow(false);
								}
							}}
						>
							{show ? <HiEyeSlash /> : <HiEye />}
						</button>
					</div>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label}>Confirm password</label>
					<input
						className={styles.input}
						type={show ? "text" : "password"}
						autoComplete="new-password"
						required
						minLength={8}
						value={pwd2}
						onChange={(e) => setPwd2(e.target.value)}
						placeholder="••••••••"
					/>
				</div>

				<button
					className={clsx("btn", styles.submitButton)}
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Updating…" : "Update password"}
				</button>
			</form>
			{/* <p className={styles.hint}>Tip: use at least 8 characters.</p> */}
		</div>
	);
}
