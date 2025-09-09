declare global {
	interface Window {
		google?: {
			accounts: {
				id: {
					initialize: (opts: any) => void;
					renderButton: (el: HTMLElement, opts?: any) => void;
					prompt: (cb?: (n: any) => void) => void;
				};
			};
		};
	}
}
export {};
