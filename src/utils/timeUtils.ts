// utils/timeUtils.ts
import { DateTime } from 'luxon';

export function isWorkingDay(date: DateTime, holidays: string[]): boolean {
  const isWeekend = date.weekday > 5;
  const isHoliday = holidays.includes(date.toISODate() ?? '');
  return !isWeekend && !isHoliday;
}

export function adjustToWorkingHour(date: DateTime, holidays: string[]): DateTime {
  let adjusted = date;

  while (!isWorkingDay(adjusted, holidays)) {
    adjusted = adjusted.minus({ days: 1 }).set({ hour: 17, minute: 0 });
  }

  const hour = adjusted.hour;
  if (hour < 8) return adjusted.set({ hour: 8, minute: 0 });
  if (hour >= 12 && hour < 13) return adjusted.set({ hour: 13, minute: 0 });
  if (hour >= 17) return adjusted.plus({ days: 1 }).set({ hour: 8, minute: 0 });

  return adjusted;
}

export function addWorkingDays(date: DateTime, days: number, holidays: string[]): DateTime {
  let current = date;
  let added = 0;

  while (added < days) {
    current = current.plus({ days: 1 });
    if (isWorkingDay(current, holidays)) added++;
  }

  return current.set({ hour: date.hour, minute: date.minute });
}

export function addWorkingHours(date: DateTime, hours: number, holidays: string[]): DateTime {
  let current = date;
  let remaining = hours;

  while (remaining > 0) {
    if (!isWorkingDay(current, holidays)) {
      current = current.plus({ days: 1 }).set({ hour: 8, minute: 0 });
      continue;
    }

    const hour = current.hour;
    const minute = current.minute;

    const isLunch = hour >= 12 && hour < 13;
    if (isLunch) {
      current = current.set({ hour: 13, minute: 0 });
      continue;
    }

    const endOfDay = current.set({ hour: 17, minute: 0 });
    const availableMinutes = endOfDay.diff(current, 'minutes').minutes;

    const toAdd = Math.min(remaining * 60, availableMinutes);
    current = current.plus({ minutes: toAdd });
    remaining -= toAdd / 60;

    if (remaining > 0) {
      current = current.plus({ days: 1 }).set({ hour: 8, minute: 0 });
    }
  }

  return current;
}
