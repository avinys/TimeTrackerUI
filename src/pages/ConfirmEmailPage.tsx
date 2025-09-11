import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfirmEmail } from "../hooks/useConfirmEmail";
import styles from "../styles/emailConfirm.module.css";

export default function ConfirmEmailPage() {
	const [sp] = useSearchParams();
	const userId = sp.get("userId");
	const token = sp.get("token");

	const { confirmEmail, isPending, isError } = useConfirmEmail();
	const [message, setMessage] = useState("Confirming…");

	useEffect(() => {
		if (!userId || !token) {
			setMessage("Missing confirmation parameters.");
			return;
		}

		confirmEmail({ userId: Number(userId), token });
	}, [userId, token, confirmEmail]);

	return (
		<div className={clsx("container", styles.container)}>
			<h1>Email confirmation</h1>
			<p>{isPending && !isError ? "Confirming…" : message}</p>
		</div>
	);
}
