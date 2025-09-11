// utils/httpErrors.ts
import { AxiosError, isAxiosError } from "axios";

type ProblemDetails = {
	detail?: string;
	errors?: Record<string, string[]>;
	message?: string;
};

function firstValidationError(err: AxiosError<ProblemDetails>) {
	const bag = err.response?.data?.errors;
	if (!bag) return undefined;
	const firstKey = Object.keys(bag)[0];
	const first = firstKey ? bag[firstKey]?.[0] : undefined;
	return first;
}

export function friendlyAuthError(
	err: unknown,
	ctx: "login" | "register" | "Google sign-in"
): string {
	if (isAxiosError<ProblemDetails>(err)) {
		const status = err.response?.status;

		// Login cases
		if (ctx === "login") {
			if (status === 400 || status === 401) return "Incorrect username or password.";
			if (status && status >= 500) return "Server error. Please try again.";
		}

		// Register cases
		if (ctx === "register") {
			if (status === 409) return "That username or email is already taken.";
			if (status === 400 || status === 422) {
				return firstValidationError(err) ?? "Please check your inputs and try again.";
			}
			if (status && status >= 500) return "Server error. Please try again.";
		}

		// Generic API error with a message
		const msg = err.response?.data?.detail || err.response?.data?.message;
		if (msg) return msg;
	}

	// Network or unknown
	return "Network error. Please check your connection and try again.";
}
