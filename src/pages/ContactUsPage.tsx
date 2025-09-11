// src/pages/ContactUsPage.tsx
import { useState } from "react";
import clsx from "clsx";
import { useContactUs } from "../hooks/useContactUs";
import styles from "../styles/form.module.css";
import SpinnerMini from "../components/SpinnerMini";

const NAME_MAX = 100;
const EMAIL_MAX = 255;
const SUBJECT_MAX = 120;
const MESSAGE_MAX = 4000;

export default function ContactUsPage() {
	const { sendMessage, isPending } = useContactUs();
	const [form, setForm] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
		phone: "",
		website: "", // honeypot (hidden)
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name || !form.email || !form.message) return;

		sendMessage(
			{
				name: form.name.trim(),
				email: form.email.trim().toLowerCase(),
				subject: form.subject.trim(),
				message: form.message.trim(),
				phone: form.phone.trim(),
				website: form.website, // stays empty for humans
			},
			{
				onSuccess: () =>
					setForm({
						name: "",
						email: "",
						subject: "",
						message: "",
						phone: "",
						website: "",
					}),
			}
		);
	};

	return (
		<div className={styles.container}>
			<h2 className="page-title">Contact us</h2>

			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.inputGroup}>
					<label htmlFor="name">Your name</label>
					<input
						id="name"
						name="name"
						type="text"
						value={form.name}
						onChange={handleChange}
						required
						maxLength={NAME_MAX}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={form.email}
						onChange={handleChange}
						required
						maxLength={EMAIL_MAX}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor="phone">Phone (optional)</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						value={form.phone}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor="subject">Subject (optional)</label>
					<input
						id="subject"
						name="subject"
						type="text"
						value={form.subject}
						onChange={handleChange}
						maxLength={SUBJECT_MAX}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor="message">Message</label>
					<textarea
						id="message"
						name="message"
						value={form.message}
						onChange={handleChange}
						required
						rows={6}
						className={styles.textarea}
						placeholder="How can we help?"
						maxLength={MESSAGE_MAX}
						aria-describedby="message-counter"
					/>
					<div id="message-counter" className={styles.charCounter} aria-live="polite">
						{form.message.length}/{MESSAGE_MAX}
					</div>
				</div>

				{/* honeypot field (hidden from users) */}
				<div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
					<label htmlFor="website">Website</label>
					<input
						id="website"
						name="website"
						type="text"
						value={form.website}
						onChange={handleChange}
						tabIndex={-1}
						autoComplete="off"
					/>
				</div>

				<button
					type="submit"
					className={clsx("btn", styles.submitButton)}
					disabled={isPending}
				>
					{isPending ? <SpinnerMini /> : "Send message"}
				</button>
			</form>
		</div>
	);
}
