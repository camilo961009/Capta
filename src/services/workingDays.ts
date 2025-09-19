// services/workingDays.ts
import { DateTime } from 'luxon';
import axios from 'axios';
import { QueryParams, SuccessResponse } from '../types';
import { isWorkingDay, adjustToWorkingHour, addWorkingDays, addWorkingHours } from '../utils/timeUtils';

export async function calculateWorkingDate(params: QueryParams): Promise<SuccessResponse> {
  const holidays = await fetchColombianHolidays();
  const startDate = params.date
    ? DateTime.fromISO(params.date, { zone: 'utc' }).setZone('America/Bogota')
    : DateTime.now().setZone('America/Bogota');

  let current = adjustToWorkingHour(startDate, holidays);

  if (params.days) {
    current = addWorkingDays(current, params.days, holidays);
  }

  if (params.hours) {
    current = addWorkingHours(current, params.hours, holidays);
  }

  return { date: current.setZone('utc').toISO() ?? '' };
}

async function fetchColombianHolidays(): Promise<string[]> {
  const res = await axios.get('https://content.capta.co/Recruitment/WorkingDays.json');
  return res.data as string[];
}
