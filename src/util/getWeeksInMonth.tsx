import { startOfMonth, endOfMonth, startOfWeek, addWeeks, isBefore, format } from 'date-fns';

export function getWeeksInMonth(year: number, month: number): { label: string, start: Date, end: Date }[] {
  const start = startOfWeek(startOfMonth(new Date(year, month)), { weekStartsOn: 1 });
  const end = endOfMonth(new Date(year, month));

  const weeks = [];
  let current = start;

  while (isBefore(current, end)) {
    const weekStart = current;
    const weekEnd = addWeeks(weekStart, 1);
    weeks.push({
      label: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
      start: weekStart,
      end: weekEnd,
    });
    current = weekEnd;
  }

  return weeks;
}