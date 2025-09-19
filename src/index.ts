import express from 'express';
import calculateRoute from './routes/calculate';
import { setupSwagger } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

setupSwagger(app); // ← esto activa /docs

app.use('/', calculateRoute);

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
});
