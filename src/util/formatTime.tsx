export function formatTime(seconds: number) {
	const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
	const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
	const s = String(seconds % 60).padStart(2, "0");
	return `${h}:${m}:${s}`;
}

export function formatDate(input: Date | string | number): string {
	const date = input instanceof Date ? input : new Date(input);

	if (isNaN(date.getTime())) {
		throw new Error("Invalid date input");
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function toLocalInputValue(value?: Date | string | null, withSeconds = false): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) return "";

	const pad = (n: number) => String(n).padStart(2, "0");
	const y = d.getFullYear();
	const m = pad(d.getMonth() + 1);
	const day = pad(d.getDate());
	const hh = pad(d.getHours());
	const mm = pad(d.getMinutes());
	const ss = pad(d.getSeconds());

	return withSeconds ? `${y}-${m}-${day}T${hh}:${mm}:${ss}` : `${y}-${m}-${day}T${hh}:${mm}`;
}
// reverse: from <input type="datetime-local"> to ISO UTC
export function localInputToIso(localValue: string): string {
	return new Date(localValue).toISOString();
}
