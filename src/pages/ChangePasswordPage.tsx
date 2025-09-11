import clsx from "clsx";
import { useState } from "react";
import SpinnerMini from "../components/SpinnerMini";
import { useChangePassword } from "../hooks/useChangePassword";
import styles from "../styles/form.module.css";
import toast from "react-hot-toast";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function ChangePasswordPage() {
	const { changePassword, isPending } = useChangePassword();

	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (form.newPassword.length < 8) {
			toast.error("New password must be at least 8 characters.");
			return;
		}
		if (form.newPassword !== form.confirmNewPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		changePassword(
			{ currentPassword: form.currentPassword, newPassword: form.newPassword },
			{
				onSuccess: () => {
					setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
				},
			}
		);
	};

	return (
		<div className={styles.container}>
			<h2 className="page-title">Change Password</h2>

			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label className={styles.label} htmlFor="currentPassword">
						Current password
					</label>
					<div className={styles.passwordRow}>
						<input
							id="currentPassword"
							name="currentPassword"
							className={styles.input}
							type={showCurrent ? "text" : "password"}
							value={form.currentPassword}
							onChange={handleChange}
							required
							autoComplete="current-password"
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="btn btnOutline"
							aria-label={
								showCurrent ? "Hide password" : "Show password while holding"
							}
							onPointerDown={() => setShowCurrent(true)}
							onPointerUp={() => setShowCurrent(false)}
							onPointerLeave={() => setShowCurrent(false)}
							onPointerCancel={() => setShowCurrent(false)}
							onBlur={() => setShowCurrent(false)}
							onKeyDown={(e) => {
								if (e.key === " " || e.key === "Spacebar") {
									e.preventDefault();
									setShowCurrent(true);
								}
							}}
							onKeyUp={(e) => {
								if (e.key === " " || e.key === "Spacebar" || e.key === "Escape") {
									setShowCurrent(false);
								}
							}}
						>
							{showCurrent ? <HiEyeSlash /> : <HiEye />}
						</button>
					</div>
				</div>

				<div className={styles.inputGroup}>
					<label className={styles.label} htmlFor="newPassword">
						New password
					</label>
					<div className={styles.passwordRow}>
						<input
							id="newPassword"
							name="newPassword"
							className={styles.input}
							type={showNew ? "text" : "password"}
							value={form.newPassword}
							onChange={handleChange}
							required
							minLength={8}
							autoComplete="new-password"
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="btn btnOutline"
							aria-label={showNew ? "Hide password" : "Show password while holding"}
							onPointerDown={() => setShowNew(true)}
							onPointerUp={() => setShowNew(false)}
							onPointerLeave={() => setShowNew(false)}
							onPointerCancel={() => setShowNew(false)}
							onBlur={() => setShowNew(false)}
							onKeyDown={(e) => {
								if (e.key === " " || e.key === "Spacebar") {
									e.preventDefault();
									setShowNew(true);
								}
							}}
							onKeyUp={(e) => {
								if (e.key === " " || e.key === "Spacebar" || e.key === "Escape") {
									setShowNew(false);
								}
							}}
						>
							{showNew ? <HiEyeSlash /> : <HiEye />}
						</button>
					</div>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor="confirmNewPassword">Confirm new password</label>
					<input
						id="confirmNewPassword"
						name="confirmNewPassword"
						type="password"
						value={form.confirmNewPassword}
						onChange={handleChange}
						required
						minLength={8}
						autoComplete="new-password"
					/>
				</div>

				<button
					type="submit"
					className={clsx("btn", styles.submitButton)}
					disabled={isPending}
				>
					{isPending ? <SpinnerMini /> : "Change password"}
				</button>
			</form>
		</div>
	);
}
