import { DateTime } from 'luxon';
// Verifica si el día es hábil (ni sábado, ni domingo, ni festivo)
export function isWorkingDay(date: DateTime, holidays: string[]): boolean {
  const isWeekend = date.weekday === 6 || date.weekday === 7;
  const isHoliday = holidays.includes(date.toISODate()!);
  const result = !isWeekend && !isHoliday;
  console.log(`[isWorkingDay] Fecha: ${date.toISODate()} | Weekend: ${isWeekend} | Holiday: ${isHoliday} | Es hábil: ${result}`);
  return result;
}

// Ajusta la hora al bloque laboral más cercano hacia adelante
export function adjustToWorkingHour(date: DateTime, holidays: string[]): DateTime {
  let current = date;
  console.log(`[adjustToWorkingHour] Entrada: ${current.toISO()} | Hora: ${current.hour}`);
  while (!isWorkingDay(current, holidays)) {
    console.log(`[adjustToWorkingHour] No hábil: ${current.toISO()} → avanzando al siguiente día hábil`);
    current = current.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  }
  if (current.hour < 8) {
    console.log(`[adjustToWorkingHour] Antes de jornada: ${current.hour}h → ajustando a 8:00`);
    return current.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  }
  if (current.hour === 12) {
    console.log(`[adjustToWorkingHour] En almuerzo: ${current.hour}h → ajustando a 13:00`);
    return current.set({ hour: 13, minute: 0, second: 0, millisecond: 0 });
  }
  if (current.hour >= 17) {
    let nextDay = current.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    while (!isWorkingDay(nextDay, holidays)) {
      console.log(`[adjustToWorkingHour] Fin de jornada, y próximo día no hábil: ${nextDay.toISO()} → avanzando`);
      nextDay = nextDay.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    }
    console.log(`[adjustToWorkingHour] Fin de jornada: ajustando a ${nextDay.toISO()}`);
    return nextDay;
  }
  console.log(`[adjustToWorkingHour] Fecha ajustada: ${current.toISO()}`);
  return current;
}

// Suma días hábiles
export function addWorkingDays(date: DateTime, days: number, holidays: string[]): DateTime {
  let current = date;
  let daysToAdd = days;
  console.log(`[addWorkingDays] Fecha inicio: ${current.toISODate()} | Días a sumar: ${days}`);
  while (daysToAdd > 0) {
    current = current.plus({ days: 1 });
    if (isWorkingDay(current, holidays)) {
      daysToAdd--;
      console.log(`[addWorkingDays] Sumado día hábil: ${current.toISODate()} | Restan: ${daysToAdd}`);
    } else {
      console.log(`[addWorkingDays] Día no hábil: ${current.toISODate()} | Restan: ${daysToAdd}`);
    }
  }
  console.log(`[addWorkingDays] Fecha final: ${current.toISODate()}`);
  return current;
}

// Suma horas hábiles respetando bloques, almuerzo y fin de jornada
export function addWorkingHours(date: DateTime, hours: number, holidays: string[]): DateTime {
  let current = date;
  let hoursToAdd = hours;
  console.log(`[addWorkingHours] Fecha inicio: ${current.toISO()} | Horas a sumar: ${hours}`);

  while (hoursToAdd > 0) {
    // Si no es día hábil, avanza al siguiente día hábil a las 8am
    while (!isWorkingDay(current, holidays)) {
      console.log(`[addWorkingHours] No hábil: ${current.toISO()} → avanzando a siguiente día hábil`);
      current = current.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    }

    const workStart = current.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
    const lunchStart = current.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    const lunchEnd = current.set({ hour: 13, minute: 0, second: 0, millisecond: 0 });
    const workEnd = current.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

    // Si está en el bloque de almuerzo, salta a 1pm
    if (current >= lunchStart && current < lunchEnd) {
      console.log(`[addWorkingHours] Almuerzo: saltando de ${current.toISO()} a ${lunchEnd.toISO()}`);
      current = lunchEnd;
      continue;
    }

    // Si está antes del inicio de jornada, ajusta a 8am
    if (current < workStart) {
      console.log(`[addWorkingHours] Antes de jornada: saltando de ${current.toISO()} a ${workStart.toISO()}`);
      current = workStart;
      continue;
    }

    // Si está después de fin de jornada, avanza al próximo día hábil a las 8am
    if (current >= workEnd) {
      let nextDay = current.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      while (!isWorkingDay(nextDay, holidays)) {
        console.log(`[addWorkingHours] Fin de jornada y siguiente día no hábil: ${nextDay.toISO()} → avanzando`);
        nextDay = nextDay.plus({ days: 1 }).set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      }
      console.log(`[addWorkingHours] Fin de jornada: saltando de ${current.toISO()} a ${nextDay.toISO()}`);
      current = nextDay;
      continue;
    }

    // Calcula cuántas horas quedan en el bloque actual
    let maxHour = workEnd;
    if (current < lunchStart) {
      maxHour = lunchStart; // Hasta el almuerzo
    } else if (current >= lunchEnd && current < workEnd) {
      maxHour = workEnd; // Hasta fin de jornada
    }

    let diff = maxHour.diff(current, 'hours').hours;
    diff = Math.floor(diff * 1000) / 1000; // Redondeo para evitar decimales raros

    // LOG de depuración principal
    console.log(`[addWorkingHours] Bloque laboral: desde ${current.toISO()} hasta ${maxHour.toISO()} | Horas en bloque: ${diff} | Horas restantes: ${hoursToAdd}`);

    if (hoursToAdd <= diff) {
      // Se puede sumar todo en el bloque actual
      current = current.plus({ hours: hoursToAdd });
      console.log(`[addWorkingHours] Suma final: sumo ${hoursToAdd} horas, nueva fecha: ${current.toISO()}`);
      hoursToAdd = 0;
    } else {
      // Avanza al siguiente bloque y descuenta las horas sumadas
      current = maxHour;
      hoursToAdd -= diff;
      console.log(`[addWorkingHours] Suma parcial: sumo ${diff} horas, avanzo a siguiente bloque. Horas restantes: ${hoursToAdd}, nueva fecha: ${current.toISO()}`);
    }
  }
  console.log(`[addWorkingHours] Fecha final: ${current.toISO()}`);
  return current;
}