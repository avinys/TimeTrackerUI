import { useEffect, useRef, type MutableRefObject } from "react";

export function useOutsideClick<T extends HTMLElement>(
	handler: (event: MouseEvent) => void,
	listenCapturing = true
): MutableRefObject<T | null> {
	const ref = useRef<T>(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const element = ref.current;
			if (!element) return;

			const target = e.target as Node | null;
			if (target && element.contains(target)) return;

			handler(e);
		};

		// The true at the end prevents the event bubbling
		document.addEventListener("click", handleClick, listenCapturing);

		return () => document.removeEventListener("click", handleClick, listenCapturing);
	}, [handler, listenCapturing]);

	return ref;
}
