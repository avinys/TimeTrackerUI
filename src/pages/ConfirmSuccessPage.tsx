// src/pages/ConfirmSuccessPage.tsx
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/emailConfirm.module.css";
import clsx from "clsx";

export default function ConfirmSuccessPage() {
	const navigate = useNavigate();
	return (
		<div className={clsx("container", styles.container)}>
			<h1>All set!</h1>
			<p>Your email has been confirmed. You can now log in.</p>
			<div>
				<button className="btn btnPrimary" onClick={() => navigate("/login")}>
					Go to Login
				</button>
			</div>
		</div>
	);
}
