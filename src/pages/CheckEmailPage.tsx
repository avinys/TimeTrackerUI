import { useSearchParams } from "react-router-dom";
import ResendConfirmation from "../components/ResendConfirmation";
import styles from "../styles/emailConfirm.module.css";
import clsx from "clsx";

export default function CheckEmailPage() {
	const [sp] = useSearchParams();
	const email = sp.get("email") ?? "";

	return (
		<div className={clsx("container", styles.container)}>
			<h1 className="page-title">Confirm your email</h1>
			<p>
				We’ve sent a confirmation link to <strong>{email || "your email address"}</strong>.
				Click the link to activate your account.
			</p>
			<p>If you didn’t get it, you can resend below.</p>
			<ResendConfirmation email={email} />
		</div>
	);
}
