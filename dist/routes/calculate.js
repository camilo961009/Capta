"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/calculate.ts
const express_1 = __importDefault(require("express"));
const workingDays_1 = require("../services/workingDays");
const router = express_1.default.Router();
router.get('/calculate', async (req, res) => {
    const { days, hours, date } = req.query;
    if (!days && !hours) {
        const error = {
            error: 'InvalidParameters',
            message: 'Se debe proporcionar al menos "days" o "hours".',
        };
        return res.status(400).json(error);
    }
    try {
        const result = await (0, workingDays_1.calculateWorkingDate)({ days, hours, date });
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
