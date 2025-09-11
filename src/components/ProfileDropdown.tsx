import { useRef, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLogout } from "../hooks/useLogout";
import { UserIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "../styles/profileDropdown.module.css";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
	const { user } = useAuth();
	const { logout } = useLogout();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// close on outside click / Esc
	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onKey);
		};
	}, []);

	const shortName = user?.username
		? user.username.length > 20
			? `${user.username.slice(0, 17)}…`
			: user.username
		: "";

	return (
		<div className={styles.container} ref={ref}>
			<button
				type="button"
				className={styles.trigger}
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((p) => !p)}
				id="profile-trigger"
			>
				<span className={styles.bubble}>
					<UserIcon className={styles.icon} aria-hidden="true" />
				</span>
				<span className={styles.username}>{shortName}</span>
				<ChevronDownIcon
					className={clsx(styles.chevron, open && styles.open)}
					strokeWidth={2}
					aria-hidden="true"
				/>
			</button>

			{open && (
				<div className={styles.menu} role="menu" aria-labelledby="profile-trigger">
					<button
						className={styles.menuItem}
						role="menuitem"
						onClick={() => navigate("/me/password")}
					>
						Change Password
					</button>
					<hr className={styles.sep} />
					<button className={styles.menuItem} role="menuitem" onClick={() => logout()}>
						Log out
					</button>
				</div>
			)}
		</div>
	);
}
