// src/pages/ConfirmEmailPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConfirmEmail } from "../hooks/useConfirmEmail";
import clsx from "clsx";
import styles from "../styles/emailConfirm.module.css";

export default function ConfirmEmailPage() {
	const [sp] = useSearchParams();
	const navigate = useNavigate();
	const userId = sp.get("userId");
	const token = sp.get("token");

	const { confirmEmail, isPending, isError } = useConfirmEmail();
	const [message, setMessage] = useState("Confirming…");

	useEffect(() => {
		if (!userId || !token) {
			setMessage("Missing confirmation parameters.");
			return;
		}

		confirmEmail(
			{ userId: Number(userId), token },
			{
				onSuccess: () => navigate("/confirm/success"),
				onError: () => setMessage("Invalid or expired confirmation link."),
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, token]);

	return (
		<div className={clsx("container", styles.container)}>
			<h1>Email confirmation</h1>
			<p>{isPending && !isError ? "Confirming…" : message}</p>
		</div>
	);
}
