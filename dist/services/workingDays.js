"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWorkingDate = calculateWorkingDate;
// services/workingDays.ts
const luxon_1 = require("luxon");
const axios_1 = __importDefault(require("axios"));
const timeUtils_1 = require("../utils/timeUtils");
async function calculateWorkingDate(params) {
    const holidays = await fetchColombianHolidays();
    const startDate = params.date
        ? luxon_1.DateTime.fromISO(params.date, { zone: 'utc' }).setZone('America/Bogota')
        : luxon_1.DateTime.now().setZone('America/Bogota');
    let current = (0, timeUtils_1.adjustToWorkingHour)(startDate, holidays);
    if (params.days) {
        current = (0, timeUtils_1.addWorkingDays)(current, params.days, holidays);
    }
    if (params.hours) {
        current = (0, timeUtils_1.addWorkingHours)(current, params.hours, holidays);
    }
    return { date: current.setZone('utc').toISO({ suppressMilliseconds: true }) + 'Z' };
}
async function fetchColombianHolidays() {
    const res = await axios_1.default.get('https://content.capta.co/Recruitment/WorkingDays.json');
    return res.data;
}
