import { useEffect, useRef } from "react";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

type GoogleSignInButtonProps = {
	onSuccess?: () => void;
};

function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
	const btnRef = useRef<HTMLDivElement>(null);
	const initializedRef = useRef(false);
	const onSuccessRef = useRef(onSuccess);
	onSuccessRef.current = onSuccess;

	const { googleLogin, isPending } = useGoogleLogin();
	const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

	useEffect(() => {
		if (!clientId) return;
		if (initializedRef.current) return;
		if (!window.google?.accounts?.id) {
			// wait for script
			const t = setInterval(() => {
				if (window.google?.accounts?.id) {
					clearInterval(t);
					init();
				}
			}, 100);
			return () => clearInterval(t);
		}
		init();

		function init() {
			if (initializedRef.current) return;
			initializedRef.current = true;

			window.google!.accounts.id.initialize({
				client_id: clientId,
				callback: (resp: any) => {
					const idToken = resp?.credential;
					if (!idToken) return;
					googleLogin(idToken, { onSuccess: () => onSuccessRef.current?.() });
				},
				auto_select: false,
				itp_support: true,
			});

			if (btnRef.current) {
				window.google!.accounts.id.renderButton(btnRef.current, {
					theme: "outline", // (fix typo)
					size: "large",
					text: "signin_with",
					shape: "rectangular",
				});
			}
		}
	}, [clientId]);

	return (
		<div style={{ marginTop: 16 }}>
			<div ref={btnRef} />
			{isPending && <p>Signing in…</p>}
		</div>
	);
}

export default GoogleSignInButton;
