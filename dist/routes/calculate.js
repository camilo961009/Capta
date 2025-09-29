"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/calculate.ts
const express_1 = __importDefault(require("express"));
const workingDays_1 = require("../services/workingDays");
const luxon_1 = require("luxon");
const router = express_1.default.Router();
/**
 * @openapi
 * /calculate:
 *   get:
 *     summary: Calcula una fecha hábil en Colombia
 *     description: Suma días y/o horas hábiles a una fecha base, aplicando reglas laborales colombianas.
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Número de días hábiles a sumar
 *       - in: query
 *         name: hours
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Número de horas hábiles a sumar
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         description: Fecha base en formato UTC ISO 8601 (con sufijo Z)
 *     responses:
 *       200:
 *         description: Fecha hábil calculada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-01T14:00:00Z"
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *       503:
 *         description: Error interno
 */
router.get('/calculate', async (req, res) => {
    const daysRaw = req.query.days;
    const hoursRaw = req.query.hours;
    const dateRaw = req.query.date;
    const days = daysRaw !== undefined ? Number(daysRaw) : undefined;
    const hours = hoursRaw !== undefined ? Number(hoursRaw) : undefined;
    if ((daysRaw !== undefined && (isNaN(Number(daysRaw)) || !Number.isInteger(Number(daysRaw)) || Number(daysRaw) < 0)) ||
        (hoursRaw !== undefined && (isNaN(Number(hoursRaw)) || !Number.isInteger(Number(hoursRaw)) || Number(hoursRaw) < 0))) {
        const error = {
            error: 'InvalidParameters',
            message: 'Los parámetros "days" y "hours" deben ser enteros positivos.',
        };
        return res.status(400).json(error);
    }
    if (days === undefined && hours === undefined) {
        const error = {
            error: 'InvalidParameters',
            message: 'Se debe proporcionar al menos "days" o "hours".',
        };
        return res.status(400).json(error);
    }
    if (dateRaw !== undefined) {
        const date = luxon_1.DateTime.fromISO(dateRaw, { zone: 'utc' });
        if (!date.isValid) {
            const error = {
                error: 'InvalidParameters',
                message: 'El parámetro "date" debe ser una fecha ISO 8601 válida en UTC.',
            };
            return res.status(400).json(error);
        }
    }
    try {
        const result = await (0, workingDays_1.calculateWorkingDate)({ days, hours, date: dateRaw });
        return res.status(200).json(result);
    }
    catch (err) {
        const error = {
            error: 'InternalError',
            message: 'Error interno al calcular la fecha hábil.',
        };
        return res.status(503).json(error);
    }
});
exports.default = router;
