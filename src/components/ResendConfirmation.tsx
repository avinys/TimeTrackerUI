import { useResendConfirmation } from "../hooks/useResendConfirmation";
import styles from "../styles/emailConfirm.module.css";

export default function ResendConfirmation({ email }: { email: string }) {
	const { resend, isPending, cooldownSecondsLeft } = useResendConfirmation({
		email: email,
		cooldownSeconds: 60,
	});

	return (
		<div>
			<button
				className="btn btnPrimary"
				onClick={() => resend()}
				disabled={isPending || cooldownSecondsLeft > 0}
			>
				{isPending
					? "Sending…"
					: cooldownSecondsLeft > 0
					? `Resend in ${cooldownSecondsLeft}s`
					: "Resend confirmation email"}
			</button>
		</div>
	);
}
