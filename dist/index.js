"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calculate_1 = __importDefault(require("./routes/calculate"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, swagger_1.setupSwagger)(app); // ← esto activa /docs
app.use('/', calculate_1.default);
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en puerto ${PORT}`);
});
