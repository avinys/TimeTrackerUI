import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";

type Options = {
	email: string; // required, always passed in
	cooldownSeconds?: number; // e.g. 60s
	storageKeyPrefix?: string;
};

export function useResendConfirmation({
	email,
	cooldownSeconds = 60,
	storageKeyPrefix = "resendConfirm",
}: Options) {
	const [expiresAt, setExpiresAt] = useState<number | null>(null);
	const [now, setNow] = useState(Date.now());
	const tickRef = useRef<number | null>(null);

	const key = useMemo(
		() => `${storageKeyPrefix}:${email.trim().toLowerCase()}`,
		[email, storageKeyPrefix]
	);

	// load persisted cooldown
	useEffect(() => {
		const raw = localStorage.getItem(key);
		if (raw) {
			const ts = Number(raw);
			if (!Number.isNaN(ts) && ts > Date.now()) setExpiresAt(ts);
			else localStorage.removeItem(key);
		}
	}, [key]);

	// tick every second
	useEffect(() => {
		if (!expiresAt) return;
		if (tickRef.current) window.clearInterval(tickRef.current);

		tickRef.current = window.setInterval(() => {
			setNow(Date.now());
		}, 1000);

		return () => {
			if (tickRef.current) window.clearInterval(tickRef.current);
		};
	}, [expiresAt]);

	const secondsLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / 1000)) : 0;

	const startCooldown = (seconds = cooldownSeconds) => {
		const ts = Date.now() + seconds * 1000;
		setExpiresAt(ts);
		localStorage.setItem(key, String(ts));
	};

	const { mutateAsync, isPending, isSuccess, isError, error, reset } = useMutation({
		mutationFn: () => AuthService.resendConfirmation(email),
		onSuccess: () => {
			startCooldown();
		},
	});

	async function resend() {
		if (!email || secondsLeft > 0) return;
		await mutateAsync();
	}

	return {
		resend,
		isPending,
		isSuccess,
		isError,
		error,
		cooldownSecondsLeft: secondsLeft,
		reset,
	};
}
