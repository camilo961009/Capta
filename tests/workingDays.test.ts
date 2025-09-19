import { DateTime } from 'luxon';
import { calculateWorkingDate } from '../src/services/workingDays';

describe('calculateWorkingDate', () => {
  test('suma 1 día hábil a una fecha base', async () => {
    const date = DateTime.fromISO('2025-09-18T09:00:00', { zone: 'America/Bogota' }).toISO() ?? undefined;
    const result = await calculateWorkingDate({ date, days: 1, hours: 0 });
    expect(result.date).toBe('2025-09-19T14:00:00.000Z'); // 09:00 Bogotá = 14:00 UTC
  });

  test('suma 3 horas hábiles a una fecha base', async () => {
    const date = DateTime.fromISO('2025-09-18T09:00:00', { zone: 'America/Bogota' }).toISO() ?? undefined;
    const result = await calculateWorkingDate({ date, days: 0, hours: 3 });
    expect(result.date).toBe('2025-09-18T17:00:00.000Z'); // 12:00 Bogotá = 17:00 UTC
  });

  test('suma 1 día y 3 horas hábiles a una fecha base', async () => {
    const date = DateTime.fromISO('2025-09-18T09:00:00', { zone: 'America/Bogota' }).toISO() ?? undefined;
    const result = await calculateWorkingDate({ date, days: 1, hours: 3 });
    expect(result.date).toBe('2025-09-19T17:00:00.000Z'); // 12:00 Bogotá = 17:00 UTC
  });
});
