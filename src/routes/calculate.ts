// routes/calculate.ts
import express, { Request, Response } from 'express';
import { calculateWorkingDate } from '../services/workingDays';
import { QueryParams, SuccessResponse, ErrorResponse } from '../types';

const router = express.Router();

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
router.get('/calculate', async (req: Request, res: Response) => {
  const { days, hours, date } = req.query as QueryParams;

  if (!days && !hours) {
    const error: ErrorResponse = {
      error: 'InvalidParameters',
      message: 'Se debe proporcionar al menos "days" o "hours".',
    };
    return res.status(400).json(error);
  }

  try {
    const result: SuccessResponse = await calculateWorkingDate({ days, hours, date });
    return res.status(200).json(result);
  } catch (err) {
    const error: ErrorResponse = {
      error: 'InternalError',
      message: 'Error interno al calcular la fecha hábil.',
    };
    return res.status(503).json(error);
  }
});

export default router;