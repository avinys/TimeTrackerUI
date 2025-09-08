import { isAxiosError } from "axios";

export function apiMessage(err: unknown, fallback = "Request failed") {
	if (isAxiosError(err)) {
		const msg = err.response?.data?.message;
		if (typeof msg === "string" && msg.trim()) return msg;
	}
	return fallback;
}
