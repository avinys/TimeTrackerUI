export function formatTime(seconds: number) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export function formatDate(input: Date | string | number): string {
    const date = input instanceof Date ? input : new Date(input);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date input');
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getTimeDifference(
  input1: Date | string | number,
  input2: Date | string | number
): number {
  const date1 = input1 instanceof Date ? input1 : new Date(input1);
  const date2 = input2 instanceof Date ? input2 : new Date(input2);

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    throw new Error('Invalid date input');
  }

  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diffMs / 1000); // return difference in seconds
}